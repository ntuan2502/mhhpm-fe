import Layout from "../components/Layout";
import "../styles/styles.css";
import { SessionProvider } from "next-auth/react";
import { store, persistor } from "../redux/Store";
import { PersistGate } from "redux-persist/integration/react";

import { Provider } from "react-redux";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
