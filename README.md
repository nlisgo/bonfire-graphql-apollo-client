# Apollo Client with fp-ts

A TypeScript project demonstrating how to use Apollo Client with fp-ts for functional GraphQL operations.

## Features

- **Apollo Client** for GraphQL communication
- **GraphQL Code Generation** for automatic TypeScript type generation
- **fp-ts** for functional programming patterns (TaskEither, pipe, etc.)
- **Type-safe** GraphQL queries and mutations
- **Comprehensive error handling** using fp-ts's Either and TaskEither
- **Examples** of common patterns: chaining, parallel execution, error recovery
- **Environment-based configuration** with dotenv

## Project Structure

```
src/
├── apolloClient.ts    # Apollo Client configuration
├── apolloFpTs.ts      # fp-ts wrappers for Apollo operations
├── queries.ts         # GraphQL query definitions (GET_POSTS)
├── mutations.ts       # GraphQL mutation definitions (LOGIN)
├── index.ts           # Usage examples
├── loginExample.ts    # Login example with environment variables
├── loginTyped.ts      # Type-safe login with code generation
├── fetchAllPosts.ts   # Advanced: Login + fetch all posts with pagination
└── generated/         # Auto-generated types (created by codegen)
    └── graphql.ts
```

## Installation

```bash
npm install
```

## Configuration

### 1. Set Up Environment Variables

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
GRAPHQL_URI=https://your-api.com/graphql
USERNAME=your_actual_username
PASSWORD=your_actual_password
```

**Note:** The `.env` file is ignored by git to keep your credentials safe.

### 2. Generate TypeScript Types from GraphQL Schema (Recommended)

This project supports **GraphQL Code Generation** to automatically generate TypeScript types from your GraphQL schema. This gives you:

- ✓ Full type safety for all GraphQL operations
- ✓ IDE autocomplete for queries, mutations, and variables
- ✓ Compile-time error checking
- ✓ Automatic refactoring when schema changes

#### How to Use Code Generation:

**Option 1: Generate from API endpoint (introspection)**

If your GraphQL API supports introspection, you can generate types directly from it:

```bash
# Make sure your GRAPHQL_URI is set in .env
npm run codegen
```

**Option 2: Generate from local schema file**

If you have a `schema.graphql` file:

1. Place your schema file in the project root
2. Edit `codegen.ts` and uncomment the local schema option:
   ```typescript
   schema: './schema.graphql',
   ```
3. Run: `npm run codegen`

**Option 3: Generate from authenticated endpoint**

If your endpoint requires authentication, edit `codegen.ts`:

```typescript
schema: {
  [process.env.GRAPHQL_URI]: {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
  },
},
```

#### Watch Mode

During development, you can run codegen in watch mode to automatically regenerate types when your queries change:

```bash
npm run codegen:watch
```

#### What Gets Generated

After running `npm run codegen`, you'll have:

- `src/generated/graphql.ts` - Contains all TypeScript types for your schema
- Typed document nodes for each query/mutation
- Fully typed variables and response objects

**Example:**

```typescript
// Before codegen (manual types)
const result = await mutationTE<any, any>(client, LOGIN, { username, password });

// After codegen (auto-generated types)
import { LoginMutation, LoginMutationVariables, LoginDocument } from './generated/graphql';
const result = await mutationTE<LoginMutation, LoginMutationVariables>(
  client,
  LoginDocument,
  { username, password }  // TypeScript validates this!
);
```

## Usage

### Login Examples

**Basic login (manual types):**

```bash
npm run login
```

**Type-safe login (with generated types):**

```bash
# First, generate types from your schema
npm run codegen

# Then run the typed example
npm run login:typed
```

Both examples will:
1. Load credentials from your `.env` file
2. Execute the login mutation
3. Receive an authentication token
4. Create an authenticated Apollo Client

### Fetch All Posts Example

This advanced example demonstrates login + authenticated requests with pagination:

```bash
npm run fetch-posts
```

This example:
1. **Logs in** to get an authentication token
2. **Creates an authenticated client** with `Authorization: Bearer [TOKEN]` header
3. **Fetches all posts** across all pages using cursor-based pagination
4. **Automatically handles pagination** by recursively fetching pages until complete

Features:
- Full type safety with generated types
- Functional composition with fp-ts
- Automatic pagination handling
- Error recovery at each step

See `src/fetchAllPosts.ts` for the complete implementation.

### General Usage

### 1. Configure Your GraphQL Endpoint (Alternative to .env)

For other examples, edit `src/index.ts` and update the Apollo Client configuration:

```typescript
const client = createApolloClient({
  uri: 'https://your-api.com/graphql',
  headers: {
    'Authorization': 'Bearer your-token',
  },
});
```

### 2. Update GraphQL Schemas

Modify `src/queries.ts` and `src/mutations.ts` to match your GraphQL API schema.

### 3. Run Examples

```bash
# Generate types from schema (recommended)
npm run codegen

# Run login examples (requires .env file)
npm run login         # Basic login
npm run login:typed   # Type-safe login (after codegen)

# Run advanced examples
npm run fetch-posts   # Login + fetch all posts with pagination

# Run general examples
npm run dev

# Or build and run
npm run build
npm start

# Watch mode for auto-regenerating types during development
npm run codegen:watch
```

## Key Concepts

### TaskEither

`TaskEither<E, A>` represents an asynchronous operation that may fail:
- `Left<E>`: Contains an error
- `Right<A>`: Contains a successful result

### Functional Patterns

**Simple Query:**
```typescript
await pipe(
  queryTE<UsersResponse>(client, GET_USERS),
  TE.map(data => console.log(data.users)),
  logError('Query failed')
)();
```

**Chaining Operations:**
```typescript
await pipe(
  mutationTE(client, CREATE_USER, variables),
  TE.chain(result =>
    mutationTE(client, UPDATE_USER, { id: result.createUser.id })
  ),
  TE.map(result => console.log(result))
)();
```

**Parallel Execution:**
```typescript
const queries = ids.map(id => queryTE(client, GET_USER, { id }));
await pipe(
  TE.sequenceArray(queries),
  TE.map(results => console.log(results))
)();
```

**Error Recovery:**
```typescript
await pipe(
  queryTE(client, GET_USERS),
  TE.getOrElse(() => TE.right(defaultValue))
)();
```

## API Reference

### `createApolloClient(config)`

Creates an Apollo Client instance.

```typescript
const client = createApolloClient({
  uri: string,
  headers?: Record<string, string>
});
```

### `queryTE<TData, TVariables>(client, query, variables?)`

Executes a GraphQL query and returns a `TaskEither<Error, TData>`.

### `mutationTE<TData, TVariables>(client, mutation, variables?)`

Executes a GraphQL mutation and returns a `TaskEither<Error, TData>`.

### Helper Functions

- `logError(prefix)`: Log errors without stopping the chain
- `getOrElse(defaultValue)`: Provide a default value on error
- `fromPromise(promise)`: Convert a Promise to TaskEither

## Benefits of This Approach

1. **Type Safety**: Full TypeScript support for queries and mutations
2. **Composability**: Chain operations with `pipe` and `chain`
3. **Error Handling**: Explicit error types with TaskEither
4. **Testability**: Pure functions are easy to test
5. **Readability**: Functional composition makes data flow clear

## Next Steps

- Add your own GraphQL queries and mutations
- Implement custom error types
- Add caching strategies
- Integrate with React/Vue components
- Add tests using jest or vitest

## Workflow Summary

Here's a typical development workflow with this project:

1. **Initial Setup:**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Generate Types:**
   ```bash
   npm run codegen
   # Types are generated in src/generated/graphql.ts
   ```

3. **Develop:**
   - Write GraphQL queries/mutations in `src/queries.ts` or `src/mutations.ts`
   - Use generated types from `src/generated/graphql.ts`
   - Run `npm run codegen:watch` to auto-regenerate types

4. **Use in Code:**
   ```typescript
   import { queryTE } from './apolloFpTs';
   import { GetUsersDocument, GetUsersQuery } from './generated/graphql';

   const result = await queryTE<GetUsersQuery>(client, GetUsersDocument)();
   ```

## Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [fp-ts Documentation](https://gcanti.github.io/fp-ts/)
- [GraphQL Documentation](https://graphql.org/)
