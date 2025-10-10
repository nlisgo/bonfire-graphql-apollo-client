import { ApolloClient, ApolloQueryResult, FetchResult, DocumentNode, OperationVariables } from '@apollo/client/core';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';
import { Task } from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';

/**
 * Error type for GraphQL operations
 */
export interface GraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
}

/**
 * Wrapper for Apollo Client query operations using TaskEither
 * @param client - Apollo Client instance
 * @param query - GraphQL query document
 * @param variables - Query variables
 * @returns TaskEither that resolves to query result or error
 */
export function queryTE<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
  client: ApolloClient,
  query: DocumentNode,
  variables?: TVariables
): TaskEither<Error, TData> {
  return pipe(
    tryCatch(
      () => client.query<TData, TVariables>({
        query,
        ...(variables && { variables })
      } as any),
      (reason) => new Error(`Query failed: ${String(reason)}`)
    ),
    TE.chain((result) => {
      // Apollo Client 4.x uses `error` (singular) instead of `errors` (plural)
      if (result.error) {
        return TE.left(new Error(`GraphQL error: ${result.error.message}`));
      }
      if (!result.data) {
        return TE.left(new Error('Query returned no data'));
      }
      return TE.right(result.data);
    })
  );
}

/**
 * Wrapper for Apollo Client mutation operations using TaskEither
 * @param client - Apollo Client instance
 * @param mutation - GraphQL mutation document
 * @param variables - Mutation variables
 * @returns TaskEither that resolves to mutation result or error
 */
export function mutationTE<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
  client: ApolloClient,
  mutation: DocumentNode,
  variables?: TVariables
): TaskEither<Error, TData> {
  return pipe(
    tryCatch(
      () => client.mutate<TData, TVariables>({
        mutation,
        ...(variables && { variables })
      } as any),
      (reason) => new Error(`Mutation failed: ${String(reason)}`)
    ),
    TE.chain((result) => {
      // Apollo Client 4.x uses `error` (singular) instead of `errors` (plural)
      if (result.error) {
        return TE.left(new Error(`GraphQL error: ${result.error.message}`));
      }
      if (!result.data) {
        return TE.left(new Error('Mutation returned no data'));
      }
      return TE.right(result.data);
    })
  );
}

/**
 * Helper to convert a Promise to TaskEither
 */
export function fromPromise<A>(promise: () => Promise<A>): TaskEither<Error, A> {
  return tryCatch(
    promise,
    (reason) => new Error(String(reason))
  );
}

/**
 * Helper to log errors in a TaskEither chain without stopping the chain
 */
export function logError<E, A>(prefix: string): (te: TaskEither<E, A>) => TaskEither<E, A> {
  return TE.mapLeft((error) => {
    console.error(`${prefix}:`, error);
    return error;
  });
}

/**
 * Helper to provide a default value if TaskEither fails
 * Note: This returns a Task<A>, not TaskEither, because the error case is handled
 */
export function getOrElse<A>(defaultValue: A): (te: TaskEither<Error, A>) => Task<A> {
  return TE.getOrElse(() => async () => defaultValue);
}
