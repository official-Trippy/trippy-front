import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { code, state } = await req.json();

  try {
    const response = await axios.post(
      "https://nid.naver.com/oauth2.0/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
          code,
          state,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.error("Naver token exchange failed:", error);
    return NextResponse.json({
      data: "fail",
    });
  }
}
