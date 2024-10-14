import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  // console.log("Authorization code:", code);

  if (!code) {
    return NextResponse.json({ data: "Authorization code not provided" });
  }

  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URI,
          grant_type: "authorization_code",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;
    // console.log("Response data:", data);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Google token exchange failed");

    return NextResponse.json({
      data: "fail",
    });
  }
}
