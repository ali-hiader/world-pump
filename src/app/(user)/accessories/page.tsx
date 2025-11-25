import { fetchAllAccessories } from '@/actions/accessory'
import AccessoryCard from '@/components/client/accessory-card'

export default async function AccessoriesPage() {
   const accessories = await fetchAllAccessories()

   return (
      <main className="max-w-7xl mx-auto p-6">
         <h1 className="text-3xl font-bold mb-6">Accessories</h1>
         {accessories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No accessories found.</div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {accessories.map((accessory) => (
                  <AccessoryCard key={accessory.id} accessory={accessory} />
               ))}
            </div>
         )}
      </main>
   )
}
