import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth'

async function setupAdmin() {
  const adminEmail = 'admin@sosushi.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'S0Sush1@dm1n2024!'
  
  try {
    // Check if admin exists
    const existingAdmin = await db.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      // Update password
      const hashedPassword = await hashPassword(adminPassword)
      await db.user.update({
        where: { id: existingAdmin.id },
        data: { password: hashedPassword }
      })
      console.log('✅ Admin password updated successfully')
    } else {
      // Create admin
      const hashedPassword = await hashPassword(adminPassword)
      await db.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin',
          role: 'admin'
        }
      })
      console.log('✅ Admin user created successfully')
    }

    console.log('\n📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting up admin:', error)
    process.exit(1)
  }
}

setupAdmin()
