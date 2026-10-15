import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save the RentNest profile.
  // The backend must preserve the role of existing accounts.
  const saveUser = async (info) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No Firebase user is signed in.");

  const firebaseIdToken = await currentUser.getIdToken();

  const response = await axiosPublic.post("/users", info, {
    headers: { Authorization: `Bearer ${firebaseIdToken}` },
  });
  return response.data;
};

  // Obtain a JWT for an existing RentNest profile.
  const getToken = async (email) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No Firebase user is signed in.");
  }

  // Get a fresh Firebase ID token to prove the user's identity.
  const firebaseIdToken = await currentUser.getIdToken();

  const response = await axiosPublic.post(
    "/jwt",
    { email },
    {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    }
  );

  if (!response.data?.token) {
    throw new Error("The server did not return an authentication token.");
  }

  // Store the RentNest backend token for protected API requests.
  localStorage.setItem("access-token", response.data.token);

  return response.data;
};

  // Create a Firebase email/password account.
  const registerUser = async (email, password) => {
    setLoading(true);

    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  // Authenticate an existing email/password account.
  // Do not create a database profile here: the login page handles that check.
  const loginUser = async (email, password) => {
    setLoading(true);

    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  // Open Google authentication.
  // The calling page decides whether a RentNest profile must be created.
  const googleLogin = async () => {
    setLoading(true);

    try {
      return await signInWithPopup(auth, googleProvider);
    } finally {
      setLoading(false);
    }
  };

  // Update the authenticated Firebase user's profile.
  const updateUserProfile = async (name, photo) => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user was found.");
    }

    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo || null,
    });
  };

  // Sign out and clear the saved RentNest JWT.
  const logout = async () => {
    setLoading(true);
    localStorage.removeItem("access-token");

    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  // Track Firebase authentication state.
  // Profile creation and token generation happen explicitly during
  // registration or login, so a missing profile is not silently hidden.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    registerUser,
    loginUser,
    googleLogin,
    updateUserProfile,
    saveUser,
    getToken,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;