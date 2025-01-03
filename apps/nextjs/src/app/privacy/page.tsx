'use client';

import { MDXProvider } from '@mdx-js/react';
import Privacy from './privacy.mdx';
import { useMDXComponents } from '../mdx-components';

export default function PrivacyPage() {
  const components = useMDXComponents({});

  return (
    <main className="relative mx-auto max-w-6xl flex flex-col">
      <div className="">
        <MDXProvider components={components}>
          <Privacy />
        </MDXProvider>
      </div>
    </main>
  );
}
