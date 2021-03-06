import React from "react";
import Head from "next/head";
import Script from "next/script";
import { Button, Flex, Link, Text } from "@chakra-ui/react";

import { useAuth } from "@lib/auth";
import { Github, Google, Logo } from "@styles/theme";
import { useRouter } from "next/router";

export default function Home() {
  const { user, signInWithGithub, signInWithGoogle } = useAuth();
  const navigate = useRouter();
  return (
    <Flex
      as="main"
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      maxW="400px"
      margin="0 auto"
    >
      <Script
        id="redirectScript"
        dangerouslySetInnerHTML={{
          __html: `
          if (document.cookie && document.cookie.includes('fast-feedback-auth')) {
            window.location.href = "/dashboard"
          }
          `,
        }}
      />

      <Head>
        <title>Fast Feedback</title>
      </Head>

      <Logo color="back" fontSize="64px" />
      <Text mb={8} fontSize="lg">
        <Text as="span" fontWeight="bold" display="inline">
          Fast Feedback
        </Text>
        {" is being built as part of "}
        <Link
          href="https://react2025.com"
          isExternal
          textDecoration="underline"
        >
          React 2025 made by Lee Robinson
        </Link>
        {`. It's the easiest way to add comments or reviews to your static site. It's still a work-in-progress, but you can try it out by logging in.`}
      </Text>

      {user ? (
        <Button as="a" size="sm" fontWeight="medium" href="/dashboard">
          View Dashboard
        </Button>
      ) : (
        <>
          <Button
            alignItems="center"
            justifyContent="center"
            mt={4}
            size="lg"
            onClick={signInWithGithub}
            leftIcon={<Github />}
            color="white"
            backgroundColor="gray.900"
            fontWeight="medium"
            _hover={{ bg: "gray.700" }}
            _active={{ bg: "gray.800", transform: "scale(0.95)" }}
          >
            Sign In with Github
          </Button>
          <Button
            variant="outline"
            alignItems="center"
            justifyContent="center"
            mt={4}
            size="lg"
            onClick={signInWithGoogle}
            leftIcon={<Google />}
            color="gray.900"
            backgroundColor="white"
            fontWeight="medium"
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.100", transform: "scale(0.95)" }}
          >
            Sign In with Google
          </Button>
        </>
      )}
    </Flex>
  );
}
