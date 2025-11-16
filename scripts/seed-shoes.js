#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const process = require('process');

import { PrismaClient } from '@prisma/client';
import { shoeDemoData } from './data/shoe-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log(' Poblando base de datos con zapatos demo...');

  try {
    await prisma.$connect();

    // 1. Crear guías de tallas (convertir arrays a JSON string)
    console.log(' Creando guías de tallas...');
    for (const sizeChart of shoeDemoData.sizeCharts) {
      // Convertir arrays a JSON string para el campo 'sizes'
      const sizesJson = JSON.stringify({
        euSizes: sizeChart.euSizes,
        usSizes: sizeChart.usSizes,
        ukSizes: sizeChart.ukSizes,
        cmSizes: sizeChart.cmSizes,
        type: sizeChart.type
      });

      await prisma.sizeChart.upsert({
        where: { brand: sizeChart.brand },
        update: { sizes: sizesJson },
        create: {
          brand: sizeChart.brand,
          sizes: sizesJson
        }
      });
      console.log(` Guía de tallas creada/actualizada: ${sizeChart.brand}`);
    }

    // 2. Crear colecciones
    console.log(' Creando colecciones...');
    for (const collection of shoeDemoData.collections) {
      await prisma.shoeCollection.upsert({
        where: { handle: collection.handle },
        update: {
          title: collection.title,
          description: collection.description,
          imageUrl: collection.imageUrl
        },
        create: {
          handle: collection.handle,
          title: collection.title,
          description: collection.description,
          imageUrl: collection.imageUrl
        }
      });
      console.log(` Colección creada/actualizada: ${collection.title}`);
    }

    // 3. Crear productos
    console.log(' Creando productos...');
    let productsCreated = 0;
    let variantsCreated = 0;
    let imagesCreated = 0;

    for (const productData of shoeDemoData.products) {
      // Verificar si el producto ya existe
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
            featured: productData.featured || false,
            trending: productData.trending || false
          }
        });
        productsCreated++;

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

        console.log(` Producto creado: ${product.title} (${productData.variants.length} variantes, ${productData.images.length} imágenes)`);
      } else {
        console.log(` Producto ya existe: ${productData.title}`);
      }
    }

    console.log('\n SEED COMPLETADO');
    console.log('================');
    console.log(` Productos creados: ${productsCreated}`);
    console.log(` Variantes creadas: ${variantsCreated}`);
    console.log(` Imágenes creadas: ${imagesCreated}`);

  } catch (error) {
    console.error(' Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
