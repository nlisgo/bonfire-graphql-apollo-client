import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

/**
 * Configuration for Apollo Client
 */
export interface ApolloClientConfig {
  uri: string;
  headers?: Record<string, string>;
  timeout?: number; // Request timeout in milliseconds
}

/**
 * Creates and configures an Apollo Client instance
 * @param config - Configuration object containing GraphQL endpoint URI and optional headers
 * @returns Configured Apollo Client instance
 */
export function createApolloClient(config: ApolloClientConfig) {
  // Create a custom fetch with timeout support
  const timeoutFetch = (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    const timeout = config.timeout || 20000; // Default 20 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return fetch(url as any, {
      ...options,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
  };

  const httpLink = new HttpLink({
    uri: config.uri,
    fetch: timeoutFetch as any,
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
