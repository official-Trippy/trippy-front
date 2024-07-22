import React, { ChangeEvent, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import OotdDefault from '../../../public/OotdDefault.png';
import { uploadImage } from '@/services/blog';
import { UploadedImage } from '@/types/ootd';

interface ImageUploaderProps {
  onImagesChange: (images: UploadedImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedImage = await uploadImage(file);
      setImages([...images, uploadedImage.result]);
      onImagesChange([...images, uploadedImage.result]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const displayImages = images.map(image => image.accessUri);

  return (
    <div className="relative mx-auto">
      <input
        type="file"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="image-upload-input"
      />
      <div
        onClick={() => document.getElementById('image-upload-input')?.click()}
        className="relative cursor-pointer overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: displayImages.length > 0 ? 'none' : `url(${OotdDefault.src})`,
          width: '400px',
          height: '400px',
        }}
      >
        {displayImages.length === 1 && (
          <img
            src={displayImages[0]}
            alt="Uploaded Image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {displayImages.length > 1 && (
          <Carousel className="absolute inset-0">
            {displayImages.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="d-block w-100 h-100 object-cover"
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
