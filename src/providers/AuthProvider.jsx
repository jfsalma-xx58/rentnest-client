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

  // Save the user in our database (new users get the tenant role on the server)
  const saveUser = (info) => axiosPublic.post("/users", info);

  // Ask our server for a JWT and keep it in the browser
  const getToken = async (email) => {
    const res = await axiosPublic.post("/jwt", { email });
    localStorage.setItem("access-token", res.data.token);
  };

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUser({
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL,
    });
    await getToken(result.user.email);
    return result;
  };

  const googleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    await saveUser({
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL,
    });
    await getToken(result.user.email);
    return result;
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await getToken(currentUser.email);
        } catch (error) {
          // The user may not be saved yet during registration, which is fine
        }
      } else {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;