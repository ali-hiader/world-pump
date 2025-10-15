'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { CartItemType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import CheckoutProduct from '@/components/client/checkout_product'
import { Button } from '@/components/ui/button'
import Spinner from '@/icons/spinner'

import Address, { AddressesData } from './address'
import DisplayAlert from './display_alert'
import Heading from './heading'
import Payment from './payment'

interface Props {
  cartItems: CartItemType[]
  userName: string
}

function Checkout({ cartItems, userName }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPaymentM, setSelectedPaymentM] = useState('cod')
  const [addresses, setAddresses] = useState<AddressesData | null>(null)

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Display only: use shared PKR formatter

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      const payload = {
        products: cartItems.map((p) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
          price: p.price,
          quantity: p.quantity,
          sku: null,
        })),
        addresses: addresses ?? undefined,
        paymentMethod: selectedPaymentM,
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Checkout failed:', data)
        return
      }

      if (data?.gateway === 'payfast' && data?.processUrl && data?.fields) {
        // Create and submit a form POST to PayFast
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.processUrl
        Object.entries<string>(data.fields).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
        return
      }

      // COD / Bank
      if (data?.orderId) {
        const method = selectedPaymentM === 'bank' ? 'bank' : 'cod'
        router.push(`/success?orderId=${data.orderId}&method=${method}`)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return <DisplayAlert showBtn={false}>Please add Products to cart to review here!</DisplayAlert>
  }

  return (
    <main className="px-4 sm:px-[5%] mb-12 mt-8 min-h-96 max-w-[1600px] mx-auto">
      <Heading
        title="Checkout"
        // itemsOnPage={cartItems.reduce((sum, Product) => sum + Product.quantity, 0)}
      />

      <section className="grid grid-cols-1 min-[1100px]:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-[3%] mt-12 place-items-start">
        <div className="col-span-1 min-[1100px]:col-span-2">
          <Address userName={userName} onAddressesChange={setAddresses} />
          <Payment selectedPaymentM={selectedPaymentM} setSelectedPaymentM={setSelectedPaymentM} />
        </div>

        <aside className="grid grid-cols-1 gap-4 mt-8">
          {cartItems.map((product) => (
            <CheckoutProduct key={product.id} product={product} />
          ))}
        </aside>
        {cartItems.length > 0 && (
          <footer className="mt-12 space-y-4 flex flex-col px-2 col-span-1 min-[1100px]:col-span-3 w-full">
            <div className="flex justify-between w-full px-6">
              <p className="">Amount to Pay</p>
              <p className="font-semibold headingFont text-xl">{formatPKR(total)}</p>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="sm:w-96 w-full self-center bg-secondary hover:bg-secondary/90 cursor-pointer transition-all duration-300 text-white rounded-md py-6"
            >
              {isLoading ? (
                <Spinner className="size-7 animate-spin [&>path]:stroke-white" />
              ) : (
                'Checkout'
              )}
            </Button>
          </footer>
        )}
      </section>
    </main>
  )
}

export default Checkout
