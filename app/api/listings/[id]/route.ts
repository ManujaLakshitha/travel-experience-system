import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    if (listing.creator.toString() !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await Listing.findByIdAndDelete(id);
    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Delete Listing Error:", error);
    return NextResponse.json({ message: "Internal Server Error", details: error.message }, { status: 500 });
  }
}