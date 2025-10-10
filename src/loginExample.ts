import 'dotenv/config';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { createApolloClient } from './apolloClient';
import { mutationTE } from './apolloFpTs';
import { LOGIN } from './mutations';

/**
 * Interface for login response
 */
interface LoginResponse {
  login: {
    token: string;
  };
}

/**
 * Interface for login variables
 */
interface LoginVariables {
  emailOrUsername: string;
  password: string;
}

/**
 * Validates environment variables
 */
function validateEnv(): E.Either<Error, { uri: string; emailOrUsername: string; password: string }> {
  const uri = process.env.GRAPHQL_URI;
  const emailOrUsername = process.env.USERNAME; // Using USERNAME env var for emailOrUsername
  const password = process.env.PASSWORD;

  if (!uri) {
    return E.left(new Error('GRAPHQL_URI environment variable is not set'));
  }

  if (!emailOrUsername) {
    return E.left(new Error('USERNAME environment variable is not set'));
  }

  if (!password) {
    return E.left(new Error('PASSWORD environment variable is not set'));
  }

  return E.right({ uri, emailOrUsername, password });
}

/**
 * Performs login and returns authentication token
 */
async function login() {
  console.log('Login Example with fp-ts\n');

  // Validate environment variables
  const envValidation = validateEnv();

  if (E.isLeft(envValidation)) {
    console.error('Environment validation failed:', envValidation.left.message);
    console.log('\nPlease create a .env file based on .env.example');
    return;
  }

  const { uri, emailOrUsername, password } = envValidation.right;

  // Create Apollo Client (without auth token initially)
  const client = createApolloClient({
    uri,
  });

  // Execute login mutation
  await pipe(
    mutationTE<LoginResponse, LoginVariables>(
      client,
      LOGIN,
      { emailOrUsername, password }
    ),
    TE.map(data => {
      const { token } = data.login;
      console.log('Login successful!');
      console.log(`Token: ${token.substring(0, 20)}...`);

      // You can now use this token for subsequent requests
      return { token };
    }),
    TE.chain(({ token }) => {
      // Example: Create a new authenticated client
      const authenticatedClient = createApolloClient({
        uri,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('\nAuthenticated client created successfully!');
      console.log('You can now use this client for protected operations.');

      // Return the authenticated client for further use
      return TE.right(authenticatedClient);
    }),
    TE.fold(
      (error) => async () => {
        console.error('Login failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Check your .env file exists and has correct credentials');
        console.log('2. Verify your GraphQL endpoint is accessible');
        console.log('3. Ensure your username and password are correct');
      },
      (authenticatedClient) => async () => {
        console.log('\nLogin flow completed successfully!');
        // You can continue using the authenticatedClient here
      }
    )
  )();
}

// Run the login example
login().catch(error => {
  console.error('Application error:', error);
  process.exit(1);
});
