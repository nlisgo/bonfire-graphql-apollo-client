import { gql } from '@apollo/client/core';

/**
 * Login mutation - authenticates user and returns token
 * Updated to match actual Bonfire GraphQL schema
 */
export const LOGIN = gql`
  mutation Login($emailOrUsername: String!, $password: String!) {
    login(emailOrUsername: $emailOrUsername, password: $password) {
      token
    }
  }
`;

/**
 * COMMENTED OUT: Example mutations that don't match your schema
 *
 * To add your own mutations:
 * 1. Use GraphQL Playground/GraphiQL at your API endpoint to explore available mutations
 * 2. Or run: npm run codegen -- --require=false
 * 3. Or check the generated schema file after codegen runs
 *
 * Example template:
 *
 * export const MY_MUTATION = gql`
 *   mutation MyMutation($arg: String!) {
 *     myMutation(arg: $arg) {
 *       field1
 *       field2
 *     }
 *   }
 * `;
 */
