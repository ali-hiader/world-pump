/**
 * Centralized in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

import type { NextRequest } from 'next/server'

import { RATE_LIMITS } from './constants'
import { logger } from './logger'

interface RateLimitEntry {
   count: number
   resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

setInterval(
   () => {
      const now = Date.now()
      for (const [key, entry] of rateLimitStore.entries()) {
         if (entry.resetAt < now) {
            rateLimitStore.delete(key)
         }
      }
   },
   10 * 60 * 1000,
)

export interface RateLimitConfig {
   maxRequests: number
   windowMs: number
}

export interface RateLimitResult {
   allowed: boolean
   remaining: number
   resetAt: number
}

export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
   const now = Date.now()
   const entry = rateLimitStore.get(identifier)

   if (!entry || entry.resetAt < now) {
      const resetAt = now + config.windowMs
      rateLimitStore.set(identifier, { count: 1, resetAt })
      return {
         allowed: true,
         remaining: config.maxRequests - 1,
         resetAt,
      }
   }

   if (entry.count >= config.maxRequests) {
      return {
         allowed: false,
         remaining: 0,
         resetAt: entry.resetAt,
      }
   }

   entry.count++
   rateLimitStore.set(identifier, entry)

   return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
   }
}

export function getClientIp(headers: Headers): string {
   return (
      headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      headers.get('x-real-ip') ||
      headers.get('cf-connecting-ip') ||
      'unknown'
   )
}

export function createRateLimitHeaders(
   result: RateLimitResult,
   limit?: number,
): Record<string, string> {
   return {
      'X-RateLimit-Limit': String(limit || result.remaining + (result.allowed ? 1 : 0)),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
      ...(result.allowed
         ? {}
         : { 'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString() }),
   }
}

export type RateLimitType = 'signup' | 'signin' | 'password-reset' | 'checkout' | 'contact' | 'email'

/**
 * Generic rate limit checker
 * Checks rate limit based on type from RATE_LIMITS config
 */
export function checkTypedRateLimit(identifier: string, type: RateLimitType): RateLimitResult {
   const config = RATE_LIMITS[type.toUpperCase().replace('-', '_') as keyof typeof RATE_LIMITS]
   const result = checkRateLimit(identifier, config)
   
   if (!result.allowed) {
      logger.warn(`${type} rate limit exceeded`, { identifier })
   }
   
   return result
}

export type RateLimitTypeForMiddleware = 'signup' | 'checkout' | 'contact'

/**
 * Apply rate limiting to request
 * Returns exceeded status and headers
 */
export function applyRateLimit(
   req: NextRequest,
   type: RateLimitTypeForMiddleware,
): { exceeded: boolean; headers: Record<string, string> } {
   const clientIp = getClientIp(req.headers)
   const rateLimitResult = checkTypedRateLimit(clientIp, type)
   
   const configKey = type.toUpperCase().replace('-', '_') as keyof typeof RATE_LIMITS
   const maxRequests = RATE_LIMITS[configKey].maxRequests
   const headers = createRateLimitHeaders(rateLimitResult, maxRequests)

   return {
      exceeded: !rateLimitResult.allowed,
      headers,
   }
}
