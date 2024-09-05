import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserSchema from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";

export async function PATCH(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get the User model (reuse existing model if already defined)
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Parse request body
    const { email, imageUrl } = await req.json();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Add the imageUrl to the images array
    user.images.push(imageUrl);

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Image added successfully" }, { status: 200 });
  } catch (error : any) {
    console.error("Error adding image:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
