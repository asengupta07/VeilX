import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserSchema from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";

async function patchhandler(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const { email, fileUrl, fileType, fileCategory } = await req.json();

    if (!email || !fileUrl || !fileType || !fileCategory) {
      console.error("Missing required fields");
      console.error({ email, fileUrl, fileType, fileCategory });
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newFile = {
      url: fileUrl,
      type: fileType,
      category: fileCategory,
    };

    user.files.push(newFile);

    await user.save();

    return NextResponse.json({ message: "File added successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error adding file:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export {
  patchhandler as PATCH,
}
