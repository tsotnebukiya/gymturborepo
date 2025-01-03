'use client';

import { MDXProvider } from '@mdx-js/react';
import Terms from './terms.mdx';
import { useMDXComponents } from '../mdx-components';

export default function TermsPage() {
  const components = useMDXComponents({});

  return (
    <main className="relative mx-auto max-w-6xl flex flex-col">
      <div className="">
        <MDXProvider components={components}>
          <Terms />
        </MDXProvider>
      </div>
    </main>
  );
}
