import * as React from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/AuthContext";

function Login({ setAuthState }) {
  const { handleUserChange, currentUser } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    console.log("handling login");
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("suer id ", user.user.uid);
      handleUserChange(user.user.uid);
      setAuthState("home")
      console.log(currentUser);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="flex w-full h-screen bg-primary">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className=" w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-[#313338]">
          <h1 className="text-5xl font-semibold">Welcome Back</h1>
          <p className="font-medium text-lg text-gray-300 mt-4">
            Welcome back! Please enter you details.
          </p>
          <div className="mt-8 ">
            <div className="flex flex-col">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl p-4 mt-1 bg-secondary_light"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col mt-6">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary_light rounded-xl p-4 mt-1"
                placeholder="Enter your email"
                type={"password"}
              />
            </div>

            <div className="mt-12 flex flex-col">
              <button
                onClick={handleLogin}
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg"
              >
                Log in
              </button>
            </div>
            <div className="mt-8 flex justify-center items-center">
              <p className="font-medium text-base">Don't have an account?</p>
              <button
                onClick={() => setAuthState("register")}
                className="ml-2 font-medium text-base text-violet-500"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden relative w-1/2 h-full lg:flex items-center justify-center">
        <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 animate-spin" />
      </div>
    </div>
  );
}

export default Login;
