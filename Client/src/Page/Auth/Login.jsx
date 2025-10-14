import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 flex flex-col justify-center items-center h-[100vh] bg-[var(--six)]">
        <h1 className="text-2xl font-bold text-white text-center">
          {" "}
          WELCOME TO BATU GENERAL HOSPITAL
        </h1>
        <p className="text-white text-center mb-10 ">
          Please login to continue
        </p>
        <Select className="w-[180px] ">
          <SelectTrigger style={{ color: "white" }}>
            <SelectValue placeholder="LANGUAGE" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english ">English</SelectItem>
            <SelectItem value="malay">Amharic</SelectItem>
            <SelectItem value="chinese">Afan Oromo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-1/2 h-[100vh] bg-[var(--two)]">
        <div className="flex flex-col justify-center items-center h-[100vh]">
          <div className="bg-[var(--six)] p-10 rounded-2xl">
            <h1 className="text-2xl  font-bold text-white text-center">
              LOGIN
            </h1>
            <p className="text-white text-center mb-10 ">
              Please login to continue
            </p>
            <form action="" className=" flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                className="border text-white border-gray-300 rounded-md p-2"
              />
              <input
                type="password"
                placeholder="Password"
                className="border text-white border-gray-300 rounded-md p-2"
              />
              <button type="submit" className="bg-[var(--two)] text-[var(--six)] rounded-md p-1 font-bold cursor-pointer">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
