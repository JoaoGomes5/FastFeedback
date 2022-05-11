import Head from "next/head";
import Image from "next/image";
import { useAuth } from "../lib/auth";
import styles from "../styles/Home.module.css";

export default function Home() {
  const auth = useAuth();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Fast Feedback</h1>

        <p className={styles.description}>
          Current user:{" "}
          <code className={styles.code}>
            {auth?.user ? auth.user.name : "User not signed"}
          </code>
        </p>

        {auth.user?.email ? (
          <button onClick={(e) => auth.signOut()}>Sign out</button>
        ) : (
          <button onClick={(e) => auth.signInWithGithub()}>Sign In</button>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
