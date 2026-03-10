"use client";

import { useEffect, useState, use } from "react";

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params);

    const [listing, setListing] = useState<any>(null);

    useEffect(() => {

        fetch("/api/listings")
            .then(res => res.json())
            .then(data => {

                const item = data.find((i: any) => i._id === id);

                setListing(item);

            });

    }, [id]);

    const deleteListing = async () => {

        await fetch(`/api/listings/${id}`, {
            method: "DELETE"
        })

        window.location.href = "/user/feed"

    }

    if (!listing) return <p>Loading...</p>;

    return (

        <div className="p-10">

            <img
                src={listing.image}
                className="w-full h-80 object-cover"
            />

            <h1 className="text-3xl font-bold mt-4">
                {listing.title}
            </h1>

            <p className="text-lg">
                {listing.location}
            </p>

            <p className="mt-4">
                {listing.description}
            </p>

            <p className="mt-2 font-bold">
                ${listing.price}
            </p>

            <button
                onClick={deleteListing}
                className="bg-red-500 text-white px-4 py-2 mt-4"
            >
                Delete Listing
            </button>

        </div>

    );
}