import React from "react";
import { useQuery } from "react-query";
import { showFollows } from "@/services/follow";
import { showFollowings } from "@/services/follow";
import { useUserStore } from "@/store/useUserStore";

const FollowList: React.FC<{
  memberId: string;
  type: "follower" | "following";
}> = ({ memberId, type }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: [type, memberId],
    queryFn:
      type === "follower"
        ? () => showFollows(memberId)
        : () => showFollowings(memberId),
    onError: (error) => {
      console.error(error);
    },
  });

  const followInfo = useUserStore((state) => state.userInfo);
  console.log(followInfo);

  if (isLoading)
    return <div className="text-2xl font-bold my-12">Loading...</div>;
  if (error)
    return <div className="text-2xl font-bold my-12">Error loading data</div>;

  const userData = data.result;
  console.log("userData =", userData);

  return (
    <div>
      <div className="h-[400px]">
        <h3 className="text-2xl font-bold my-12">
          {type === "follower" ? (
            <div>팔로우 {followInfo.followerCnt}</div>
          ) : (
            <div>팔로잉 {followInfo.followingCnt}</div>
          )}
        </h3>
      </div>
    </div>
  );
};

export default FollowList;
