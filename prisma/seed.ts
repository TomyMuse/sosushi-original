import { PrismaClient } from '@prisma/client'
import {
  categorySeeds,
  discountSeeds,
  productSeeds,
} from '../src/data/storefront'

const prisma = new PrismaClient()

const adminUser = {
  email: 'admin@sosushi.com',
  password: '$2a$10$YourHashedPasswordHere',
  name: 'Admin',
  role: 'admin',
}

async function main() {
  console.log('Starting seed...')

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.productSize.deleteMany()
  await prisma.product.deleteMany()
  await prisma.discount.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Cleaned existing data')

  for (const category of categorySeeds) {
    await prisma.category.create({
      data: category,
    })
  }

  console.log('Created categories')

  for (const product of productSeeds) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    })

    if (!category) {
      console.warn(`Category not found: ${product.categorySlug}`)
      continue
    }

    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        image: product.image ?? null,
        categoryId: category.id,
        isActive: true,
        isPopular: Boolean(product.isPopular),
        sizes: {
          create: product.sizes.map((size, index) => ({
            label: size.label,
            pieces: size.pieces,
            price: size.price,
            order: index,
          })),
        },
      },
    })
  }

  console.log('Created products')

  for (const discount of discountSeeds) {
    await prisma.discount.create({
      data: discount,
    })
  }

  console.log('Created discounts')

  await prisma.user.create({
    data: adminUser,
  })

  console.log('Created admin user')
  console.log('Seed completed')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
