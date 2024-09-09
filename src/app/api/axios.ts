import axios from 'axios';
import Cookies from 'js-cookie';

// Axios 설정: AccessToken 자동 갱신 로직 추가
// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // AccessToken이 만료되었고, refreshToken이 쿠키에 존재하는 경우
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // 무한 재시도를 방지하기 위해 플래그 설정

//       try {
//         // RefreshToken이 없을 때 로그아웃 처리
//         const refreshToken = Cookies.get('refreshToken');
//         if (!refreshToken) {
//           throw new Error('RefreshToken이 존재하지 않습니다. 로그아웃 처리');
//         }

//         // AccessToken 갱신 요청
//         const refreshTokenResponse = await axios.post(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/login-extension`,
//           null,
//           {
//             withCredentials: true,  // 브라우저에 저장된 refreshToken을 자동으로 전송하기 위해 필요
//           }
//         );

//         // 새로운 AccessToken 받아서 쿠키에 저장
//         const newAccessToken = refreshTokenResponse.data.result.accessToken;
//         Cookies.set('accessToken', newAccessToken);

//         // 원래 요청에 새 AccessToken 추가하여 재시도
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         return axios(originalRequest);  // 원래 요청 다시 실행
//       } catch (refreshError) {
//         // RefreshToken 갱신 실패 시, 무한 루프 방지 및 로그아웃 처리
//         console.error('AccessToken 갱신 실패: ', refreshError);

//         // 쿠키 삭제 및 로그인 페이지로 리다이렉트
//         Cookies.remove('accessToken');
//         Cookies.remove('refreshToken');
//         window.location.href = '/login';  // 로그인이 필요한 페이지로 리다이렉트
//         return Promise.reject(refreshError);
//       }
//     }

//     // 다른 에러일 경우 기본 에러 처리
//     return Promise.reject(error);
//   }
// );

export default axios;
