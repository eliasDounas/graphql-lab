import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { Toaster } from "react-hot-toast";

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

// 3
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

createRoot(document.getElementById('root')!).render(
  <StrictMode >
    <ApolloProvider client={client}>
    <Toaster />
      <App />
    </ApolloProvider>
  </StrictMode>,
)
