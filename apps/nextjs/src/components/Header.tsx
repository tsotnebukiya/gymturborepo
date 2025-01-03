import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <Image
          src="/icon.png"
          alt="App Logo"
          width={32}
          height={32}
          className="mr-2"
        />
        <span className="font-bold">GymLead AI</span>
      </Link>
    </header>
  );
}
