import React, { useState, useEffect } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./hooks/AuthContext";
import Home from "./home/Home";

function App() {
  // const { currentUser } = useAuth();
  const [authState, setAuthState] = useState("login");

  // useEffect(() => {
  //   const unSub = fetchUser();

  //   return () => {
  //     unSub();
  //   };
  // }, [fetchUser]);

  return (
    // <>
    //   {authState === "login" ? (
    //     <Login setAuthState={setAuthState} />
    //   ) : authState === "register" ? (
    //     <Register setAuthState={setAuthState} />
    //   ) : authState === "home" ? (
    //     <Home></Home>
    //   ) : null}
    //   <ToastContainer position="bottom-right" />
    // </>
    <Home></Home>
  );
}

export default App;
