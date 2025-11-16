import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authenticate } from '../shopify.server.js';

export async function loader({ request }) {
  return authenticate.admin(request);
}

export default function AuthLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al dashboard después del login
    navigate('/app', { replace: true });
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <p>Iniciando sesión...</p>
    </div>
  );
}
