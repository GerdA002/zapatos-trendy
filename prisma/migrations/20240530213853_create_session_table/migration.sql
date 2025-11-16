generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.sqlite"
}
// Tabla existente para sesiones Shopify
model Session {
  id            String    @id
  shop          String
  state         String
  isOnline      Boolean   @default(false)
  scope         String?
  expires       DateTime?
  accessToken   String
  userId        BigInt?
  firstName     String?
  lastName      String?
  email         String?
  accountOwner  Boolean   @default(false)
  locale        String?
  collaborator  Boolean?  @default(false)
  emailVerified Boolean?  @default(false)
}

//Tablas para Zapatos
model ShoeProduct {
  id          String   @id @default(cuid())
  shopifyId   String?  @unique  // ID en Shopify
  title       String
  handle      String   @unique  // URL amigable
  description String?

  // Específico para zapatos
  productType ShoeType   @default(SNEAKERS)
  brand       String
  gender      Gender     @default(UNISEX)
  material    String?
  careInstructions String?

  // Metadatos
  featured    Boolean   @default(false)
  trending    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relaciones
  variants    ShoeVariant[]
  images      ShoeImage[]
  collections ShoeCollection[]

  @@map("shoe_products")
}

model ShoeVariant {
  id          String   @id @default(cuid())
  shopifyVariantId String?

  size        String   // "38", "39", "40", etc.
  width       ShoeWidth @default(STANDARD)
  color       String
  colorHex    String?  // #000000 para Negro

  // Inventario y precio
  price       Float
  comparePrice Float?  // Precio tachado
  sku         String   @unique
  barcode     String?
  inventory   Int      @default(0)

  // Relaciones
  product     ShoeProduct @relation(fields: [productId], references: [id])
  productId   String

  @@map("shoe_variants")
}

model ShoeImage {
  id        String   @id @default(cuid())
  url       String
  altText   String?
  position  Int      // Orden en galería

  product   ShoeProduct @relation(fields: [productId], references: [id])
  productId String

  @@map("shoe_images")
}

model ShoeCollection {
  id          String   @id @default(cuid())
  shopifyId   String?
  title       String
  handle      String   @unique
  description String?
  image       String?

  products    ShoeProduct[]

  @@map("shoe_collections")
}

model SizeChart {
  id          String   @id @default(cuid())
  brand       String   @unique
  type        ShoeType

  // Guía de tallas por región
  euSizes     String[]  // ["38", "39", "40", ...]
  usSizes     String[]  // ["6", "6.5", "7", ...]
  ukSizes     String[]  // ["5", "5.5", "6", ...]
  cmSizes     Float[]   // [24.0, 24.5, 25.0, ...]

  @@map("size_charts")
}

enum ShoeType {
  SNEAKERS
  BOOTS
  SANDALS
  LOAFERS
  DRESS_SHOES
  SPORTS
}

enum Gender {
  MEN
  WOMEN
  UNISEX
  KIDS
}

enum ShoeWidth {
  NARROW
  STANDARD
  WIDE
  EXTRA_WIDE
}
