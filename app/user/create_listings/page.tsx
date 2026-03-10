"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListing(){

  const router = useRouter();

  const [title,setTitle] = useState("");
  const [location,setLocation] = useState("");
  const [image,setImage] = useState("");
  const [description,setDescription] = useState("");
  const [price,setPrice] = useState("");

  const handleSubmit = async (e:any)=>{

    e.preventDefault();

    await fetch("/api/listings",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        title,
        location,
        image,
        description,
        price
      })
    })

    router.push("/user/feed")

  }

  return(

    <div className="flex justify-center p-10">

      <form onSubmit={handleSubmit} className="space-y-4 w-96">

        <h2 className="text-2xl font-bold">
          Create Experience
        </h2>

        <input
        placeholder="Title"
        className="border p-2 w-full"
        onChange={(e)=>setTitle(e.target.value)}
        />

        <input
        placeholder="Location"
        className="border p-2 w-full"
        onChange={(e)=>setLocation(e.target.value)}
        />

        <input
        placeholder="Image URL"
        className="border p-2 w-full"
        onChange={(e)=>setImage(e.target.value)}
        />

        <textarea
        placeholder="Description"
        className="border p-2 w-full"
        onChange={(e)=>setDescription(e.target.value)}
        />

        <input
        placeholder="Price"
        className="border p-2 w-full"
        onChange={(e)=>setPrice(e.target.value)}
        />

        <button className="bg-purple-500 text-white p-2 w-full">
          Create Listing
        </button>

      </form>

    </div>

  )

}