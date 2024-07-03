import React, { useState, ChangeEvent } from 'react';
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
      console.log(uploadedImage.result);
      setImages([...images, uploadedImage.result]);
      console.log(images);
      onImagesChange([...images, uploadedImage.result]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const displayImages = images.map(image => image.accessUri);

  return (
    <div>
      <input 
        type="file" 
        onChange={handleImageUpload} 
        style={{ display: 'none' }} 
        id="image-upload-input"
      />
      <div 
        onClick={() => document.getElementById('image-upload-input')?.click()} 
        style={{ 
          position: 'relative', 
          width: '600px', 
          height: '600px', 
          cursor: 'pointer', 
          overflow: 'hidden',
          background: displayImages.length > 0 ? 'none' : `url(${OotdDefault.src}) no-repeat center center / cover` 
        }} 
      >
        {displayImages.length === 1 && (
          <img 
            src={displayImages[0]} 
            alt="Uploaded Image" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '600px', 
              height: '600px', 
              objectFit: 'cover' 
            }} 
          />
        )}
        {displayImages.length > 1 && (
          <Carousel 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%' 
            }}
          >
            {displayImages.map((image, index) => (
              <Carousel.Item key={index}>
                <img 
                  src={image} 
                  alt={`Slide ${index}`} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    display: 'block', 
                    margin: 'auto' 
                  }} 
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
