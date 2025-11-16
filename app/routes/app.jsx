import { Outlet, useNavigate } from 'react-router';

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        background: '#f8f9fa',
        padding: '1rem',
        borderBottom: '1px solid #dee2e6'
      }}>
        <h1 style={{ margin: 0 }}>Zapatos Trendy - Admin</h1>
        <nav>
          <button onClick={() => navigate('/api/products')} style={{ marginRight: '10px' }}>
            Gestionar Productos
          </button>
          <button onClick={() => navigate('/')}>
            Dashboard
          </button>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}
