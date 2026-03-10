import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.creatorId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const listing = await Listing.create({
      ...data,
      creator: data.creatorId,
      creatorName: data.creatorName
    });

    return NextResponse.json(listing, { status: 201 });

  } catch (error: any) {
    console.error("Create Listing Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .populate("creator", "name email");

    return NextResponse.json(listings, { status: 200 });

  } catch (error: any) {
    console.error("Get Listings Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}