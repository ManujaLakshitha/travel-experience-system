import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  await connectDB();

  const { id } = await params;

  const body = await req.json();
  const userId = body.userId;

  const listing = await Listing.findById(id);

  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  if (listing.creatorId !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await Listing.findByIdAndDelete(id);

  return NextResponse.json({ message: "Listing deleted successfully" });
}