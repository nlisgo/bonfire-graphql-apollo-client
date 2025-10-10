import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { createApolloClient } from './apolloClient';
import { queryTE, mutationTE, logError } from './apolloFpTs';
// import { YOUR_QUERY } from './queries';
// import { YOUR_MUTATION } from './mutations';

/**
 * Example interfaces for type safety
 */
interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface UsersResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

interface CreateUserResponse {
  createUser: User;
}

interface UpdateUserResponse {
  updateUser: User;
}

/**
 * Main application logic
 *
 * NOTE: This file contains example patterns for using Apollo Client with fp-ts.
 * The actual queries/mutations have been removed because they don't match your schema.
 *
 * To use this file:
 * 1. Add your own queries to src/queries.ts
 * 2. Add your own mutations to src/mutations.ts
 * 3. Run `npm run codegen` to generate types
 * 4. Uncomment and adapt the examples below
 * 5. Use the loginExample.ts file as a working reference
 */
async function main() {
  // Initialize Apollo Client
  // Replace with your actual GraphQL endpoint
  const client = createApolloClient({
    uri: 'https://openscience.network/api/graphql',
    headers: {
      'Authorization': 'Bearer your-token-here',
    },
  });

  console.log('Apollo Client with fp-ts Examples\n');
  console.log('⚠️  This file contains example patterns only.');
  console.log('   See src/loginExample.ts for a working example.\n');
  console.log('To use these examples:');
  console.log('1. Add queries to src/queries.ts');
  console.log('2. Add mutations to src/mutations.ts');
  console.log('3. Run npm run codegen');
  console.log('4. Uncomment the examples below\n');

  /*
  // Example 1: Simple query with error handling
  console.log('Example 1: Fetching all users');
  await pipe(
    queryTE<UsersResponse>(client, YOUR_QUERY),
    TE.map(data => {
      console.log(`Found ${data.users.length} users`);
      return data.users;
    }),
    TE.mapLeft(error => {
      console.error('Error fetching users:', error.message);
      return error;
    })
  )();

  // Example 2: Query with variables
  console.log('\nExample 2: Fetching single user');
  await pipe(
    queryTE<UserResponse, { id: string }>(client, GET_USER, { id: '123' }),
    TE.map(data => {
      console.log('User:', data.user);
      return data.user;
    }),
    logError('Failed to fetch user')
  )();

  // Example 3: Mutation with error handling
  console.log('\nExample 3: Creating a new user');
  await pipe(
    mutationTE<CreateUserResponse, { name: string; email: string }>(
      client,
      CREATE_USER,
      { name: 'John Doe', email: 'john@example.com' }
    ),
    TE.map(data => {
      console.log('Created user:', data.createUser);
      return data.createUser;
    }),
    logError('Failed to create user')
  )();

  // Example 4: Chaining operations (create then update)
  console.log('\nExample 4: Chaining create and update operations');
  await pipe(
    mutationTE<CreateUserResponse, { name: string; email: string }>(
      client,
      CREATE_USER,
      { name: 'Jane Smith', email: 'jane@example.com' }
    ),
    TE.chain(createData =>
      mutationTE<UpdateUserResponse, { id: string; name: string }>(
        client,
        UPDATE_USER,
        { id: createData.createUser.id, name: 'Jane Doe' }
      )
    ),
    TE.map(data => {
      console.log('User created and updated:', data.updateUser);
      return data.updateUser;
    }),
    logError('Failed in create/update chain')
  )();

  // Example 5: Multiple parallel queries
  console.log('\nExample 5: Fetching multiple users in parallel');
  const userIds = ['1', '2', '3'];

  const userQueries = userIds.map(id =>
    queryTE<UserResponse, { id: string }>(client, GET_USER, { id })
  );

  await pipe(
    TE.sequenceArray(userQueries),
    TE.map(results => {
      console.log(`Fetched ${results.length} users successfully`);
      results.forEach(data => console.log(`- ${data.user.name}`));
      return results;
    }),
    TE.orElse(error => {
      console.error('Error in parallel fetch:', error.message);
      return TE.right([]);
    })
  )();

  // Example 6: Handling errors with fold
  console.log('\nExample 6: Using fold for error handling');
  await pipe(
    queryTE<UserResponse, { id: string }>(client, GET_USER, { id: 'invalid-id' }),
    TE.fold(
      (error) => async () => {
        console.log('Handled error gracefully:', error.message);
        return { user: null };
      },
      (data) => async () => {
        console.log('Success:', data.user);
        return data;
      }
    )
  )();

  // Example 7: Using getOrElse for default values
  console.log('\nExample 7: Providing default value on error');
  const defaultUsers: UsersResponse = { users: [] };

  await pipe(
    queryTE<UsersResponse>(client, GET_USERS),
    TE.getOrElse(() => TE.right(defaultUsers)),
    TE.map(data => {
      console.log(`Retrieved ${data.users.length} users (or default)`);
      return data;
    })
  )();

  // Example 8: Combining multiple operations with validation
  console.log('\nExample 8: Complex workflow with validation');
  await pipe(
    queryTE<UsersResponse>(client, GET_USERS),
    TE.chain(data => {
      // Validate that we have users
      if (data.users.length === 0) {
        return TE.left(new Error('No users found'));
      }
      return TE.right(data.users[0]);
    }),
    TE.chain(firstUser =>
      mutationTE<UpdateUserResponse, { id: string; email: string }>(
        client,
        UPDATE_USER,
        { id: firstUser.id, email: 'updated@example.com' }
      )
    ),
    TE.map(data => {
      console.log('Successfully updated first user:', data.updateUser);
      return data.updateUser;
    }),
    TE.mapLeft(error => {
      console.error('Workflow failed:', error.message);
      return error;
    })
  )();

  console.log('\nAll examples completed!');
  */
}

// Run the application
main().catch(error => {
  console.error('Application error:', error);
  process.exit(1);
});
