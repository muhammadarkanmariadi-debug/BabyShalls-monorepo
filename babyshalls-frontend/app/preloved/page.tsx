import { redirect } from 'next/navigation';

export default function PrelovedRedirectPage() {
  redirect('/shop?category=Preloved');
}
