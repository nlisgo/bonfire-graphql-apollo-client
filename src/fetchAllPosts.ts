import 'dotenv/config';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { createApolloClient } from './apolloClient';
import { mutationTE, queryTE } from './apolloFpTs';
import {
  LoginMutation,
  LoginMutationVariables,
  LoginDocument,
  GetPostsQuery,
  GetPostsQueryVariables,
  GetPostsDocument
} from './generated/graphql';

/**
 * Validates environment variables
 * Returns credentials if both BONFIRE_USERNAME and BONFIRE_PASSWORD are set, otherwise undefined
 */
function validateEnv(): E.Either<Error, {
  uri: string;
  credentials?: { emailOrUsername: string; password: string }
}> {
  const uri = process.env.BONFIRE_GRAPHQL_URI;
  const emailOrUsername = process.env.BONFIRE_USERNAME;
  const password = process.env.BONFIRE_PASSWORD;

  if (!uri) {
    return E.left(new Error('BONFIRE_GRAPHQL_URI environment variable is not set'));
  }

  // If both credentials are provided, include them
  if (emailOrUsername && password) {
    return E.right({ uri, credentials: { emailOrUsername, password } });
  }

  // If only one credential is provided, that's an error
  if (emailOrUsername || password) {
    console.log(emailOrUsername, password)
    return E.left(new Error('Both BONFIRE_USERNAME and BONFIRE_PASSWORD must be set, or neither'));
  }

  // No credentials provided - will use unauthenticated access
  return E.right({ uri });
}

/**
 * Fetches a single page of posts
 */
function fetchPostsPage(
  client: ReturnType<typeof createApolloClient>,
  pageSize: number,
  cursor?: string | null
): TE.TaskEither<Error, GetPostsQuery> {
  return queryTE<GetPostsQuery, GetPostsQueryVariables>(
    client,
    GetPostsDocument,
    { first: pageSize, after: cursor || undefined }
  );
}

/**
 * Recursively fetches all pages of posts
 */
function fetchAllPostsRecursive(
  client: ReturnType<typeof createApolloClient>,
  pageSize: number,
  allPosts: Array<any> = [],
  cursor?: string | null,
  pageNumber: number = 1
): TE.TaskEither<Error, Array<any>> {
  return pipe(
    fetchPostsPage(client, pageSize, cursor),
    TE.chain((data) => {
      const posts = data.posts;

      if (!posts?.edges) {
        return TE.right(allPosts);
      }

      // Extract posts from edges and add to accumulated list
      const newPosts = posts.edges
        .filter((edge): edge is NonNullable<typeof edge> => edge !== null && edge !== undefined)
        .map((edge) => edge.node)
        .filter((node): node is NonNullable<typeof node> => node !== null && node !== undefined);

      const updatedPosts = [...allPosts, ...newPosts];

      console.log(`  Page ${pageNumber}: Fetched ${newPosts.length} posts (total: ${updatedPosts.length})`);

      // Check if there are more pages
      if (posts.pageInfo.hasNextPage && posts.pageInfo.endCursor) {
        // Recursively fetch the next page
        return fetchAllPostsRecursive(
          client,
          pageSize,
          updatedPosts,
          posts.pageInfo.endCursor,
          pageNumber + 1
        );
      }

      // No more pages, return all accumulated posts
      return TE.right(updatedPosts);
    })
  );
}

/**
 * Main application logic
 */
async function main() {
  console.log('Fetch All Posts Example\n');

  // Validate environment variables
  const envValidation = validateEnv();

  if (E.isLeft(envValidation)) {
    console.error('Environment validation failed:', envValidation.left.message);
    console.log('\nPlease set BONFIRE_GRAPHQL_URI in your .env file');
    console.log('Optionally set BONFIRE_USERNAME and BONFIRE_PASSWORD for authenticated access');
    return;
  }

  const { uri, credentials } = envValidation.right;

  if (credentials) {
    console.log('Authentication mode: AUTHENTICATED');
    console.log('This example demonstrates:');
    console.log('1. Logging in to get an authentication token');
    console.log('2. Using the token in the Authorization header');
    console.log('3. Fetching all posts across all pages with pagination\n');
  } else {
    console.log('Authentication mode: UNAUTHENTICATED');
    console.log('No BONFIRE_USERNAME/BONFIRE_PASSWORD provided - fetching posts without authentication\n');
    console.log('This example demonstrates:');
    console.log('1. Fetching all posts without authentication');
    console.log('2. Paginating through all available pages\n');
  }

  await pipe(
    // Step 1: Create client (with or without authentication)
    credentials
      ? pipe(
          // With authentication: login first, then create authenticated client
          TE.right(createApolloClient({ uri })),
          TE.chain((unauthClient) => {
            console.log('Step 1: Logging in...');
            return pipe(
              mutationTE<LoginMutation, LoginMutationVariables>(
                unauthClient,
                LoginDocument,
                { emailOrUsername: credentials.emailOrUsername, password: credentials.password }
              ),
              TE.chain((data) => {
                if (!data.login?.token) {
                  return TE.left(new Error('Login response missing token'));
                }
                const token = data.login.token;
                console.log(`✓ Login successful! Token: ${token.substring(0, 20)}...\n`);
                return TE.right(token);
              })
            );
          }),
          TE.chain((token) => {
            console.log('Step 2: Creating authenticated client...');
            const authenticatedClient = createApolloClient({
              uri,
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            console.log('✓ Authenticated client created with Authorization header\n');
            return TE.right(authenticatedClient);
          })
        )
      : pipe(
          // Without authentication: create unauthenticated client directly
          TE.right(() => {
            console.log('Step 1: Creating unauthenticated client...');
            const client = createApolloClient({ uri });
            console.log('✓ Unauthenticated client created\n');
            return client;
          }),
          TE.map(createClient => createClient())
        ),
    // Step 2/3: Fetch all posts across all pages
    TE.chain((client) => {
      const stepNumber = credentials ? 3 : 2;
      console.log(`Step ${stepNumber}: Fetching all posts (paginating through all pages)...`);
      const pageSize = 10; // Fetch 10 posts per page
      return fetchAllPostsRecursive(client, pageSize);
    }),
    // Display results
    TE.map((allPosts) => {
      console.log(`\n✓ Successfully fetched all posts!`);
      console.log(`  Total posts: ${allPosts.length}\n`);

      // Display first few posts as examples
      console.log('Sample posts:');
      allPosts.slice(0, 5).forEach((post, index) => {
        console.log(`\n${index + 1}. Post ID: ${post.id}`);
        console.log(`   Title: ${post.postContent?.name || '(no title)'}`);
        console.log(`   Summary: ${post.postContent?.summary?.substring(0, 100) || '(no summary)'}...`);
        console.log(`   HTML Body: ${post.postContent?.htmlBody?.substring(0, 100) || '(no htmlBody)'}...`)
      });

      if (allPosts.length > 5) {
        console.log(`\n... and ${allPosts.length - 5} more posts`);
      }

      return allPosts;
    }),
    // Error handling
    TE.fold(
      (error) => async () => {
        console.error('\n✗ Error:', error.message);
        console.log('\nTroubleshooting:');
        if (credentials) {
          console.log('1. Check your .env file has correct credentials');
          console.log('2. Verify your GraphQL endpoint is accessible');
          console.log('3. Ensure you have permission to access posts');
        } else {
          console.log('1. Verify your GraphQL endpoint is accessible');
          console.log('2. Check if the API requires authentication');
          console.log('3. If authentication is required, set BONFIRE_USERNAME and BONFIRE_PASSWORD in .env');
        }
      },
      () => async () => {
        console.log('\n✓ Process completed successfully!');
      }
    )
  )();
}

// Run the application
main().catch((error) => {
  console.error('Application error:', error);
  process.exit(1);
});
