declare namespace NodeJS {
   interface ProcessEnv {
      DATABASE_URL: string

      BETTER_AUTH_URL: string
      BETTER_AUTH_SECRET: string

      NEXT_PUBLIC_APP_URL: string

      CLOUDINARY_CLOUD_NAME: string
      CLOUDINARY_API_KEY: string
      CLOUDINARY_API_SECRET: string

      JWT_SECRET: string

      SMTP_HOST: string
      SMTP_PORT: string
      SMTP_USER: string
      SMTP_PASS: string
      SMTP_FROM: string
      FROM_EMAIL?: string

      // Admin
      SUPER_ADMIN_EMAILS?: string // Comma-separated list of admin emails

      // Company Info (optional)
      COMPANY_NAME?: string
      COMPANY_ADDRESS?: string
      COMPANY_EMAIL?: string
      COMPANY_PHONE?: string
      SUPPORT_EMAIL?: string
   }
}
