import axios from "axios";
import { useUserStore } from "@/store/useUserStore";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function showFollows(memberId: string) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/member/follower?memberId=${memberId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error during showFollowers: ${error}`);
  }
}

export async function showFollowings(memberId: string) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/member/following?memberId=${memberId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error during showFollowings: ${error}`);
  }
}

export async function doFollow(memberId: string) {
  try {
    const response = await axios.post(
      `${backendUrl}/api/member/follow?memberId=${memberId}`
    );
    const setUserInfo = useUserStore.getState().setUserInfo;

    const updatedFollowInfo = response.data;

    setUserInfo(updatedFollowInfo);

    return response.data;
  } catch (error) {
    throw new Error(`Error during doFollow: ${error}`);
  }
}
