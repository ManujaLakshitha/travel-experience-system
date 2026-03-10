"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    const res = await fetch("/api/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({name,email,password})
    });

    if(res.ok){
      router.push("/login");
    }
  }

  return(

    <div className="flex justify-center items-center h-screen">

      <form onSubmit={handleSubmit} className="space-y-4 w-80">

        <h2 className="text-2xl font-bold">Register</h2>

        <input
        placeholder="Name"
        className="border p-2 w-full"
        onChange={(e)=>setName(e.target.value)}
        />

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

        <button className="bg-blue-500 text-white p-2 w-full">
          Register
        </button>

      </form>

    </div>

  )
}