import { Compass } from 'lucide-react';
import AppStateScreen from '@/components/layout/app-state-screen';

export default function NotFound() {
  return (
    <AppStateScreen
      eyebrow="404"
      title="Page not found"
      description="The page you are looking for may have moved, or the link may be outdated. You can return home and continue from there."
      icon={<Compass size={30} />}
      primaryAction={{ href: '/', label: 'Go home' }}
    />
  );
}
