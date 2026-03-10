import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";

export async function POST(req: Request): Promise<Response> {

  await connectDB();

  const data = await req.json();

  const listing = await Listing.create({
    ...data,
    creatorId: data.creatorId,
    creatorName: data.creatorName
  });

  return Response.json(listing);
}

export async function GET(): Promise<Response> {

  await connectDB();

  const listings = await Listing.find().sort({ createdAt: -1 });

  return Response.json(listings);
}