// export default interface SignUpData {
//     memberId: string;
//     password: string;
//     nickName: string;
//     email: string;
//     name: string;
//     gender: string;
//     phone: string;
//   }

// export default interface SignUpData {
//   email: string;
//   password: string;
// }

export default interface LoginData {
  memberId: string;
  password: string;
}

export interface UserInfoType {
    following: number;
    followers: number;
    idx: string;
    memberId: string;
    nickName: string;
    email: string;
    profileImageUrl: string;
    blogName: string;
    blogTitleImgUrl: string;
    activeStatus: string;
    socialType: string;
    blogIntroduce: string;
  }
  
export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: {
    nickName: string;
    email: string;
    blogName: string;
    blogIntroduce: string;
    socialType: string;
  } | null;
}

export interface CustomSession {
  user: {
    name: string;
    email: string;
    image: string;
  };
  accessToken: string;
  expires: string;
}

export interface RoleResponse {
  result: {
    accessToken: string; 
    role: string;
  };
}

export interface UpdateMemberInfoRequest {
  nickName: string;
  blogName: string;
  blogIntroduce: string;
  koreanInterestedTypes: string[];
  profileImage?: { accessUri: string; authenticateId: string; imgUrl: string; } | null; // null을 허용
  blogImage?: { accessUri: string; authenticateId: string; imgUrl: string; } | null; // null을 허용
  likeAlert: boolean;
  commentAlert: boolean;
  ticketScope: "public" | "private" | "protected";
  ootdScope: "public" | "private" | "protected";
  badgeScope: "public" | "private" | "protected";
  followScope: "public" | "private" | "protected";
}
