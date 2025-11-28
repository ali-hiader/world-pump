const sendMailEdge = async (to: string, subject: string, html: string, baseUrl?: string) => {
   if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('⚠️ SMTP credentials not set. Email would be sent to:', to, 'Subject:', subject)
      return
   }

   try {
      console.log('🌐 [sendMailEdge] Starting email send request')
      console.log('🌐 VERCEL_ENV:', process.env.VERCEL_ENV || 'not set')
      console.log('🌐 NODE_ENV:', process.env.NODE_ENV || 'not set')
      console.log('🌐 baseUrl provided:', baseUrl || 'not provided')

      // 🔧 Build URL based on environment:
      // - Always use absolute URL for server-side fetch requirement
      // - In production, use NEXT_PUBLIC_APP_URL or provided baseUrl
      const getBaseUrl = () => {
         if (baseUrl) return baseUrl
         if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
         return 'http://localhost:3000'
      }

      const url = `${getBaseUrl()}/api/internal/send-email`

      console.log('🌐 Calling internal API at:', url)

      // Use fetch to call our internal API route that runs in Node.js runtime
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            to,
            subject,
            html,
         }),
      })

      if (!response.ok) {
         const errorText = await response.text()
         console.error('🌐 API response error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
         })
         throw new Error(`Failed to send email: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Email sent successfully:', result.messageId)
      return { id: result.messageId }
   } catch (error) {
      console.error('❌ [sendMailEdge] Email sending error:', error)
      if (error instanceof Error) {
         console.error('❌ [sendMailEdge] Error message:', error.message)
         console.error('❌ [sendMailEdge] Error stack:', error.stack)
      }
      throw error
   }
}

export default sendMailEdge
