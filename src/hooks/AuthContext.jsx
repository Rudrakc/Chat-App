import React, { createContext, useContext, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { get, ref } from "firebase/database";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");

  const handleUserChange = (newUser) => {
    console.log("handleUserChange", newUser);
    setCurrentUser(newUser);
  };

  const value = {
    currentUser,
    handleUserChange,
    // isLoading,
    // fetchUser,
  };

  return (
    <AuthContext.Provider value={{ currentUser, handleUserChange }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
