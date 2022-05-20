import React from "react";
import Cookies from "js-cookie";

import { supabaseClient } from "./supabase-client";
import { createUser, getUser } from "./supabase-db";
import { redirect } from "next/dist/server/api-utils";
import { Session } from "@supabase/supabase-js";

type AuthContextData = {
  user: any;
  token: string;
  session: Session;
  signInWithGithub(): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signOut: () => Promise<void>;
};

export interface IAuthContext {
  user: any;
  token: string;
  session: Session;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle(): Promise<void>;
  signOut: () => Promise<void>;
}

const authContext = React.createContext<AuthContextData>({} as IAuthContext);

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return React.useContext(authContext);
};

function useAuthProvider() {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState("");
  const [session, setSession] = React.useState<Session>();
  const [isLoading, setLoading] = React.useState(false);

  const handleUser = async (rawUser: any) => {
    if (rawUser) {
      const user = formatUser(rawUser);
      console.log(user);

      // await createUser(user);

      // setUser(user);

      return user;
    } else {
      setUser(false);
      Cookies.remove("fast-feedback-auth");
      return false;
    }
  };

  const signInWithGithub = async () => {
    await supabaseClient.auth.signIn({
      provider: "github",
    });
  };

  const signInWithGoogle = async () => {
    await supabaseClient.auth.signIn({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    setUser(false);
  };

  React.useEffect(() => {
    const currentSession = supabaseClient.auth.session();

    if (currentSession) {
      setSession(currentSession);
      setToken(currentSession.access_token);
      setUser(formatUser(currentSession?.user));
    } else {
      signOut();
    }

    const { data } = supabaseClient.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setToken(newSession.access_token);
        setUser(formatUser(newSession?.user));

        fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ event, session: newSession }),
        });
      }
    );

    return () => {
      data.unsubscribe();
    };
  }, []);

  return {
    user,
    token,
    session,
    signInWithGithub,
    signInWithGoogle,
    signOut,
  };
}

const formatUser = (user: any) => {
  const userData = user?.user_metadata;
  const provider = user?.identities[0].provider;

  return {
    id: user?.id,
    email: userData?.email,
    name: userData?.full_name,
    provider: provider,
    avatar_url: userData?.avatar_url,
  };
};
