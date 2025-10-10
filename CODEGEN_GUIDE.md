# GraphQL Code Generation Guide

This guide explains how to use GraphQL Code Generation in this project.

## What is GraphQL Code Generation?

GraphQL Code Generation automatically creates TypeScript types from your GraphQL schema and operations. This gives you:

- **Type Safety**: TypeScript knows the exact shape of your data
- **IDE Support**: Full autocomplete for queries, mutations, and variables
- **Compile-Time Errors**: Catch mistakes before runtime
- **Refactoring**: Changes to your schema are automatically reflected in types

## Quick Start

### 1. Configure Your Schema Source

Edit `codegen.ts` to point to your GraphQL schema:

**Option A: From API endpoint (recommended)**
```typescript
schema: process.env.BONFIRE_GRAPHQL_URI || 'https://api.example.com/graphql',
```

**Option B: From local file**
```typescript
schema: './schema.graphql',
```

**Option C: With authentication**
```typescript
schema: {
  [process.env.BONFIRE_GRAPHQL_URI]: {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
  },
},
```

### 2. Write Your Queries/Mutations

In `src/queries.ts` or `src/mutations.ts`:

```typescript
import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;
```

### 3. Generate Types

```bash
npm run codegen
```

This creates `src/generated/graphql.ts` with:
- `GetUserQuery` - The response type
- `GetUserQueryVariables` - The variables type
- `GetUserDocument` - Typed document node

### 4. Use Generated Types

```typescript
import { queryTE } from './apolloFpTs';
import { GetUserQuery, GetUserQueryVariables, GetUserDocument } from './generated/graphql';

const result = await pipe(
  queryTE<GetUserQuery, GetUserQueryVariables>(
    client,
    GetUserDocument,
    { id: '123' }  // TypeScript validates this!
  ),
  TE.map(data => {
    // data.user is fully typed!
    console.log(data.user.name);
    return data;
  })
)();
```

## Development Workflow

### Watch Mode

During development, run codegen in watch mode:

```bash
npm run codegen:watch
```

This automatically regenerates types when:
- You modify queries/mutations
- Your schema changes

### Typical Flow

1. Write/modify a query in `src/queries.ts`
2. Codegen detects the change (if in watch mode)
3. Types are regenerated
4. TypeScript immediately validates your code
5. IDE shows errors if types don't match

## Benefits Over Manual Types

### Before Code Generation

```typescript
// Manual types - can get out of sync with schema
interface UserResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const result = await queryTE<UserResponse>(client, GET_USER, { id: '123' });
// If schema changes, TypeScript won't know!
```

### After Code Generation

```typescript
// Generated types - always in sync with schema
import { GetUserQuery, GetUserQueryVariables, GetUserDocument } from './generated/graphql';

const result = await queryTE<GetUserQuery, GetUserQueryVariables>(
  client,
  GetUserDocument,
  { id: '123' }
);
// If schema changes, types are regenerated and TypeScript catches errors!
```

## Common Scenarios

### Scenario 1: New Field Added to Schema

**What happens:**
1. GraphQL schema adds a new field: `user.phoneNumber`
2. You run `npm run codegen`
3. Generated types now include `phoneNumber: string | null`
4. You can immediately use it with full type safety

### Scenario 2: Field Type Changed

**What happens:**
1. Schema changes `user.age` from `Int` to `String`
2. You run `npm run codegen`
3. Generated types update: `age: number` → `age: string`
4. TypeScript shows errors everywhere `age` is used incorrectly
5. You fix all locations before runtime!

### Scenario 3: Required Field Becomes Optional

**What happens:**
1. Schema changes `name: String!` to `name: String`
2. Codegen updates: `name: string` → `name: string | null`
3. TypeScript catches places where you didn't handle `null`

## Configuration Options

### Custom Scalars

If your schema has custom scalars, map them in `codegen.ts`:

```typescript
config: {
  scalars: {
    DateTime: 'string',
    Date: 'string',
    JSON: 'Record<string, any>',
    BigInt: 'number',
    UUID: 'string',
  },
}
```

### Naming Conventions

Customize how types are named:

```typescript
config: {
  namingConvention: {
    typeNames: 'pascal-case#pascalCase',
    enumValues: 'upper-case#upperCase',
  },
}
```

### Multiple Outputs

Generate different files for different purposes:

```typescript
generates: {
  './src/generated/graphql.ts': {
    plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
  },
  './src/generated/introspection.json': {
    plugins: ['introspection'],
  },
}
```

## Troubleshooting

### Error: "Unable to find any GraphQL type definitions"

**Solution:** Make sure your queries use the `gql` tag:
```typescript
export const MY_QUERY = gql`...`;  // ✓ Correct
const MY_QUERY = `...`;           // ✗ Wrong
```

### Error: "Unable to connect to GraphQL endpoint"

**Solutions:**
1. Check `BONFIRE_GRAPHQL_URI` in your `.env` file
2. Verify the endpoint is accessible
3. Add authentication headers if needed (see codegen.ts)
4. Use a local schema file instead

### Error: "Introspection is disabled"

**Solutions:**
1. Ask your API provider to enable introspection (for development)
2. Get a schema dump and use it locally:
   ```bash
   # If you have access to the server
   apollo service:download --endpoint=https://api.example.com/graphql ./schema.graphql
   ```
3. Use a local schema file

### Generated types not updating

**Solutions:**
1. Delete `src/generated/` and run `npm run codegen` again
2. Restart TypeScript server in your IDE (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")
3. Check that `ignoreNoDocuments: true` is set in `codegen.ts`

## Advanced Usage

### Fragments

Define reusable fragments:

```typescript
export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
  }
`;

export const GET_USER = gql`
  ${USER_FIELDS}
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
`;
```

Generated types will include `UserFieldsFragment`.

### Optimistic UI

Use generated types for optimistic updates:

```typescript
import { UpdateUserMutation } from './generated/graphql';

const optimisticResponse: UpdateUserMutation = {
  updateUser: {
    __typename: 'User',
    id: '123',
    name: 'New Name',
  },
};
```

## Resources

- [GraphQL Code Generator Docs](https://the-guild.dev/graphql/codegen/docs)
- [TypeScript Plugin](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript)
- [Typed Document Node](https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node)
