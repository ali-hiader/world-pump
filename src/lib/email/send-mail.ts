import nodemailer from 'nodemailer'

const createTransporter = () => {
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
      // Add timeout and connection limits for better resilience
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 40000, // 40 seconds
      pool: true, // Use connection pooling
      maxConnections: 1, // Single connection to avoid rate limits
      maxMessages: 1, // One message per connection
      rateLimit: 1, // Max 1 message per second
   })
}

const sendMail = async (to: string, subject: string, html: string) => {
   // 🔍 Diagnostic logging
   console.log('📧 Email sending attempt started')
   console.log(
      '🔐 SMTP_USER:',
      process.env.SMTP_USER ? `SET (${process.env.SMTP_USER})` : '❌ MISSING',
   )
   console.log(
      '🔐 SMTP_PASSWORD:',
      process.env.SMTP_PASSWORD
         ? `SET (${process.env.SMTP_PASSWORD.substring(0, 3)}***)`
         : '❌ MISSING',
   )
   console.log('🔐 SMTP_HOST:', process.env.SMTP_HOST || '❌ MISSING')
   console.log('🔐 SMTP_PORT:', process.env.SMTP_PORT || '❌ MISSING')
   console.log('🔐 FROM_EMAIL:', process.env.FROM_EMAIL || '❌ MISSING')
   console.log('📬 Recipient:', to)
   console.log('📝 Subject:', subject)

   if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('⚠️ SMTP credentials not set. Email would be sent to:', to, 'Subject:', subject)
      return
   }

   try {
      console.log('🔧 Creating SMTP transporter...')
      const transporter = createTransporter()

      const mailOptions = {
         from: process.env.FROM_EMAIL || process.env.SMTP_USER,
         to,
         subject,
         html,
      }

      // Add timeout to email sending
      const timeoutPromise = new Promise<never>((_, reject) =>
         setTimeout(() => reject(new Error('Email sending timed out')), 45000),
      )

      console.log('📤 Attempting to send email via SMTP...')
      const sendPromise = transporter.sendMail(mailOptions)
      const info = await Promise.race([sendPromise, timeoutPromise])

      console.log('✅ Email sent successfully:', info.messageId)
      return { id: info.messageId }
   } catch (error) {
      console.error('❌ Email sending error:', error)
      console.error('❌ Error details:', {
         message: error instanceof Error ? error.message : 'Unknown error',
         name: error instanceof Error ? error.name : 'Unknown',
         stack: error instanceof Error ? error.stack : 'No stack trace',
      })

      // Handle specific SMTP timeout errors
      if (error instanceof Error) {
         if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            console.warn('SMTP timeout detected - email service may be experiencing issues')
            // Don't throw for timeout errors to prevent cascading failures
            return { id: 'timeout-error', error: 'SMTP timeout' }
         }
      }

      throw error
   }
}

export default sendMail
