import nodemailer from 'nodemailer'

import { EMAIL_CONFIG as EMAIL } from '@/lib/constants'
import { logger } from '@/lib/logger'

interface EmailOptions {
   to: string
   subject: string
   html: string
}

interface EmailResult {
   id: string
   error?: string
}

function validateEmailEnv(): boolean {
   const required = ['SMTP_USER', 'SMTP_PASSWORD', 'SMTP_HOST', 'SMTP_PORT']
   const missing = required.filter((key) => !process.env[key])

   if (missing.length > 0) {
      logger.warn('Missing SMTP environment variables', { missing })
      return false
   }

   return true
}

function createTransporter() {
   return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.simply.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASSWORD,
      },
      tls: {
         rejectUnauthorized: false, // Allow self-signed certificates
      },
      connectionTimeout: EMAIL.timeout.connection,
      greetingTimeout: EMAIL.timeout.greeting,
      socketTimeout: EMAIL.timeout.socket,
      pool: true,
      maxConnections: 1,
      maxMessages: 1,
      rateLimit: 1,
   })
}

async function sendEmailNodejs(options: EmailOptions): Promise<EmailResult> {
   const { to, subject, html } = options

   logger.debug('Email sending attempt', {
      to,
      subject,
      hasCredentials: !!process.env.SMTP_USER,
   })

   if (!validateEmailEnv()) {
      logger.warn('SMTP credentials not configured - email not sent', { to, subject })
      return { id: 'no-credentials', error: 'SMTP not configured' }
   }

   try {
      const transporter = createTransporter()

      const mailOptions = {
         from: process.env.FROM_EMAIL || process.env.SMTP_USER,
         to,
         subject,
         html,
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
         setTimeout(() => reject(new Error('Email sending timed out')), EMAIL.timeout.total),
      )

      const sendPromise = transporter.sendMail(mailOptions)
      const info = await Promise.race([sendPromise, timeoutPromise])

      logger.success('Email sent successfully', { messageId: info.messageId, to })
      return { id: info.messageId }
   } catch (error) {
      logger.error('Email sending failed', error, { to, subject })

      // Handle specific SMTP timeout errors gracefully
      if (error instanceof Error) {
         if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            logger.warn('SMTP timeout - service may be experiencing issues')
            return { id: 'timeout-error', error: 'SMTP timeout' }
         }
      }

      throw error
   }
}

/**
 * Send email via internal API (Edge runtime fallback)
 */
async function sendEmailEdge(options: EmailOptions): Promise<EmailResult> {
   const { to, subject, html } = options

   if (!validateEmailEnv()) {
      logger.warn('SMTP credentials not configured - email not sent', { to, subject })
      return { id: 'no-credentials', error: 'SMTP not configured' }
   }

   try {
      const baseUrl =
         process.env.NEXT_PUBLIC_APP_URL ||
         (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

      const url = `${baseUrl}/api/internal/send-email`

      logger.debug('Calling internal email API', { url })

      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ to, subject, html }),
      })

      if (!response.ok) {
         const errorText = await response.text()
         logger.error('Email API request failed', null, {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
         })
         throw new Error(`Failed to send email: ${response.statusText}`)
      }

      const result = await response.json()
      logger.success('Email sent via API', { messageId: result.messageId, to })
      return { id: result.messageId }
   } catch (error) {
      logger.error('Email API call failed', error, { to, subject })
      throw error
   }
}

function isEdgeRuntime(): boolean {
   return process.env.NEXT_RUNTIME === 'edge'
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
   if (isEdgeRuntime()) {
      logger.debug('Using Edge runtime email sender')
      return sendEmailEdge(options)
   } else {
      logger.debug('Using Node.js runtime email sender')
      return sendEmailNodejs(options)
   }
}
