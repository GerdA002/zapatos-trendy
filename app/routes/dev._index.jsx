import { Link } from 'react-router';

export default function DevIndex() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Modo Desarrollo - Zapatos Trendy</h1>
      <div style={{ display: 'grid', gap: '15px', marginTop: '30px' }}>
        <div style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '20px' }}>
          <h2>📊 Base de Datos</h2>
          <Link to="/dev/db-test">→ Test de Base de Datos</Link>
        </div>
        <div style={{ border: '1px solid #28a745', borderRadius: '8px', padding: '20px' }}>
          <h2>👟 Productos</h2>
          <Link to="/dev/products">→ Ver Todos los Productos</Link>
        </div>
      </div>
    </div>
  );
}
