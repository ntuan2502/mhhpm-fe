import Layout from "../components/Layout";
import "../styles/styles.css";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "../store";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
        <StoreProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StoreProvider>
    </SessionProvider>
  );
}
