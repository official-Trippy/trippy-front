import React from 'react';
import useUserInfo from '@/hooks/useUserInfo';
import useUserEmail from '@/hooks/useUserEmail';

const UserModal = () => {
  const { userInfo } = useUserInfo();
  const { email } = useUserEmail();

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>유저 정보</h2>
        <div>
          <p>닉네임: {userInfo.nickName}</p>
          <p>이메일: {email}</p>
          <hr />
          <p>블로그 이름: {userInfo.blogName}</p>
          <p>블로그 소개: {userInfo.blogIntroduce}</p>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
