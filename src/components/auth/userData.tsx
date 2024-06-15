// "use client";

// import axios from 'axios';
// import { useSession } from 'next-auth/react';

// // 사용자 정보를 백엔드로 전송하는 함수
// const sendUserInfoToBackend = async (nickname, profile) => {
//   try {
//     // 백엔드로 보낼 사용자 정보 객체
//     const userInfo = {
//       nickname: nickname,
//       profile: profile
//     };

//     // axios를 사용하여 POST 요청을 보냄
//     const response = await axios.post('백엔드주소/endpoint', userInfo);

//     // 요청이 성공하면
//     if (response.status === 200) {
//       console.log('사용자 정보 전송 성공');
//     } else {
//       console.error('사용자 정보 전송 실패');
//     }
//   } catch (error) {
//     console.error('요청 실패:', error);
//   }
// };

// const MyComponent = () => {
//   const { data: session } = useSession();

//   // 세션에서 사용자의 닉네임과 프로필을 가져옴
//   const { nickname, profile } = session?.user ?? {};

//   // 닉네임과 프로필이 존재하는 경우에만 백엔드로 전송
//   if (nickname && profile) {
//     sendUserInfoToBackend(nickname, profile);
//   }

//   return (
//     // 컴포넌트의 내용
//   );
// };

// export default MyComponent;
