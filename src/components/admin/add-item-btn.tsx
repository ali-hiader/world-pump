import Link from 'next/link'
import React from 'react'

import { PlusIcon } from '@/icons/plus'

import { Button } from '../ui/button'

interface Props {
  link?: string
}

function AddItemBtn({ link = '/admin/add-product' }: Props) {
  return (
    <Link href={link}>
      <Button className="bg-secondary hover:bg-secondary/90">
        <PlusIcon className="size-4 fill-white" />
        Add Product
      </Button>
    </Link>
  )
}

export default AddItemBtn
