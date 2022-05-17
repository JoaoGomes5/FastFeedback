import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import Cookies from "js-cookie";

import { createUser } from "./firestore";
import firebase, { firebaseConfig } from "./firebase";

if (!firebase.getApps.length) {
  firebase.initializeApp(firebaseConfig, "client-side");
}

type AuthContextData = {
  user: any;
  signInWithGithub(): Promise<void>;
  signOut: () => Promise<void>;
};

export interface IAuthContext {
  user: any;
  signInWithGithub: () => Promise<void>;
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
  const auth = getAuth();

  const handleUser = async (rawUser: any) => {
    if (rawUser) {
      const user = formatUser(rawUser);
      const { token, ...userWihoutTheToken } = user;

      await createUser(user.uid, userWihoutTheToken);
      setUser(user);

      Cookies.set("fast-feedback-auth", String(true), {
        expires: 1,
      });
      console.log("helkiiisadajsbdjhabj");

      return user;
    } else {
      setUser(false);
      Cookies.remove("fast-feedback-auth");
      return false;
    }
  };

  const signInWithGithub = async () => {
    return signInWithPopup(auth, new GithubAuthProvider())
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        handleUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(
          "Error code: " + errorCode,
          "error message: " + errorMessage
        );
      });
  };

  const signOut = async () => {
    await auth.signOut();
    handleUser(false);
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleUser);
    return () => unsubscribe();
  }, []);

  return {
    user,
    signInWithGithub,
    signOut,
  };
}

const formatUser = (user: any) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    token: user.accessToken,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};
