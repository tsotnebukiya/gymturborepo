import HomepageComponent from '~/components/Homepage';

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  return <HomepageComponent />;
}
