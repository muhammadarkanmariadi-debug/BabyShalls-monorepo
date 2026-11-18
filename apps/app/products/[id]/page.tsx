import { redirect } from 'next/navigation';

export default async function LegacyProductRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/product/${encodeURIComponent(id)}`);
}
