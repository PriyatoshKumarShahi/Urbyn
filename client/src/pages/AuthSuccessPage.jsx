import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthSuccessPage() {
  const [params] = useSearchParams();
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      setToken(token).then(() => navigate('/'));
    } else {
      navigate('/login');
    }
  }, []);

  return <div className="p-8 font-black">Signing you in...</div>;
}
