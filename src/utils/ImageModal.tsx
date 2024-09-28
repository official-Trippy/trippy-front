import React from 'react';
import Image from 'next/image';
import DefaultImage from '../../public/defaultImage.svg';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose} // 모달 외부 클릭 시 닫힘
    >
      <div
        className="relative w-[80vw] h-[80vw]"
        style={{
          maxWidth: '500px', // 최대 너비 500px
          maxHeight: '500px', // 최대 높이 500px
        }}
      >
        <Image
          src={imageUrl || DefaultImage}
          alt="Profile"
          className="rounded-lg"
          width={800}
          height={800}
          style={{
            width: '100%', // 부모의 너비를 기준으로 100%
            height: '100%', // 부모의 높이를 기준으로 100%
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
};

export default ImageModal;