import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { authService } from '@/lib/auth-service';
import { AdminLoginValues } from '../schemas/admin-login.schema';

export function useAdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [bootstrapMessage, setBootstrapMessage] = useState<string | null>(null);

  const handleLogin = async (data: AdminLoginValues) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await apiService.post('admin/auth/login', {
        email: data.email,
        password: data.password,
        device_id: 'test_device',
        device_type: 'web',
      });

      if (!response.status) {
        let msg = response.message || 'Login failed.';
        if (response.errors && typeof response.errors === 'object') {
          const errList = Object.values(response.errors).flat();
          if (errList.length > 0) {
            msg = errList.join(' ');
          }
        }
        throw new Error(msg);
      }

      const { admin, token } = response.data;
      authService.setAdminSession(admin, token);

      router.push('/admin/projects');
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBootstrap = async () => {
    // Bootstrap is not needed with the backend database
    return null;
  };

  return {
    error,
    isLoading,
    isBootstrapping,
    bootstrapMessage,
    handleLogin,
    handleBootstrap,
  };
}

