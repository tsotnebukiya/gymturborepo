'use client';

import { MDXProvider } from '@mdx-js/react';
import DeleteAccount from './delete-account.mdx';
import { useMDXComponents } from '../mdx-components';

export default function DeleteAccountPage() {
  const components = useMDXComponents({});

  return (
    <main className="relative mx-auto max-w-6xl flex flex-col">
      <div className="">
        <MDXProvider components={components}>
          <DeleteAccount />
        </MDXProvider>
      </div>
    </main>
  );
}
