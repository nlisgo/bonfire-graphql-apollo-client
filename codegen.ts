import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  // Option 1: Load schema from GraphQL endpoint (with introspection)
  // Uncomment this if your API supports introspection:
  schema: process.env.BONFIRE_GRAPHQL_URI || 'https://api.example.com/graphql',

  // Option 2: Load schema from local file
  // Uncomment this if you have a schema file:
  // schema: './schema.graphql',

  // Option 3: Load schema with authentication headers
  // Uncomment and modify if your endpoint requires authentication:
  // schema: {
  //   [process.env.BONFIRE_GRAPHQL_URI || 'https://api.example.com/graphql']: {
  //     headers: {
  //       Authorization: `Bearer ${process.env.AUTH_TOKEN || ''}`,
  //     },
  //   },
  // },

  // Specify which files contain GraphQL operations
  documents: ['src/**/*.ts', '!src/generated/**/*'],

  // Generate types and typed document nodes
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        // Generate types that are compatible with fp-ts
        avoidOptionals: false,
        maybeValue: 'T | null | undefined',
        // Use exact types for better type safety
        exactOptionalPropertyTypes: false,
        // Add useful helper types
        scalars: {
          DateTime: 'string',
          Date: 'string',
          JSON: 'Record<string, any>',
        },
      },
    },
  },

  // Watch mode configuration
  watch: false,

  // Ignore certain files
  ignoreNoDocuments: true,
};

export default config;
