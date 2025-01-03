'use client';

import type { MDXComponents } from 'mdx/types';
import Image, { type ImageProps } from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-4 text-xl font-semibold text-gray-900">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-7 text-gray-700">{children}</p>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-orange-500 hover:text-orange-600 transition-colors"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc text-gray-700">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal text-gray-700">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-2">{children}</li>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-lg my-8"
        {...(props as ImageProps)}
      />
    ),
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-900">
        {children}
      </code>
    ),
    ...components,
  };
}
