'use server'

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserSchema from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";

interface UserRequestBody {
    email: string;
}

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;


async function getFileSizeFromUrl(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { method: 'HEAD' });

        if (response.ok) {
            response.headers.forEach((value, name) => {
                if (name === "content-length") {
                    return formatBytes(parseInt(value))
                }
            });
        }
        return null;
    } catch (error) {
        console.error("Error fetching file size:", error);
        return null;
    }
}

function formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}


function generateRandomDocumentName(index: number): string {
    return `Document ${index}`;
}

function generateRandomSize(): string {
    const randomKB = Math.floor(Math.random() * 1000) + 100;
    return `${randomKB} KB`;
}

function generateRandomFavorite(): boolean {
    return Math.random() < 0.5;
}

function processUrlForDocumentType(url: string): string {
    if (url.includes("firebasestorage.googleapis.com")) {
        return "Redacted Document";
    } else if (url.includes("ipfs://")) {
        return "Original Document";
    }
    return "Unknown Document Type";
}

function convertIpfsUrl(url: string): string {
    if (url.startsWith("ipfs://")) {
        return url.replace("ipfs://", `https://${clientId}.ipfscdn.io/ipfs/`);
    }
    return url;
}

async function posthandler(req: NextRequest) {
    try {
        await connectToDatabase();

        const User = mongoose.models.User || mongoose.model("User", UserSchema);

        const { email }: UserRequestBody = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Process the files array from the user document
        const files = await Promise.all(user.files.map(async (file: any, index: number) => {
            const url = convertIpfsUrl(file.url);
            const size = await getFileSizeFromUrl(url) || generateRandomSize();
            const documentType = processUrlForDocumentType(file.url);

            return {
                id: index + 1,
                name: generateRandomDocumentName(index),
                type: file.category,
                size: size,
                favorite: generateRandomFavorite(),
                documentType: documentType,
                url: url,
            };
        }));

        // Return the files in the response
        return NextResponse.json({ files }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export { posthandler as POST };
