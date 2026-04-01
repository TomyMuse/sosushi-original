export interface StorefrontSizeSeed {
  label: string
  pieces: number
  price: number
}

export interface StorefrontProductSeed {
  name: string
  description?: string
  categorySlug: string
  image?: string | null
  isPopular?: boolean
  sizes: StorefrontSizeSeed[]
}

export interface StorefrontCategorySeed {
  name: string
  slug: string
  description?: string
  emoji?: string
  order: number
}

export interface StorefrontDiscountSeed {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder?: number
  maxUses?: number | null
  isActive: boolean
}

export interface StorefrontProductSize {
  id: string
  label: string
  pieces: number
  price: number
}

export interface StorefrontProduct {
  id: string
  name: string
  description?: string
  image?: string | null
  sizes: StorefrontProductSize[]
  isPopular?: boolean
}

export interface StorefrontCategory {
  id: string
  name: string
  slug: string
  description?: string
  emoji?: string
  products: StorefrontProduct[]
}

export const siteConfig = {
  brandName: 'SOSUSHI',
  whatsappNumber: '5491150948993',
  whatsappGreeting: 'Hola! Quiero hacer un pedido.',
  instagramUrl: 'https://instagram.com/sosushiok',
  instagramHandle: '@sosushiok',
  phoneDisplay: '+54 9 11 5094-8993',
  city: 'San Clemente del Tuyu, Buenos Aires',
  schedule: 'Mar a Dom de 19:00 a 00:00',
}

export const categorySeeds: StorefrontCategorySeed[] = [
  { name: 'Rolls Veggies', slug: 'rolls-veggies', description: 'Opciones frescas y vegetarianas.', order: 1 },
  { name: 'Rolls Veganos', slug: 'rolls-veganos', description: 'Sabores plant-based con mucha textura.', order: 2 },
  { name: 'Fritos y Entradas', slug: 'fritos-entradas', description: 'Picadas y entradas para compartir.', order: 3 },
  { name: 'Nigiri y Sashimi', slug: 'nigiri-sashimi', description: 'Cortes clasicos y frescos.', order: 4 },
  { name: 'Rolls Sin Pescado', slug: 'rolls-sin-pescado', description: 'Alternativas con pollo y bondiola.', order: 5 },
  { name: 'Rolls Varios', slug: 'rolls-varios', description: 'Especialidades con perfiles bien distintos.', order: 6 },
  { name: 'Rolls de Salmon', slug: 'rolls-salmon', description: 'Los favoritos con salmon premium.', order: 7 },
  { name: 'Atun', slug: 'atun', description: 'Opciones con atun y palta.', order: 8 },
  { name: 'Hot Rolls', slug: 'hot-rolls', description: 'Fritos en panko y bien crocantes.', order: 9 },
  { name: 'Bebidas', slug: 'bebidas', description: 'Acompanamientos para completar el pedido.', order: 10 },
]

export const productSeeds: StorefrontProductSeed[] = [
  {
    name: 'Onion',
    description: 'Hongos de pino, queso crema y cebolla caramelizada con sesamo.',
    categorySlug: 'rolls-veggies',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 11500 },
    ],
  },
  {
    name: 'Alicante Veggie',
    description: 'Rucula, queso crema y tomate seco, envuelto en verdeo.',
    categorySlug: 'rolls-veggies',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 11000 },
    ],
  },
  {
    name: 'Green',
    description: 'Palta, queso crema y pepino con sesamo, salsa miel y mostaza.',
    categorySlug: 'rolls-veggies',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 11000 },
    ],
  },
  {
    name: 'Cauboy',
    description: 'Palta, queso crema, choclo y verdeo, envuelto en palta.',
    categorySlug: 'rolls-veggies',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 11500 },
    ],
  },
  {
    name: 'Flower',
    description: 'Rucula, queso de almendras, tomate seco, mix de semillas y miel.',
    categorySlug: 'rolls-veganos',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12000 },
    ],
  },
  {
    name: 'Carrol',
    description: 'Champinones y palta, envuelto en laminas de palta y almendras tostadas.',
    categorySlug: 'rolls-veganos',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 11500 },
    ],
  },
  {
    name: 'Fingers de Pollo',
    description: 'Fingers de pollo frito en panko.',
    categorySlug: 'fritos-entradas',
    sizes: [{ label: 'x6', pieces: 6, price: 7000 }],
  },
  {
    name: 'Bastones de Salmon',
    description: 'Bastones de salmon fritos en panko.',
    categorySlug: 'fritos-entradas',
    sizes: [{ label: 'x6', pieces: 6, price: 9000 }],
  },
  {
    name: 'Bastones de Merluza',
    description: 'Bastones de merluza fritos en panko.',
    categorySlug: 'fritos-entradas',
    sizes: [{ label: 'x6', pieces: 6, price: 6000 }],
  },
  {
    name: 'Langostinos Fritos',
    description: 'Langostinos fritos en panko.',
    categorySlug: 'fritos-entradas',
    sizes: [{ label: 'x6', pieces: 6, price: 8000 }],
  },
  {
    name: 'Nigiri',
    description: 'Bola de arroz con lamina de salmon.',
    categorySlug: 'nigiri-sashimi',
    sizes: [{ label: 'x5', pieces: 5, price: 10000 }],
  },
  {
    name: 'Geisha',
    description: 'Lamina de salmon rellena de queso crema y palta.',
    categorySlug: 'nigiri-sashimi',
    sizes: [{ label: 'x5', pieces: 5, price: 10000 }],
  },
  {
    name: 'Sashimi',
    description: 'Lonjas de salmon.',
    categorySlug: 'nigiri-sashimi',
    sizes: [{ label: 'x5', pieces: 5, price: 10000 }],
  },
  {
    name: 'Bondiola BBQ',
    description: 'Bondiola frita, queso crema, verdeo, rucula y salsa BBQ.',
    categorySlug: 'rolls-sin-pescado',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12000 },
    ],
  },
  {
    name: 'Chicken Teriyaki',
    description: 'Pollo frito, queso crema y palta con salsa teriyaki.',
    categorySlug: 'rolls-sin-pescado',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12000 },
    ],
  },
  {
    name: 'Alicante Sin Pescado',
    description: 'Rucula, queso crema y tomates secos cubierto en verdeo.',
    categorySlug: 'rolls-sin-pescado',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 11500 },
    ],
  },
  {
    name: 'KFC',
    description: 'Roll especial KFC con relleno premium.',
    categorySlug: 'rolls-varios',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12500 },
    ],
  },
  {
    name: 'Nagasaki',
    description: 'Roll estilo Nagasaki con ingredientes seleccionados.',
    categorySlug: 'rolls-varios',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12000 },
    ],
  },
  {
    name: 'California',
    description: 'El clasico California roll.',
    categorySlug: 'rolls-varios',
    isPopular: true,
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12500 },
    ],
  },
  {
    name: 'Ebi',
    description: 'Roll de langostinos con ingredientes premium.',
    categorySlug: 'rolls-varios',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Apaltado',
    description: 'Roll con extra de palta cremosa.',
    categorySlug: 'rolls-varios',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12500 },
    ],
  },
  {
    name: 'Milan',
    description: 'Roll estilo milanes con ingredientes especiales.',
    categorySlug: 'rolls-varios',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12000 },
    ],
  },
  {
    name: 'Sinyx',
    description: 'Roll signature Sinyx con sabor unico.',
    categorySlug: 'rolls-varios',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Tamago Crunch',
    description: 'Salmon con tamago y crunch especial.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Golden Rose',
    description: 'Salmon premium con toque dorado.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Avellanas',
    description: 'Salmon con avellanas tostadas.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Kyoto',
    description: 'Salmon estilo Kyoto tradicional.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Hass',
    description: 'Salmon con palta Hass premium.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'New York Philadelphia',
    description: 'Salmon con queso Philadelphia.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Monaco',
    description: 'Salmon estilo Monaco.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'New York',
    description: 'El clasico New York de salmon.',
    categorySlug: 'rolls-salmon',
    isPopular: true,
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Philadelphia',
    description: 'Salmon con queso crema premium.',
    categorySlug: 'rolls-salmon',
    isPopular: true,
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Aston',
    description: 'Salmon Aston con ingredientes selectos.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Boston',
    description: 'Salmon estilo Boston.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Almendrado',
    description: 'Salmon con almendras tostadas.',
    categorySlug: 'rolls-salmon',
    sizes: [
      { label: 'x5', pieces: 5, price: 7500 },
      { label: 'x10', pieces: 10, price: 13500 },
    ],
  },
  {
    name: 'Atun',
    description: 'Roll de atun premium.',
    categorySlug: 'atun',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12000 },
    ],
  },
  {
    name: 'Atun Palta',
    description: 'Roll de atun con palta cremosa.',
    categorySlug: 'atun',
    sizes: [
      { label: 'x5', pieces: 5, price: 7000 },
      { label: 'x10', pieces: 10, price: 12000 },
    ],
  },
  {
    name: 'Hot NYP',
    description: 'Salmon, queso crema y palta.',
    categorySlug: 'hot-rolls',
    isPopular: true,
    sizes: [
      { label: 'x6', pieces: 6, price: 10000 },
      { label: 'x12', pieces: 12, price: 20000 },
    ],
  },
  {
    name: 'Hot Lango',
    description: 'Langostinos cocidos y queso crema.',
    categorySlug: 'hot-rolls',
    sizes: [
      { label: 'x6', pieces: 6, price: 10000 },
      { label: 'x12', pieces: 12, price: 20000 },
    ],
  },
  {
    name: 'Hot Grill',
    description: 'Salmon grill, queso crema y mayo de ajo.',
    categorySlug: 'hot-rolls',
    sizes: [
      { label: 'x6', pieces: 6, price: 10000 },
      { label: 'x12', pieces: 12, price: 20000 },
    ],
  },
  {
    name: 'Hot Cheddar',
    description: 'Salmon, queso cheddar y palta.',
    categorySlug: 'hot-rolls',
    sizes: [
      { label: 'x6', pieces: 6, price: 10000 },
      { label: 'x12', pieces: 12, price: 20000 },
    ],
  },
  {
    name: 'Hot Flamin Doritos',
    description: 'Pollo frito, queso crema, verdeo y Doritos.',
    categorySlug: 'hot-rolls',
    sizes: [
      { label: 'x6', pieces: 6, price: 10000 },
      { label: 'x12', pieces: 12, price: 20000 },
    ],
  },
  {
    name: 'Hot Chicken',
    description: 'Pollo frito, crema y palta con salsa maracuya.',
    categorySlug: 'hot-rolls',
    sizes: [
      { label: 'x6', pieces: 6, price: 10000 },
      { label: 'x12', pieces: 12, price: 20000 },
    ],
  },
  {
    name: 'Hot Veggie',
    description: 'Verduras salteadas, queso crema y almendras.',
    categorySlug: 'hot-rolls',
    sizes: [
      { label: 'x6', pieces: 6, price: 9000 },
      { label: 'x12', pieces: 12, price: 18000 },
    ],
  },
  {
    name: 'Agua Mineral',
    description: 'Agua mineral 500ml.',
    categorySlug: 'bebidas',
    sizes: [{ label: '500ml', pieces: 1, price: 1500 }],
  },
  {
    name: 'Coca Cola',
    description: 'Coca Cola 500ml.',
    categorySlug: 'bebidas',
    sizes: [{ label: '500ml', pieces: 1, price: 2500 }],
  },
  {
    name: 'Coca Zero',
    description: 'Coca Cola Zero 500ml.',
    categorySlug: 'bebidas',
    sizes: [{ label: '500ml', pieces: 1, price: 2500 }],
  },
  {
    name: 'Sprite',
    description: 'Sprite 500ml.',
    categorySlug: 'bebidas',
    sizes: [{ label: '500ml', pieces: 1, price: 2500 }],
  },
  {
    name: 'Jugo Natural',
    description: 'Jugo natural de naranja o limon.',
    categorySlug: 'bebidas',
    sizes: [{ label: '350ml', pieces: 1, price: 3000 }],
  },
  {
    name: 'Cerveza Quilmes',
    description: 'Cerveza Quilmes 1L.',
    categorySlug: 'bebidas',
    sizes: [{ label: '1L', pieces: 1, price: 4000 }],
  },
]

export const discountSeeds: StorefrontDiscountSeed[] = [
  {
    code: 'BIENVENIDO10',
    type: 'percentage',
    value: 10,
    minOrder: 10000,
    maxUses: 100,
    isActive: true,
  },
  {
    code: 'SOSUSHI20',
    type: 'percentage',
    value: 20,
    minOrder: 20000,
    maxUses: 50,
    isActive: true,
  },
  {
    code: 'DESCUENTO500',
    type: 'fixed',
    value: 500,
    minOrder: 8000,
    maxUses: null,
    isActive: true,
  },
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const storefrontCategories: StorefrontCategory[] = categorySeeds
  .sort((a, b) => a.order - b.order)
  .map((category) => ({
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description,
    products: productSeeds
      .filter((product) => product.categorySlug === category.slug)
      .map((product) => ({
        id: `${category.slug}-${slugify(product.name)}`,
        name: product.name,
        description: product.description,
        image: product.image ?? null,
        isPopular: product.isPopular,
        sizes: product.sizes.map((size) => ({
          id: `${category.slug}-${slugify(product.name)}-${slugify(size.label)}`,
          label: size.label,
          pieces: size.pieces,
          price: size.price,
        })),
      })),
  }))

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function getDefaultWhatsAppUrl() {
  return buildWhatsAppUrl(siteConfig.whatsappGreeting)
}
