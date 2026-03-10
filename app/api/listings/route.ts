import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

export async function POST(req: Request): Promise<Response> {

  try {
    await connectDB();
    const data = await req.json();

    if (!data.creatorId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    const listing = await Listing.create({
      ...data,
      creator: data.creatorId,
      creatorName: data.creatorName
    });

    return Response.json(listing);
  } catch (error: any) {
    console.error("Create Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(): Promise<Response> {

  try {
    await connectDB();

    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .populate("creator", "name email");

    return Response.json(listings);

  } catch (error: any) {
    console.error("API Error:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}