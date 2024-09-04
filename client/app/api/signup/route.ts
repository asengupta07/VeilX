"use server";

import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '../../_middleware/mongodb';
import mongoose from 'mongoose';
import UserSchema from '@/app/_models/schema';
import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is defined and of type string
const secretKey = process.env.JWT_SECRET as string;

interface UserRequestBody {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

async function posthandler (req: NextRequest) {
  const { email, password, username, confirmPassword }: UserRequestBody = await req.json();
  
  if (!email || !password || !username || !confirmPassword) {
    return NextResponse.json({ message: 'Please fill all fields' }, { status: 400 });
  }
  
  if (password !== confirmPassword) {
    return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    
    const User = mongoose.model('User', UserSchema);
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      username
    });
    
    await newUser.save();
    
    // Use `secretKey` with type assertion for JWT sign
    const token = jwt.sign({ userId: newUser._id }, secretKey);

    return NextResponse.json({ token, userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export {
  posthandler as POST
}