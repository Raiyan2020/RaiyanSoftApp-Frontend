import JsonLd from './json-ld';
import { createWebPageJsonLd } from '@/lib/site';

type PublicWebPageJsonLdProps = {
  title: string;
  description: string;
  path: string;
};

export default function PublicWebPageJsonLd({ title, description, path }: PublicWebPageJsonLdProps) {
  const id = `webpage-schema-${path.replace(/\//g, '-') || 'home'}`;

  return (
    <>
      <JsonLd id={id} data={createWebPageJsonLd({ title, description, path })} />
    </>
  );
}
