import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const FollowList: React.FC<{
  memberId: string;
  type: "follower" | "following";
}> = ({ memberId, type }) => {
  const fetchFollowers = async () => {
    const response = await axios.get(
      `${backendUrl}/api/member/${memberId}/follower`
    );
    return response.data.result.follower;
  };

  const fetchFollowing = async () => {
    const response = await axios.get(
      `${backendUrl}/api/member/${memberId}/following`
    );
    return response.data.result.followings;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [type, memberId],
    queryFn: type === "follower" ? fetchFollowers : fetchFollowing,
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const userData = data;

  return (
    <div>
      {userData.length === 0 ? (
        <div>
          아직 {type === "follower" ? "팔로워" : "팔로윙"}가 없습니다. 가장 먼저
          팔로우 해주세요!
        </div>
      ) : (
        userData.map((user: any) => (
          <div key={user.idx}>
            <p>{user.nickName}</p>
            <p>{user.memberId}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FollowList;
