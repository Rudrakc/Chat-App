import * as React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/AuthContext";

export default function Register({ setAuthState }) {
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setFullName] = React.useState("");
  const [userName, setUsername] = React.useState("");
  const [gender, setGender] = React.useState("");

  const handleSignUp = async () => {
    try {
      console.log(email, password);
      if (!userName || !email || !password || !name || !gender)
        return toast.warn("Please enter inputs!");
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(newUser.user);

      //Random Profile Picture
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${newUser.user.uid}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${newUser.user.uid}`;

      set(ref(db, "users/" + newUser.user.uid), {
        name: name,
        email: email,
        userName: userName,
        image: gender === "male" ? boyProfilePic : girlProfilePic,
      });
      setCurrentUser(newUser.user);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="flex w-full h-screen bg-primary">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-[#313338]">
          <h1 className="text-5xl font-semibold">Join Us</h1>
          <p className="font-medium text-lg text-gray-300 mt-4">
            Create your account by filling in the details below.
          </p>
          <div className="mt-8 ">
            <div className="mb-6">
              <input
                value={name}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl p-4 mt-1 bg-secondary_light"
                placeholder="Full name"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <input
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[50%] rounded-xl p-4 mt-1 bg-secondary_light"
                placeholder="Username"
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-[45%] rounded-xl p-4 mt-1 bg-secondary_light text-[#9ca3af] appearance-none"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col mb-6">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl p-4 mt-1 bg-secondary_light"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col mt-4">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary_light rounded-xl p-4 mt-1"
                placeholder=" password"
                type="Password"
              />
            </div>
            <div className="mt-14 flex flex-col">
              <button
                onClick={handleSignUp}
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg"
              >
                Sign up
              </button>
            </div>
            <div className="mt-8 flex justify-center items-center">
              <p className="font-medium text-base">Already have an account?</p>
              <button
                onClick={() => setAuthState("login")}
                className="ml-2 font-medium text-base text-violet-500"
              >
                Log in
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
