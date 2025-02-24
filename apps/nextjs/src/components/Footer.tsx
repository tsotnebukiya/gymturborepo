import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © 2025 Smart Life Apps, LLC. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <span className="text-xs flex items-center gap-1">
          <span className="text-gray-500 dark:text-gray-400">Support:</span>
          <a
            className="font-medium text-gray-700 dark:text-gray-200 hover:underline"
            href="mailto:contact@slai.app"
          >
            contact@slai.app
          </a>
        </span>
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="/terms"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="/privacy"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="/delete"
        >
          Delete Account
        </Link>
      </nav>
    </footer>
  );
}
