"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Feed() {

  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const filteredListings = listings.filter((item: any) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {

    fetch("/api/listings")
      .then(res => res.json())
      .then(data => setListings(data))

  }, [])


  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Travel Experiences
      </h1>

      <input
        placeholder="Search experiences..."
        className="border p-2 mb-6 w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-6">

        {filteredListings.map((item) => (

          <Link key={item._id} href={`/user/listing/${item._id}`}>

            <div className="border p-4 hover:shadow-lg">

              <img
                src={item.image}
                className="h-40 w-full object-cover"
              />

              <h2 className="text-xl font-bold mt-2">
                {item.title}
              </h2>

              <p>{item.location}</p>

              <p className="text-sm text-gray-600">
                {item.description}
              </p>

              <p className="text-sm text-gray-500">
                Posted {dayjs(item.createdAt).fromNow()}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>

  )

}