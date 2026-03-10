"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({email,password})
    });

    const data = await res.json();

    if(data.token){

      localStorage.setItem("token",data.token);

      router.push("/user/feed");
    }

  }

  return(

    <div className="flex justify-center items-center h-screen">

      <form onSubmit={handleSubmit} className="space-y-4 w-80">

        <h2 className="text-2xl font-bold">Login</h2>

        <input
        placeholder="Email"
        className="border p-2 w-full"
        onChange={(e)=>setEmail(e.target.value)}
        />

        <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="bg-green-500 text-white p-2 w-full">
          Login
        </button>

      </form>

    </div>

  )

}