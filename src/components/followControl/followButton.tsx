import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { doFollow, unfollow } from "@/services/follow";
import { useUserStore } from "@/store/useUserStore";

const FollowButton: React.FC<{ targetMemberId: string }> = ({
  targetMemberId,
}) => {
  const queryClient = useQueryClient();
  const userInfo = useUserStore((state) => state.userInfo);
  const isFollowing = userInfo?.following.some(
    (following: any) => following.memberId === targetMemberId
  );

  const followMutation = useMutation(() => doFollow(targetMemberId), {
    onSuccess: () => {
      queryClient.invalidateQueries("userInfo");
    },
  });

  const unfollowMutation = useMutation(() => unfollow(targetMemberId), {
    onSuccess: () => {
      queryClient.invalidateQueries("userInfo");
    },
  });

  const handleFollowClick = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <button onClick={handleFollowClick}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
