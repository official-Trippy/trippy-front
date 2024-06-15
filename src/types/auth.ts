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
