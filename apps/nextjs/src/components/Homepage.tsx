import Link from 'next/link';
import Image from 'next/image';

export default function HomepageComponent() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 ">
        <div className="container px-4 md:px-6 m-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Smart Gym Assistant
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover exercises for any gym equipment, get detailed
                instructions, and create personalized workout plans with AI
                assistance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="https://apps.apple.com/ge/app/gymleadai-smarter-workouts/id6742331757"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/apple.svg"
                  alt="Download on the App Store"
                  width={564}
                  height={168}
                  className="h-16 w-auto"
                />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/android.png"
                  alt="Get it on Google Play"
                  width={564}
                  height={168}
                  className="h-16 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
