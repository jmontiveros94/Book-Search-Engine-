import './App.css';
import { Outlet } from 'react-router-dom';

// imports the ApolloClient, ApolloProvider, and InMemoryCache from the @apollo/client package, also imports the createHttpLink from
// /graphql
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';

import Navbar from './components/Navbar';

// imports setContext from  @apollo/client/link/context 
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});


const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // returns the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
// caches data in working memory so that we don't have to re run the request every time
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;