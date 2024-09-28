import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { doFollow, unfollow } from "@/services/follow";
import { useFollowingStore } from "@/store/useFollowingStore";

interface FollowButtonProps {
  postMemberId: string;
  userMemberId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  postMemberId,
  userMemberId,
}) => {
  const { following, loading, fetchFollowing, setFollowing } =
    useFollowingStore();
  const [localIsFollowing, setLocalIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (following.followings.length > 0) {
      setLocalIsFollowing(
        following.followings.some((follow) => follow.memberId === postMemberId)
      );
    }
  }, [following, postMemberId]);

  useEffect(() => {
    fetchFollowing(userMemberId);
  }, [fetchFollowing, userMemberId]);

  const updateFollowingState = useCallback(async () => {
    try {
      await fetchFollowing(userMemberId);
    } catch (error) {
      console.error("Error updating following state:", error);
    }
  }, [fetchFollowing, userMemberId]);

  const followHandler = async () => {
    if (loading) return;

    if (localIsFollowing) {
      const result = await Swal.fire({
        title: "정말 팔로우를 취소하시겠습니까?",
        text: "팔로우를 취소해도 상대방에게 알림은 가지 않습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "팔로우 취소",
        cancelButtonText: "취소",
      });

      if (result.isConfirmed) {
        try {
          await unfollow(postMemberId);
          await updateFollowingState();
          setLocalIsFollowing(false);
        } catch (error) {
          console.error("Error during unfollow:", error);
        }
      }
    } else {
      try {
        await doFollow(postMemberId);
        await updateFollowingState();
        setLocalIsFollowing(true);
      } catch (error) {
        console.error("Error during follow:", error);
      }
    }
  };
  if (postMemberId === userMemberId) {
    return null;
  }

  return (
    <div className="min-w-[70px] flex items-center">
      <button
        className={`bg-${localIsFollowing ? "[#F5F5F5]" : "[#FB3463]"} text-${localIsFollowing ? "[#292929]" : "white"} text-base text-white px-[2rem] py-[0.5rem] rounded-lg`}
        onClick={followHandler}
        disabled={loading}
      >
        {localIsFollowing ? "팔로잉" : "팔로우"}
      </button>
    </div>
  );
};

export default FollowButton;
