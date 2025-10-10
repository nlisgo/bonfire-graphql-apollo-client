import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

/**
 * Configuration for Apollo Client
 */
export interface ApolloClientConfig {
  uri: string;
  headers?: Record<string, string>;
}

/**
 * Creates and configures an Apollo Client instance
 * @param config - Configuration object containing GraphQL endpoint URI and optional headers
 * @returns Configured Apollo Client instance
 */
export function createApolloClient(config: ApolloClientConfig) {
  const httpLink = new HttpLink({
    uri: config.uri,
    fetch,
  });

  // Optional: Add authentication or custom headers
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        ...config.headers,
      },
    });
    return forward(operation);
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {},
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first', // Changed from network-only to reduce cache operations
      },
      query: {
        fetchPolicy: 'cache-first', // Changed from network-only to reduce cache operations
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  return client;
}
