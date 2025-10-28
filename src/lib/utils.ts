import { type ClassValue, clsx } from 'clsx'
import slugify from 'slugify'
import { twMerge } from 'tailwind-merge'

import { SpecField } from './types'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function slugifyIt(text: string) {
   return slugify(text, { lower: true, trim: true })
}

// Format numbers as Pakistani Rupees with grouping, no decimals
export function formatPKR(value: number) {
   try {
      return `Pkr ${Math.round(value).toLocaleString('en-PK')}`
   } catch {
      return `Pkr ${value}`
   }
}

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
   return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
   if (text.length <= maxLength) return text
   return text.slice(0, maxLength).trim() + '...'
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date
   return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   })
}

/**
 * Generate a random ID string
 * @param length - Length of the ID (default: 8)
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
   return Math.random()
      .toString(36)
      .substring(2, 2 + length)
}

/**
 * Debounce function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
   func: T,
   wait: number,
): (...args: Parameters<T>) => void {
   let timeout: NodeJS.Timeout
   return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
   }
}

/**
 * Parse specifications data from various formats into a consistent SpecField array
 * @param specs - Specifications data in unknown format
 * @returns Array of SpecField objects
 */
export function parseSpecsToArray(specs: unknown): SpecField[] {
   if (!specs) return []

   try {
      if (Array.isArray(specs)) {
         return specs.map((spec, index) => ({
            id: (index + 1).toString(),
            field: spec.field || '',
            value: spec.value || '',
         }))
      }

      if (typeof specs === 'object') {
         return Object.entries(specs).map(([field, value], index) => ({
            id: (index + 1).toString(),
            field,
            value: String(value),
         }))
      }

      if (typeof specs === 'string') {
         const parsed = JSON.parse(specs)
         return parseSpecsToArray(parsed)
      }
   } catch (error) {
      console.error('Error parsing specs:', error)
   }

   return []
}

/**
 * Validate if an ID parameter is valid (positive integer)
 * @param id - ID string to validate
 * @returns boolean indicating if ID is valid
 */
export function isValidId(id: string): boolean {
   const numId = Number(id)
   return !isNaN(numId) && numId > 0
}

/**
 * Get admin page container classes for consistent styling
 * @returns Tailwind classes string
 */
export function getAdminContainerClasses(): string {
   return 'container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto'
}

/**
 * Get admin page centered content classes for loading/error states
 * @returns Tailwind classes string
 */
export function getAdminCenteredClasses(): string {
   return 'text-center py-12'
}

/**
 * Standardized API response helpers
 */
export function createApiResponse<T>(data: T, success: boolean = true, message?: string) {
   return {
      success,
      ...(success ? { data } : { error: message || 'An error occurred' }),
      ...(message && success ? { message } : {}),
   }
}

export function createErrorResponseData(message: string) {
   return createApiResponse(null, false, message)
}

export function createSuccessResponseData<T>(data: T, message?: string) {
   return createApiResponse(data, true, message)
}

export function getOrderStatusBadgeVariant(
   status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
   switch (status?.toLowerCase()) {
      case 'completed':
         return 'default' // Green - final state
      case 'delivered':
         return 'default' // Green - delivered
      case 'shipped':
         return 'outline' // Blue - in transit
      case 'pending':
         return 'secondary' // Gray - waiting
      case 'cancelled':
         return 'destructive' // Red - cancelled
      default:
         return 'secondary'
   }
}

export function getPaymentStatusBadgeVariant(
   status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
   switch (status?.toLowerCase()) {
      case 'successful':
         return 'default'
      case 'pending':
         return 'secondary'
      case 'failed':
         return 'destructive'
      case 'refunded':
         return 'outline'
      default:
         return 'secondary'
   }
}

export function toBase64(str: string) {
   if (typeof window === 'undefined') {
      return Buffer.from(str).toString('base64')
   }
   return window.btoa(str)
}
