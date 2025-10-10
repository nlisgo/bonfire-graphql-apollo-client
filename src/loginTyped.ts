import 'dotenv/config';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { createApolloClient } from './apolloClient';
import { mutationTE } from './apolloFpTs';

/**
 * This file demonstrates using GraphQL Code Generation for type-safe operations.
 *
 * After running `npm run codegen`, you'll have:
 * - Auto-generated TypeScript types for all your GraphQL operations
 * - Typed document nodes for compile-time type checking
 * - Full IDE autocomplete for query/mutation variables and results
 *
 * To use this example:
 * 1. Set up your .env file with credentials
 * 2. Run `npm run codegen` to generate types from your schema
 * 3. Uncomment the import below and update the example code
 * 4. Run `npm run login:typed`
 */

// Uncomment after running codegen:
import {
  LoginMutation,
  LoginMutationVariables,
  LoginDocument
} from './generated/graphql';

/**
 * Example of type-safe login with generated types
 *
 * Benefits:
 * - TypeScript knows the exact shape of variables and response
 * - IDE autocomplete for all fields
 * - Compile-time errors if you use wrong types
 * - Refactoring is safe - TypeScript will catch breaking changes
 */
async function loginTyped() {
  console.log('Type-Safe Login Example\n');

  // Validate environment
  const uri = process.env.BONFIRE_GRAPHQL_URI;
  const emailOrUsername = process.env.BONFIRE_USERNAME;
  const password = process.env.BONFIRE_PASSWORD;

  if (!uri || !emailOrUsername || !password) {
    console.error('Please set BONFIRE_GRAPHQL_URI, BONFIRE_USERNAME, and BONFIRE_PASSWORD in .env');
    return;
  }

  // Create Apollo Client
  const client = createApolloClient({ uri });

  console.log('✓ Using generated types from GraphQL schema');
  console.log('  - Full type safety for variables and responses');
  console.log('  - Compile-time validation of all fields\n');

  // Using generated types for full type safety!
  await pipe(
    // TypeScript knows LoginMutationVariables type!
    mutationTE<LoginMutation, LoginMutationVariables>(
      client,
      LoginDocument,
      { emailOrUsername, password }
    ),
    TE.chain((data) => {
      // TypeScript knows the exact shape of data.login!
      // Handle nullable response properly
      if (!data.login?.token) {
        return TE.left(new Error('Login response missing token'));
      }
      const token = data.login.token;
      console.log('✓ Login successful!');
      console.log(`  Token: ${token.substring(0, 20)}...`);
      return TE.right({ token });
    }),
    TE.chain(({ token }) => {
      const authenticatedClient = createApolloClient({
        uri,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('\n✓ Authenticated client created!');
      console.log('  You can now use this client for protected operations.');
      return TE.right(authenticatedClient);
    }),
    TE.fold(
      (error) => async () => {
        console.error('✗ Login failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Check your .env file has correct credentials');
        console.log('2. Verify your GraphQL endpoint is accessible');
        console.log('3. Ensure credentials are correct');
      },
      () => async () => {
        console.log('\n✓ Login flow completed successfully!');
      }
    )
  )();
}

// Example of how types help catch errors at compile time
function demonstrateTypeSafety() {
  console.log('\n--- Type Safety Benefits ---\n');

  console.log('Without codegen:');
  console.log('  mutation(LOGIN, { usrname: "typo" })  // Runtime error! 😢\n');

  console.log('With codegen:');
  console.log('  mutation(LoginDocument, { usrname: "typo" })');
  console.log('  // TypeScript error at compile time! ✓');
  console.log('  // Property "usrname" does not exist on type LoginMutationVariables\n');

  console.log('IDE Benefits:');
  console.log('  - Autocomplete for all GraphQL fields');
  console.log('  - Jump to definition');
  console.log('  - Refactoring support');
  console.log('  - Inline documentation\n');
}

// Run the example
loginTyped()
  .then(() => demonstrateTypeSafety())
  .catch(error => {
    console.error('Application error:', error);
    process.exit(1);
  });
