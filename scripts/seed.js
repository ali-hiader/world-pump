import 'dotenv/config'

import {
   clearAllData,
   seedAccessories,
   seedAdmin,
   seedCategories,
   seedPumps,
} from '../src/lib/database/seed.ts'

async function main() {
   try {
      console.log('🚀 Starting database seeding process...')
      console.log('='.repeat(50))

      console.log('\n📝 Step 1: Clearing existing data')
      await clearAllData()

      console.log('\n📝 Step 2: Seeding Admin User')
      const admin = await seedAdmin()

      console.log('\n📝 Step 3: Seeding Categories')
      const categories = await seedCategories()

      console.log('\n📝 Step 4: Seeding Pumps')
      await seedPumps(admin.id, categories)

      console.log('\n📝 Step 5: Seeding Accessories')
      await seedAccessories(admin.id)

      console.log('\n' + '='.repeat(50))
      console.log('🎉 Seeding completed successfully!')
      console.log('\n🔐 Admin login details:')
      console.log('   📧 Email: superAdmin@worldPumps.hi')
      console.log('   🔑 Password: opentheadminpanel')

      process.exit(0)
   } catch (error) {
      console.error('\n❌ Error during seeding:', error)
      process.exit(1)
   }
}

main()
