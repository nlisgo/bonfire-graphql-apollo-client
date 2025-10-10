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
 */
function validateEnv(): E.Either<Error, { uri: string; emailOrUsername: string; password: string }> {
  const uri = process.env.GRAPHQL_URI;
  const emailOrUsername = process.env.USERNAME;
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
  console.log('Login + Fetch All Posts Example\n');
  console.log('This example demonstrates:');
  console.log('1. Logging in to get an authentication token');
  console.log('2. Using the token in the Authorization header');
  console.log('3. Fetching all posts across all pages with pagination\n');

  // Validate environment variables
  const envValidation = validateEnv();

  if (E.isLeft(envValidation)) {
    console.error('Environment validation failed:', envValidation.left.message);
    console.log('\nPlease create a .env file based on .env.example');
    return;
  }

  const { uri, emailOrUsername, password } = envValidation.right;

  await pipe(
    // Step 1: Login to get token
    TE.right(createApolloClient({ uri })),
    TE.chain((unauthClient) => {
      console.log('Step 1: Logging in...');
      return pipe(
        mutationTE<LoginMutation, LoginMutationVariables>(
          unauthClient,
          LoginDocument,
          { emailOrUsername, password }
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
    // Step 2: Create authenticated client with token in header
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
    }),
    // Step 3: Fetch all posts across all pages
    TE.chain((authClient) => {
      console.log('Step 3: Fetching all posts (paginating through all pages)...');
      const pageSize = 10; // Fetch 10 posts per page
      return fetchAllPostsRecursive(authClient, pageSize);
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
        console.log('1. Check your .env file has correct credentials');
        console.log('2. Verify your GraphQL endpoint is accessible');
        console.log('3. Ensure you have permission to access posts');
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
