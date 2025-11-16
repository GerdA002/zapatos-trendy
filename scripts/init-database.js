#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const process = require('process');

import { PrismaClient } from '@prisma/client';
import { shoeDemoData } from './data/shoe-data.js';

const prisma = new PrismaClient();

async function initDatabase() {
  console.log(' Inicializando base de datos para Zapatos Trendy...');

  let productsCreated = 0;
  let variantsCreated = 0;
  let imagesCreated = 0;

  try {
    // 1. Verificar conexión a la base de datos
    await prisma.$connect();
    console.log(' Conectado a la base de datos SQLite');

    // 2. Verificar si las tablas existen
    const tableCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'`;
    console.log(`📊 Tablas en la BD: ${tableCount[0].count}`);

    // 3. Crear guías de tallas
    console.log(' Configurando guías de tallas...');
    for (const sizeChart of shoeDemoData.sizeCharts) {
      const existingChart = await prisma.sizeChart.findUnique({
        where: { brand: sizeChart.brand }
      });

      if (!existingChart) {
        await prisma.sizeChart.create({ data: sizeChart });
        console.log(` Guía de tallas creada: ${sizeChart.brand}`);
      } else {
        console.log(` Guía de tallas ya existe: ${sizeChart.brand}`);
      }
    }

    // 4. Crear colecciones
    console.log(' Configurando colecciones...');
    for (const collection of shoeDemoData.collections) {
      const existingCollection = await prisma.shoeCollection.findUnique({
        where: { handle: collection.handle }
      });

      if (!existingCollection) {
        await prisma.shoeCollection.create({ data: collection });
        console.log(` Colección creada: ${collection.title}`);
      } else {
        console.log(` Colección ya existe: ${collection.title}`);
      }
    }

    // 5. Crear productos de zapatos
    console.log('👟 Creando productos de zapatos...');

    for (const productData of shoeDemoData.products) {
      const existingProduct = await prisma.shoeProduct.findUnique({
        where: { handle: productData.handle }
      });

      if (!existingProduct) {
        // Crear producto
        const product = await prisma.shoeProduct.create({
          data: {
            title: productData.title,
            handle: productData.handle,
            description: productData.description,
            productType: productData.productType,
            brand: productData.brand,
            gender: productData.gender,
            material: productData.material,
            featured: productData.featured,
            trending: productData.trending
          }
        });

        productsCreated++;
        console.log(` Producto creado: ${product.title}`);

        // Crear variantes
        for (const variantData of productData.variants) {
          await prisma.shoeVariant.create({
            data: {
              size: variantData.size,
              color: variantData.color,
              colorHex: variantData.colorHex,
              price: variantData.price,
              sku: variantData.sku,
              inventory: variantData.inventory,
              productId: product.id
            }
          });
          variantsCreated++;
        }

        // Crear imágenes
        for (const imageData of productData.images) {
          await prisma.shoeImage.create({
            data: {
              url: imageData.url,
              altText: imageData.altText,
              position: imageData.position,
              productId: product.id
            }
          });
          imagesCreated++;
        }

        console.log(`    ${productData.variants.length} variantes creadas`);
        console.log(`    ${productData.images.length} imágenes creadas`);
      } else {
        console.log(` Producto ya existe: ${productData.title}`);
      }
    }

    // 6. Generar reporte final
    console.log('\n INICIALIZACIÓN COMPLETADA');
    console.log('================================');
    console.log(` Productos creados: ${productsCreated}`);
    console.log(` Variantes creadas: ${variantsCreated}`);
    console.log(` Imágenes creadas: ${imagesCreated}`);
    console.log('================================');

    // 7. Obtener resumen de datos
    const [totalProducts, totalVariants, totalCollections] = await Promise.all([
      prisma.shoeProduct.count(),
      prisma.shoeVariant.count(),
      prisma.shoeCollection.count()
    ]);

    console.log('\n RESUMEN DE LA BASE DE DATOS:');
    console.log(` Total productos: ${totalProducts}`);
    console.log(` Total variantes: ${totalVariants}`);
    console.log(` Total colecciones: ${totalCollections}`);
    console.log('================================');

    // 8. Mostrar productos creados
    const products = await prisma.shoeProduct.findMany({
      include: {
        variants: true,
        images: true,
        collections: true
      }
    });

    console.log('\n PRODUCTOS DISPONIBLES:');
    products.forEach(product => {
      console.log(`\n ${product.title}`);
      console.log(`    Precio: ${product.variants[0]?.price}€`);
      console.log(`    Tallas: ${product.variants.map(v => v.size).join(', ')}`);
      console.log(`    Colores: ${[...new Set(product.variants.map(v => v.color))].join(', ')}`);
      console.log(`    Stock total: ${product.variants.reduce((sum, v) => sum + v.inventory, 0)} unidades`);
    });

  } catch (error) {
    console.error(' Error durante la inicialización:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('\n Conexión a la BD cerrada');
  }
}

// Función para resetear la base de datos
async function resetDatabase() {
  console.log(' Reseteando base de datos...');

  try {
    await prisma.shoeImage.deleteMany();
    await prisma.shoeVariant.deleteMany();
    await prisma.shoeProduct.deleteMany();
    await prisma.shoeCollection.deleteMany();
    await prisma.sizeChart.deleteMany();
    console.log(' Base de datos reseteada');
  } catch (error) {
    console.error(' Error al resetear BD:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
async function main() {
  const command = process.argv[2];

  if (command === '--reset') {
    await resetDatabase();
    await initDatabase();
  } else {
    await initDatabase();
  }
}

// Solo ejecutar si es el archivo principal
if (process.argv[1].includes('init-database.js')) {
  main().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

export { initDatabase, resetDatabase };
