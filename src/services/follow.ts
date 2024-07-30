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
  const followingStore = useFollowingStore.getState();
  if (followingStore.loading) return;

  followingStore.setLoading(true);

  try {
    const response = await axios.post(
      `${backendUrl}/api/member/follow?memberId=${memberId}`
    );
    const updatedFollowInfo = response.data.result;

    const newFollowing = {
      followingCnt: followingStore.following.followingCnt + 1,
      followings: [...followingStore.following.followings, updatedFollowInfo],
    };
    followingStore.setFollowing(newFollowing);
    return response.data;
  } catch (error) {
    throw new Error(`Error during doFollow: ${error}`);
  } finally {
    followingStore.setLoading(false);
  }
}

export async function unfollow(targetMemberId: string) {
  const followingStore = useFollowingStore.getState();
  if (followingStore.loading) return;

  followingStore.setLoading(true);

  try {
    const response = await axios.delete(
      `${backendUrl}/api/member/follow?type=following&targetMemberId=${targetMemberId}`
    );
    console.log("Unfollow response:", response.data);

    if (response.data.isSuccess) {
      const newFollowings = followingStore.following.followings.filter(
        (following) => following.memberId !== targetMemberId
      );
      const newFollowing = {
        followingCnt: newFollowings.length,
        followings: newFollowings,
      };
      followingStore.setFollowing(newFollowing);
      console.log(
        "Unfollow successful, updated following state:",
        newFollowing
      );
    } else {
      console.error("Unfollow API call failed:", response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Error during unfollow:", error);
    throw new Error(`Error during unfollow: ${error}`);
  } finally {
    followingStore.setLoading(false);
  }
}
