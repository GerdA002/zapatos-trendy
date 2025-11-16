import { Link, useLoaderData } from 'react-router';

export async function loader() {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();

    return {
      productsCount: data.success ? data.products.length : 0,
      recentProducts: data.success ? data.products.slice(0, 5) : []
    };
  } catch (error) {
    return { productsCount: 0, recentProducts: [] };
  }
}

export default function Index() {
  const { productsCount, recentProducts } = useLoaderData();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard - Zapatos Trendy</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2>Resumen de Productos</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>
            {productsCount}
          </div>
          <p>Productos en tu tienda</p>
          <button style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            <Link to="/api/products" style={{ color: 'white', textDecoration: 'none' }}>
              Gestionar Productos
            </Link>
          </button>
        </div>

        <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2>Acciones Rápidas</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/api/products">Ver todos los productos</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/api/products">Crear nuevo producto</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/dev/db-test">Test Base de Datos</Link>
            </li>
          </ul>
        </div>
      </div>

      {recentProducts.length > 0 && (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2>Productos Recientes</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            {recentProducts.map(product => (
              <li key={product.id} style={{ marginBottom: '8px' }}>
                {product.title} - {product.product_type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
