import { NextResponse } from 'next/server'

import { UnauthorizedError } from '@/lib/errors'
import { logger } from '@/lib/logger'

interface ApiSuccessResponse<T = unknown> {
   success: true
   data: T
   message?: string
}

interface ApiErrorResponse {
   success: false
   error: string
   details?: unknown
}

export function apiSuccess<T>(data: T, message?: string, status: number = 200): NextResponse {
   const response: ApiSuccessResponse<T> = {
      success: true,
      data,
      ...(message && { message }),
   }

   return NextResponse.json(response, { status })
}

export function apiError(
   error: string | Error | unknown,
   status: number = 500,
   details?: unknown,
): NextResponse {
   let errorMessage: string

   if (error instanceof Error) {
      errorMessage = error.message
      logger.error('API Error', error)
   } else if (typeof error === 'string') {
      errorMessage = error
      logger.error('API Error', new Error(error))
   } else {
      errorMessage = 'An unexpected error occurred'
      logger.error('API Error', error)
   }

   const response: ApiErrorResponse = {
      success: false,
      error: errorMessage,
   }

   if (details !== undefined) {
      response.details = details
   }

   return NextResponse.json(response, { status })
}

export function apiUnauthorized(message: string = 'Unauthorized'): NextResponse {
   return apiError(message, 401)
}

export function apiForbidden(message: string = 'Forbidden'): NextResponse {
   return apiError(message, 403)
}

export function apiNotFound(resource: string = 'Resource'): NextResponse {
   return apiError(`${resource} not found`, 404)
}

export function apiBadRequest(message: string = 'Bad request'): NextResponse {
   return apiError(message, 400)
}

export function apiValidationError(
   message: string = 'Validation failed',
   details?: unknown,
): NextResponse {
   return apiError(message, 422, details)
}

export function handleApiError(error: unknown): NextResponse {
   if (error instanceof UnauthorizedError) {
      return apiUnauthorized(error.message)
   }

   // Handle Zod validation errors
   if (error && typeof error === 'object' && 'issues' in error) {
      return apiValidationError('Validation failed', error)
   }

   // Handle generic errors
   if (error instanceof Error) {
      return apiError(error.message)
   }

   // Fallback for unknown errors
   return apiError('An unexpected error occurred')
}
