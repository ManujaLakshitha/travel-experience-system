"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Feed() {

  const [listings, setListings] = useState<any[]>([]);

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

      <div className="grid grid-cols-3 gap-6">

        {listings.map((item) => (

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