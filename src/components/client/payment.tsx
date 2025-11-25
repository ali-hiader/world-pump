'use client'

import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Props {
  selectedPaymentM: string
  setSelectedPaymentM: (v: string) => void
}

function Payment({ selectedPaymentM, setSelectedPaymentM }: Props) {
  const itemBase = 'not-first:border-t !border-b-0 border-primary/20 overflow-hidden'

  const triggerBase = 'px-4 py-4 [&>svg]:hidden flex items-center gap-3 text-[15px]'

  const radio = (active: boolean) => (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-5 w-5 items-center justify-center rounded-full border-2',
        active ? 'border-primary' : 'border-muted-foreground/40',
      )}
    >
      <span className={cn('h-2.5 w-2.5 rounded-full', active ? 'bg-primary' : 'bg-transparent')} />
    </span>
  )

  return (
    <section className="col-span-1 lg:col-span-2 mt-8">
      <h2 className="">Payment</h2>
      <p className="text-sm text-muted-foreground mt-1">
        All transactions are secure and encrypted.
      </p>
      <div className="mt-4 rounded-md border border-primary/20 overflow-hidden">
        <Accordion
          type="single"
          value={selectedPaymentM}
          onValueChange={(v) => {
            if (!v) return
            setSelectedPaymentM(v)
          }}
          className="md:w-2xl"
        >
          {/* COD */}
          <AccordionItem
            value="cod"
            className={cn(
              itemBase,
              selectedPaymentM === 'cod' ? 'border-primary/40' : 'border-primary/20',
            )}
          >
            <AccordionTrigger
              className={cn(
                triggerBase,
                selectedPaymentM === 'cod' ? 'bg-primary/5' : 'bg-muted/30 hover:bg-muted/50',
              )}
            >
              {radio(selectedPaymentM === 'cod')}
              <span>Cash on Delivery (COD)</span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              Pay with cash when your order is delivered. Our rider will collect the amount upon
              delivery.
            </AccordionContent>
          </AccordionItem>

          {/* Bank */}
          <AccordionItem
            value="bank"
            className={cn(
              itemBase,
              selectedPaymentM === 'bank' ? 'border-primary/40' : 'border-primary/20',
            )}
          >
            <AccordionTrigger
              className={cn(
                triggerBase,
                selectedPaymentM === 'bank' ? 'bg-primary/5' : 'bg-muted/30 hover:bg-muted/50',
              )}
            >
              {radio(selectedPaymentM === 'bank')}
              <span>Bank Deposit</span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="rounded-md border bg-background p-4 text-sm leading-relaxed">
                <p>
                  <span className="font-semibold">Bank Name:</span> Meezan Bank limited
                </p>
                <p>
                  <span className="font-semibold">Account Title:</span> Chief Machinery Corporation
                </p>
                <p>
                  <span className="font-semibold">Account Number:</span> 02450109491881
                </p>
                <hr className="my-3 border-dashed" />
                <p>
                  Please send the deposit slip by Whatsapp to +92321-7566679 or by email to
                  Marketing21@hyundaipower.pk. Your order will not be shipped until the funds have
                  been cleared in our account.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default Payment
