import Layout from "../components/Layout";
import "../styles/styles.css";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "../store";
import { CookiesProvider } from "react-cookie";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <CookiesProvider>
        <StoreProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StoreProvider>
      </CookiesProvider>
    </SessionProvider>
  );
}
