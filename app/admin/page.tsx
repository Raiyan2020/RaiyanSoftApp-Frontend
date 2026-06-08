import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminIndexRedirect from '@/features/admin-login/components/admin-index-redirect';

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;

  if (adminToken) {
    redirect('/admin/projects');
  }

  return <AdminIndexRedirect />;
}
