"use server";

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../_middleware/mongodb';
import mongoose from 'mongoose';
import UserSchema from '@/app/_models/schema';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET as string;

interface UserRequestBody {
  identifier: string;
  password: string;
}

async function posthandler(req: NextRequest) {
  const { identifier, password }: UserRequestBody = await req.json();

  if (!identifier || !password) {
    return NextResponse.json({ message: 'Please fill all fields' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const User = mongoose.model('User', UserSchema);
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    return NextResponse.json({ 
      token, 
      userId: user._id, 
      email: user.email, 
      username: user.username 
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export {
  posthandler as POST
}