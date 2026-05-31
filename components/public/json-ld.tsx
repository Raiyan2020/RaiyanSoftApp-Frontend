import Script from 'next/script';

type JsonLdProps = {
  id: string;
  data: Record<string, unknown>;
};

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <Script id={id} type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}

