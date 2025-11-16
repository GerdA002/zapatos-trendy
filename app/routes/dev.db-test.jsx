import { useLoaderData } from 'react-router';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function loader() {
  try {
    // Test connection
    await prisma.$connect();

    // Test query
    const productCount = await prisma.shoeProduct.count();
    const variantCount = await prisma.shoeVariant.count();
    const imageCount = await prisma.productImage.count();

    const data = {
      success: true,
      message: 'Conexión a la base de datos exitosa',
      counts: {
        products: productCount,
        variants: variantCount,
        images: imageCount
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorData = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorData), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default function DevDbTest() {
  const data = useLoaderData();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Prueba de Base de Datos</h1>

      {data.success ? (
        <div style={{ color: 'green' }}>
          <h2>✅ {data.message}</h2>
          <div style={{ marginTop: '20px' }}>
            <h3>Conteos:</h3>
            <ul>
              <li>Productos: {data.counts.products}</li>
              <li>Variantes: {data.counts.variants}</li>
              <li>Imágenes: {data.counts.images}</li>
            </ul>
          </div>
        </div>
      ) : (
        <div style={{ color: 'red' }}>
          <h2> Error de conexión</h2>
          <p><strong>Error:</strong> {data.error}</p>
        </div>
      )}

      <p><small>Timestamp: {data.timestamp}</small></p>
    </div>
  );
}
