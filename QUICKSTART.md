# Quick Start Guide

## What Just Happened?

Your codegen is now working! Here's what was fixed:

### Issues Found and Fixed

1. **LOGIN mutation** - Changed `username` → `emailOrUsername` to match your schema
2. **Example queries** - Removed generic examples that didn't match Bonfire/Sciety API
3. **Example mutations** - Removed generic CRUD mutations not in your schema

### What You Have Now

✅ Working codegen that generates types from your Bonfire GraphQL API
✅ Generated TypeScript types in `src/generated/graphql.ts` (22KB)
✅ A working LOGIN mutation example
✅ Full type definitions for your entire GraphQL schema

## Using Generated Types

### 1. Login Example (Already Working)

Run the login example to test it out:

```bash
npm run login
```

This uses the generated `LoginMutation` and `LoginMutationVariables` types.

### 2. Upgrade to Fully Typed Login

Update your `src/loginExample.ts` to use generated types:

```typescript
// At the top of the file, add:
import { LoginMutation, LoginMutationVariables, LoginDocument } from './generated/graphql';

// Replace the manual interfaces with generated types:
// Remove: interface LoginResponse { ... }
// Remove: interface LoginVariables { ... }

// Use in the mutation:
await pipe(
  mutationTE<LoginMutation, LoginMutationVariables>(
    client,
    LoginDocument,  // Use the generated document
    { emailOrUsername, password }
  ),
  TE.map(data => {
    const { token } = data.login;
    // TypeScript knows exactly what fields are available!
  })
)();
```

### 3. Exploring Your Schema

The generated file contains all available types. Look at `src/generated/graphql.ts` to see:

- All query types
- All mutation types
- All object types (User, Post, Activity, etc.)
- Input types for mutations

**Example types you might find useful:**
- `Activity`, `ActivityConnection`, `ActivityEdge`
- `Post`, `PostContent`, `PostConnection`
- `Me` (current user type)
- `User`, `Character`, `Profile`

### 4. Adding New Queries

To add a query that works with your schema:

**Step 1:** Look at what's available in `src/generated/graphql.ts` or visit your API endpoint

**Step 2:** Add the query to `src/queries.ts`:

```typescript
export const GET_ACTIVITIES = gql`
  query GetActivities($first: Int) {
    activities(first: $first) {
      edges {
        node {
          id
          date
          verb {
            verb
          }
        }
      }
    }
  }
`;
```

**Step 3:** Regenerate types:

```bash
npm run codegen
```

**Step 4:** Use with generated types:

```typescript
import { GetActivitiesQuery, GetActivitiesQueryVariables, GetActivitiesDocument } from './generated/graphql';

const result = await queryTE<GetActivitiesQuery, GetActivitiesQueryVariables>(
  client,
  GetActivitiesDocument,
  { first: 10 }
)();
```

## Development Workflow

1. **Write a query/mutation** in `src/queries.ts` or `src/mutations.ts`
2. **Run codegen** with `npm run codegen` (or `npm run codegen:watch`)
3. **Import generated types** from `./generated/graphql`
4. **Use with full type safety** - TypeScript validates everything!

## Tips

- Use `npm run codegen:watch` during development for automatic type generation
- Generated types show you exactly what fields are available
- If you get a codegen error, it means your query doesn't match the schema
- The `LOGIN` mutation is a working example you can reference

## Common Patterns

### Query with Variables
```typescript
import { MyQuery, MyQueryVariables, MyDocument } from './generated/graphql';

await pipe(
  queryTE<MyQuery, MyQueryVariables>(client, MyDocument, { id: '123' }),
  TE.map(data => console.log(data))
)();
```

### Mutation with Input
```typescript
import { MyMutation, MyMutationVariables, MyDocument } from './generated/graphql';

await pipe(
  mutationTE<MyMutation, MyMutationVariables>(
    client,
    MyDocument,
    { input: { field1: 'value' } }
  ),
  TE.map(data => console.log(data))
)();
```

### Chaining Authenticated Requests
```typescript
// 1. Login
const token = await pipe(
  mutationTE<LoginMutation, LoginMutationVariables>(client, LoginDocument, creds),
  TE.map(data => data.login?.token)
)();

// 2. Create authenticated client
const authClient = createApolloClient({
  uri: process.env.GRAPHQL_URI,
  headers: { Authorization: `Bearer ${token}` }
});

// 3. Make authenticated requests
await pipe(
  queryTE<MyProtectedQuery>(authClient, MyProtectedDocument),
  TE.map(data => console.log(data))
)();
```

## Next Steps

1. Explore `src/generated/graphql.ts` to see all available types
2. Visit your GraphQL endpoint to explore the schema interactively
3. Add queries/mutations that you need for your application
4. Use the generated types for full type safety!

## Need Help?

- Check `CODEGEN_GUIDE.md` for detailed documentation
- Look at `src/loginExample.ts` for a working example
- The generated types in `src/generated/graphql.ts` show you what's possible
