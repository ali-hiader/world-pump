/**
 * Standardized Error Classes for Server Actions
 * Provides consistent error handling across the application
 */

export class ValidationError extends Error {
   constructor(message: string) {
      super(message)
      this.name = 'ValidationError'
   }
}

export class NotFoundError extends Error {
   constructor(resource: string, identifier?: string | number) {
      const message = identifier
         ? `${resource} with identifier ${identifier} not found`
         : `${resource} not found`
      super(message)
      this.name = 'NotFoundError'
   }
}

export class UnauthorizedError extends Error {
   constructor(message: string = 'Unauthorized access') {
      super(message)
      this.name = 'UnauthorizedError'
   }
}

export class DatabaseError extends Error {
   constructor(operation: string, details?: string) {
      const message = `Database ${operation} failed${details ? `: ${details}` : ''}`
      super(message)
      this.name = 'DatabaseError'
   }
}
