import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
  return (
    NextResponse.json(imagekit.getAuthenticationParameters()),
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // or your frontend domain
        "Content-Type": "application/json",
      },
    }
  );
}
