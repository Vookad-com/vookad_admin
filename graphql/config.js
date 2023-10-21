import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    // uri: 'http://api.vookad.com',
    uri: process.env.API || 'http://localhost:5000/admin',
    cache: new InMemoryCache(),
  });

export default client;  