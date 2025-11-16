import { useLoaderData } from 'react-router';

export async function loader() {
  console.log('🔍 Diagnostic loader ejecutándose...');
  
  try {
    // Simular datos de prueba
    const testData = {
      success: true,
      message: 'Diagnóstico funcionando',
      timestamp: new Date().toISOString(),
      products: [
        { id: 1, name: 'Producto Test 1', price: 99.99 },
        { id: 2, name: 'Producto Test 2', price: 149.99 }
      ]
    };

    return new Response(JSON.stringify(testData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('❌ Error en diagnostic loader:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default function Diagnostic() {
  const data = useLoaderData();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🩺 Diagnóstico</h1>
      <div style={{ 
        background: data.success ? '#d4edda' : '#f8d7da', 
        padding: '1rem', 
        borderRadius: '5px', 
        border: `1px solid ${data.success ? '#c3e6cb' : '#f5c6cb'}` 
      }}>
        <h3 style={{ color: data.success ? '#155724' : '#721c24', margin: '0 0 1rem 0' }}>
          {data.success ? '✅' : '❌'} {data.message}
        </h3>
        <pre style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '3px', overflow: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
