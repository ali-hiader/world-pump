import Link from 'next/link'
import React, { type PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DisplayAlertProps extends PropsWithChildren {
  showBtn?: boolean
  buttonText?: string
  buttonHref?: string
  className?: string
  onAction?: () => void
}

function DisplayAlert({
  children,
  showBtn = false,
  buttonText = 'Continue Exploring',
  buttonHref = '/',
  className,
  onAction,
}: DisplayAlertProps) {
  return (
    <div className={cn('flex flex-col items-center gap-6 mt-12 pb-24 w-full', className)}>
      <div className="text-center">
        <p className="text-xl font-medium text-muted-foreground leading-relaxed">{children}</p>
      </div>

      {showBtn && (
        <div className="flex justify-center">
          {onAction ? (
            <Button
              onClick={onAction}
              variant="outline"
              className="min-w-40 transition-all duration-200"
            >
              {buttonText}
            </Button>
          ) : (
            <Button asChild variant="outline" className="min-w-40 transition-all duration-200">
              <Link href={buttonHref}>{buttonText}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default DisplayAlert
