'use client'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { useSession } from '@/lib/auth/auth-client'
import { useCart } from '@/hooks/use-cart'
import Spinner from '@/icons/spinner'

interface Props {
   productId: number
}

function AddToCartBtn({ productId }: Props) {
   const router = useRouter()
   const { data: session } = useSession()
   const { addItem, loading } = useCart({ userId: session?.user?.id })

   async function handleAddingToCart() {
      if (!session?.user?.id) return router.push('/sign-in')

      try {
         await addItem(productId)

         toast('Added to cart', {
            style: {
               backgroundColor: '#6b7280',
               color: '#fff',
               fontFamily: 'serif',
               fontSize: '16px',
            },
            position: 'top-right',
            actionButtonStyle: {
               backgroundColor: '#fff',
               color: '#000',
            },
            action: {
               label: 'Cart',
               onClick: () => router.push('/cart'),
            },
         })
      } catch {
         toast.error('Failed to add item to cart')
      }
   }

   return (
      <>
         {
            <button
               onClick={handleAddingToCart}
               className="w-full border bg-primary hover:bg-primary/90 text-white rounded-md transition-all group px-6 py-2 cursor-pointer disabled:cursor-not-allowed relative"
               type="button"
               disabled={loading.add}
            >
               {loading.add && (
                  <Spinner className="animate-spin size-6 absolute top-2 left-0 translate-x-1/2" />
               )}{' '}
               Add to cart
            </button>
         }
      </>
   )
}

export default AddToCartBtn
