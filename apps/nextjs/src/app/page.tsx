import { HydrateClient } from '~/trpc/server';

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  return (
    <HydrateClient>
      <main className="container h-screen py-16"></main>
    </HydrateClient>
  );
}
