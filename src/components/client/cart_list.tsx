'use client'

import Link from 'next/link'

import { formatPKR } from '@/lib/utils'
import DisplayAlert from '@/components/client/display_alert'
import { Button } from '@/components/ui/button'
import useCartStore from '@/stores/cart_store'

import CartItem from './cart_item'
import Heading from './heading'

function CartList() {
  const { cartProducts_S } = useCartStore()

  const totalPrice = cartProducts_S.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  )

  return (
    <>
      <Heading title="Cart" />
      {cartProducts_S.length === 0 ? (
        <DisplayAlert showBtn buttonText="Start Shopping" buttonHref="/pumps">
          No products in the cart!
        </DisplayAlert>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12 px-4 max-w-7xl mx-auto">
          {cartProducts_S.map((product) => (
            <CartItem key={product.id} product={product} />
          ))}
        </section>
      )}

      {cartProducts_S.length > 0 && (
        <footer className="mt-12 space-y-4 flex flex-col max-w-7xl mx-auto">
          <div className="flex justify-between w-full px-6 text-gray-700">
            <p className="font-medium">Amount to Pay</p>
            <p className="font-bold headingFont ">{formatPKR(totalPrice)}</p>
          </div>
          <Link href={'/checkout'} className="sm:w-fit self-center w-full">
            <Button className="sm:w-96 w-full bg-secondary cursor-pointer hover:bg-secondary/90 transition-all duration-300 text-white rounded-md py-6">
              Continue to Checkout
            </Button>
          </Link>
        </footer>
      )}
    </>
  )
}

export default CartList
