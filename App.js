import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';


import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

export default function App() {
  return (
    <>
      <NativeRouter>
        <ApolloProvider client={apolloClient}>
          <Main />
          <StatusBar style="auto" />
        </ApolloProvider>
      </NativeRouter>
    </>
  );
}