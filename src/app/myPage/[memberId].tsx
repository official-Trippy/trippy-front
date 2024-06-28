// pages/myPage/[memberId].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Member {
  name: string;
  description: string;
}

const MemberPage: React.FC = () => {
  const router = useRouter();
  const { memberId } = router.query;

  const [memberData, setMemberData] = useState<Member | null>(null);

  useEffect(() => {
    if (memberId) {
      fetch(`/api/members/${memberId}`)
        .then((response) => response.json())
        .then((data: Member) => setMemberData(data))
        .catch((error) => console.error("Error fetching member data:", error));
    }
  }, [memberId]);

  if (!memberData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{memberData.name}'s Page</h1>
      <p>{memberData.description}</p>
      {/* Render member-specific content here */}
    </div>
  );
};

export default MemberPage;
