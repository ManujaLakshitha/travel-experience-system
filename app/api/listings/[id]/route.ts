import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting listing" }, { status: 500 });
  }
}