import { Loader2 } from 'lucide-react';
import AppStateScreen from '@/components/layout/app-state-screen';

export default function Loading() {
  return (
    <AppStateScreen
      eyebrow="Loading"
      title="Getting everything ready"
      description="We are preparing the page and syncing the latest interface state. This should only take a moment."
      icon={<Loader2 className="animate-spin" size={30} />}
    />
  );
}
