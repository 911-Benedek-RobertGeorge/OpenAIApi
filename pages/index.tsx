import Head from "next/head";
import styles from "../styles/styles.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
//import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn";
// const useGetIsLoggedIn = dynamic(() => import("@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn").then((module) => module.useGetIsLoggedIn), { ssr: false });
//const logout = dynamic(() => import("@multiversx/sdk-dapp/utils/logout").then((module) => module.logout), { ssr: false });
// const ExtensionLoginButton = dynamic(import("@multiversx/sdk-dapp/UI"), {
//   ssr: false,
// });

// const { ExtensionLoginButton } = require("@multiversx/sdk-dapp/UI");
// import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";

// // import { DataNft } from "@itheum/sdk-mx-data-nft";
// import { logout } from "@multiversx/sdk-dapp/utils/logout";

//const ExtensionLoginButton = dynamic(() => import("@multiversx/sdk-dapp/UI").then((module) => module.ExtensionLoginButton), { ssr: false });
const MyLoginComponent = dynamic(() => import("../components/LoginComponent").then((module) => module.ExtensionLoginButton), { ssr: false });
console.log(MyLoginComponent);
export default function Home() {
  const commonProps = {
    callbackRoute: "/",
    nativeAuth: {
      apiAddress: "https://devnet-api.multiversx.com",
      expirySeconds: 3000,
    },
  };
  // const { isLoggedIn } = useGetLoginInfo();
  return (
    <div className={styles.container}>
      <Head>
        <title>Data NFT Query</title>
      </Head>
      <MyLoginComponent></MyLoginComponent>
      {/* <div className={styles.logout}>
          {" "}
          <ExtensionLoginButton loginButtonText="Connect DeFi Wallet" {...commonProps} />
        </div> */}

      <main>
        <h1 className={styles.title}>
          <a href="https://openai.com/blog/openai-api">Data Nfts with OpenAI</a>
        </h1>
        <div className={styles.grid}>
          <Link className={styles.card} href="/api/generate">
            <h3>Generate &rarr;</h3>
            <p>Generate names for your data nfts.</p>
          </Link>

          <Link href="/data-nft" className={styles.card}>
            <h3>Data nft &rarr;</h3>
            <p>Discover and experiment queries on the data nfts</p>
          </Link>

          <Link href="/api/image" className={styles.card}>
            <h3>Generate image &rarr;</h3>
            <p>Create image out of data nft for better interpretation.</p>
          </Link>
          <Link href="/api/images" className={styles.card}>
            <h3>Variations of Data Nft Image- just an idea &rarr;</h3>
            <p>Create image out of the image of a data nft </p>
          </Link>
          {/*
          
          <Link href="/api/file-upload" className={styles.card}>
            <h3>File upload &rarr;</h3>
            <p>Learn about how to upload the data of a nft to OpenAi API!</p>
          </Link>
          <Link href="/api/get-files" className={styles.card}>
            <h3>Get files &rarr;</h3>
            <p>Instantly get the files uploaded.</p>
          </Link>
          <Link href="/api/fine-tunning" className={styles.card}>
            <h3>Fine-tunning &rarr;</h3>
            <p>Upload data of an data nft for better results</p>
          </Link> */}
        </div>
      </main>
      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
