import { gql } from '@apollo/client/core';

/**
 * Query to fetch posts with cursor-based pagination
 *
 * This query supports:
 * - first: Number of posts to fetch
 * - after: Cursor for pagination
 */
export const GET_POSTS = gql`
  query GetPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          postContent {
            name
            summary
            htmlBody
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Add your GraphQL queries here that match your API schema
 *
 * To find available queries:
 * 1. Visit your GraphQL endpoint in a browser (may have GraphiQL/Playground)
 * 2. Check the generated schema after running: npm run codegen
 * 3. Look at src/generated/graphql.ts for available types
 *
 * For your Bonfire/Sciety API, you might have queries like:
 * - me (get current user)
 * - posts (get posts) ✓ Added above
 * - users (get users)
 * etc.
 */

// Example: Get current user info
// export const GET_ME = gql`
//   query GetMe {
//     me {
//       __typename
//       # Add fields that exist on the Me type in your schema
//     }
//   }
// `;
