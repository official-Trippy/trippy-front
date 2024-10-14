import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  try {
    const res = await axios(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI}&code=${code}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const data = res.data;
    // console.log("Access token response data:", data);

    return NextResponse.json({
      data: data,
    });
  } catch (e) {
    return NextResponse.json({
      data: "fail",
    });
  }
}
