'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import { ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { cartTable, pumpTable } from '@/db/schema'

const userIdSchema = z.string().min(1, 'User ID is required')

const cartProductSchema = z.object({
   productId: z.string().min(1, 'Product ID is required'),
   userId: userIdSchema,
})

export type CartItemWithProduct = {
   cartId: string
   quantity: number
   addedBy: string
} & typeof pumpTable.$inferSelect

async function findCartByUserId(userId: string): Promise<CartItemWithProduct[]> {
   try {
      return await db
         .select({
            cartId: cartTable.id,
            quantity: cartTable.quantity,
            addedBy: cartTable.addedBy,
            ...getTableColumns(pumpTable),
         })
         .from(cartTable)
         .innerJoin(pumpTable, eq(cartTable.productId, pumpTable.id))
         .where(eq(cartTable.addedBy, userId))
         .orderBy(desc(cartTable.id))
   } catch (error) {
      logger.error('Failed to fetch cart items', error, { userId })
      throw error
   }
}

async function findCartItem(
   productId: string,
   userId: string,
): Promise<typeof cartTable.$inferSelect | undefined> {
   try {
      const items = await db
         .select()
         .from(cartTable)
         .where(and(eq(cartTable.productId, productId), eq(cartTable.addedBy, userId)))
      return items[0]
   } catch (error) {
      logger.error('Failed to find cart item', error, { productId, userId })
      throw error
   }
}

export async function fetchUserCart(userId: string) {
   try {
      return await findCartByUserId(userId)
   } catch (error) {
      logger.error('Failed to fetch cart', error)
      throw error
   }
}

export async function addToCart(productId: string, userId: string) {
   const validated = cartProductSchema.safeParse({ productId, userId })
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid input')
   }

   try {
      const existingItem = await findCartItem(validated.data.productId, validated.data.userId)

      if (existingItem) {
         await increaseQuantity(validated.data.productId, validated.data.userId)
      } else {
         await db.insert(cartTable).values({
            addedBy: validated.data.userId,
            productId: validated.data.productId,
            quantity: 1,
         })
         logger.success('Item added to cart', { productId, userId })
      }

      revalidatePath('/cart')

      const cart = await findCartByUserId(validated.data.userId)
      const addedItem = cart.find((item) => item.id === validated.data.productId)
      return addedItem
   } catch (error) {
      logger.error('Failed to add item to cart', error)
      throw error
   }
}

export async function increaseQuantity(productId: string, userId: string) {
   const validated = cartProductSchema.safeParse({ productId, userId })
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid input')
   }

   try {
      const existingItem = await findCartItem(validated.data.productId, validated.data.userId)

      if (!existingItem) {
         throw new Error('Cart item not found')
      }

      const [updatedItem] = await db
         .update(cartTable)
         .set({ quantity: existingItem.quantity + 1 })
         .where(and(eq(cartTable.productId, productId), eq(cartTable.addedBy, userId)))
         .returning()

      logger.debug('Cart item quantity increased', { productId, userId })
      revalidatePath('/cart')
      return updatedItem
   } catch (error) {
      logger.error('Failed to increase quantity', error)
      throw error
   }
}

export async function decreaseQuantity(productId: string, userId: string) {
   const validated = cartProductSchema.safeParse({ productId, userId })
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid input')
   }

   try {
      const existingItem = await findCartItem(validated.data.productId, validated.data.userId)

      if (!existingItem) {
         throw new Error('Cart item not found')
      }

      if (existingItem.quantity === 1) {
         await db
            .delete(cartTable)
            .where(
               and(
                  eq(cartTable.productId, validated.data.productId),
                  eq(cartTable.addedBy, validated.data.userId),
               ),
            )
         logger.debug('Cart item removed (quantity was 1)', { productId, userId })
         revalidatePath('/cart')
         return 'success'
      }

      const [updatedItem] = await db
         .update(cartTable)
         .set({ quantity: existingItem.quantity - 1 })
         .where(
            and(
               eq(cartTable.productId, validated.data.productId),
               eq(cartTable.addedBy, validated.data.userId),
            ),
         )
         .returning()

      logger.debug('Cart item quantity decreased', { productId, userId })
      revalidatePath('/cart')
      return updatedItem ?? 'success'
   } catch (error) {
      logger.error('Failed to decrease quantity', error)
      throw error
   }
}

export async function removeFromCart(productId: string, userId: string) {
   const validated = cartProductSchema.safeParse({ productId, userId })
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid input')
   }

   try {
      await db
         .delete(cartTable)
         .where(
            and(
               eq(cartTable.productId, validated.data.productId),
               eq(cartTable.addedBy, validated.data.userId),
            ),
         )

      logger.success('Item removed from cart', { productId, userId })
      revalidatePath('/cart')
      return await findCartByUserId(validated.data.userId)
   } catch (error) {
      logger.error('Failed to remove item from cart', error)
      throw error
   }
}

export async function clearCart(userId: string) {
   const validated = userIdSchema.safeParse(userId)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid user ID')
   }

   const session = await auth.api.getSession({
      headers: await headers(),
   })

   if (!session) {
      return redirect('/sign-in')
   }

   try {
      await db.delete(cartTable).where(eq(cartTable.addedBy, validated.data))
      logger.success('Cart cleared', { userId })
      revalidatePath('/cart')
   } catch (error) {
      logger.error('Failed to clear cart', error)
      throw error
   }
}
