import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { useFollowingStore } from "@/store/useFollowingStore";

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
    const updateUserInfo = useUserStore.getState().updateUserInfo;
    const updatedFollowInfo = response.data.result;

    const followingStore = useFollowingStore.getState();
    followingStore.setFollowing([
      ...followingStore.following,
      updatedFollowInfo,
    ]);

    return response.data;
  } catch (error) {
    throw new Error(`Error during doFollow: ${error}`);
  }
}

export async function unfollow(targetMemberId: string) {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/member/follow?type=unfollow&targetMemberId=${targetMemberId}`
    );

    const followingStore = useFollowingStore.getState();
    followingStore.setFollowing(
      followingStore.following.filter(
        (following) => following.memberId !== targetMemberId
      )
    );

    return response.data;
  } catch (error) {
    throw new Error(`Error during unfollow: ${error}`);
  }
}
