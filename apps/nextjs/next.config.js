import { fileURLToPath } from 'url';
import createJiti from 'jiti';
import { withAxiom } from 'next-axiom';
import createMDX from '@next/mdx';
// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))('./src/env');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['@acme/api'],
};
const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Combine both withMDX and withAxiom
export default withAxiom(withMDX(config));
