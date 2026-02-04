import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { FILE_UPLOAD } from '@/lib/constants'
import { logger } from '@/lib/logger'

import { SpecField } from './types'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function getOrderStatusBadgeVariant(
   status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
   switch (status?.toLowerCase()) {
      case 'completed':
         return 'default'
      case 'delivered':
         return 'default'
      case 'shipped':
         return 'outline'
      case 'pending':
         return 'secondary'
      case 'cancelled':
         return 'destructive'
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

export function formatPKR(value: number) {
   try {
      return `Pkr ${Math.round(value).toLocaleString('en-PK')}`
   } catch {
      return `Pkr ${value}`
   }
}

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
      logger.error('Error parsing specs', error)
   }

   return []
}

// File & image validation utilities

export class FileValidationError extends Error {
   constructor(message: string) {
      super(message)
      this.name = 'FileValidationError'
   }
}

function validateFileType(file: File, allowedTypes: readonly string[]): void {
   if (!allowedTypes.includes(file.type)) {
      throw new FileValidationError(
         `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`,
      )
   }
}

function validateFileSize(file: File, maxSize: number): void {
   if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      throw new FileValidationError(
         `File too large: ${fileSizeMB}MB. Maximum allowed: ${maxSizeMB}MB`,
      )
   }
}

function validateFileExtension(file: File, allowedExtensions: readonly string[]): void {
   const extension = `.${file.name.split('.').pop()?.toLowerCase()}`

   if (!allowedExtensions.includes(extension)) {
      throw new FileValidationError(
         `Invalid file extension: ${extension}. Allowed: ${allowedExtensions.join(', ')}`,
      )
   }
}

function validateFileName(file: File): void {
   const dangerousChars = /[<>:"|?*\x00-\x1F]/g

   if (dangerousChars.test(file.name)) {
      throw new FileValidationError('File name contains invalid characters')
   }

   if (file.name.length > 255) {
      throw new FileValidationError('File name is too long (max 255 characters)')
   }
}

export function validateUploadedFile(
   file: File,
   options?: {
      maxSize?: number
      allowedTypes?: readonly string[]
      allowedExtensions?: readonly string[]
   },
): void {
   const {
      maxSize = FILE_UPLOAD.MAX_SIZE,
      allowedTypes = FILE_UPLOAD.ALLOWED_IMAGE_TYPES,
      allowedExtensions = FILE_UPLOAD.ALLOWED_EXTENSIONS,
   } = options || {}

   if (!file) {
      throw new FileValidationError('No file provided')
   }

   if (file.size === 0) {
      throw new FileValidationError('File is empty')
   }

   validateFileName(file)
   validateFileType(file, allowedTypes)
   validateFileExtension(file, allowedExtensions)
   validateFileSize(file, maxSize)
}

export function validateImageFile(file: File): void {
   validateUploadedFile(file, {
      maxSize: FILE_UPLOAD.MAX_SIZE,
      allowedTypes: FILE_UPLOAD.ALLOWED_IMAGE_TYPES,
      allowedExtensions: FILE_UPLOAD.ALLOWED_EXTENSIONS,
   })
}

export async function fileToBuffer(file: File): Promise<Buffer> {
   const arrayBuffer = await file.arrayBuffer()
   return Buffer.from(arrayBuffer)
}

export function sanitizeFileName(fileName: string): string {
   return fileName
      .replace(/[<>:"|?*\x00-\x1F]/g, '')
      .replace(/^\.+/, '')
      .replace(/\.{2,}/g, '.')
      .trim()
      .slice(0, 255)
}

export function toBase64(str: string) {
   if (typeof window === 'undefined') {
      return Buffer.from(str).toString('base64')
   }
   return window.btoa(str)
}
