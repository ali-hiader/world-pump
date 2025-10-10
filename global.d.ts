declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string

    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string

    NEXT_PUBLIC_BASE_URL: string

    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string

    JWT_SECRET: string

    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASS: string
    SMTP_FROM: string
  }
}
