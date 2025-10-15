import AddItemBtn from '@/components/admin/add-item-btn'
import AccessoriesTable from '@/components/admin/table-accessories'
import Heading from '@/components/client/heading'

export default function AdminAccessoriesPage() {
  return (
    <main className="py-6 px-4 sm:px-[3%] space-y-6 max-w-[2000px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <Heading title="Manage Accessories" />
        <AddItemBtn link='"/admin/add-accessory"' />
      </div>
      <AccessoriesTable />
    </main>
  )
}
