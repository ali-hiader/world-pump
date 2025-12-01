import 'dotenv/config'

import {
   clearAllData,
   seedAccessories,
   seedCategories,
   seedPumps,
} from '../src/lib/database/seed.ts'

async function main() {
   try {
      console.log('🚀 Starting database seeding process...')
      console.log('='.repeat(50))

      console.log('\n📝 Step 1: Clearing existing data')
      await clearAllData()

      console.log('\n📝 Step 2: Seeding Categories')
      await seedCategories()

      console.log('\n📝 Step 3: Seeding Pumps')
      await seedPumps()

      console.log('\n📝 Step 4: Seeding Accessories')
      await seedAccessories()

      console.log('\n' + '='.repeat(50))
      console.log('🎉 Seeding completed successfully!')

      process.exit(0)
   } catch (error) {
      console.error('\n❌ Error during seeding:', error)
      process.exit(1)
   }
}

main()
