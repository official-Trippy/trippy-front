'use client';

import React, { useState, ChangeEvent } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import OotdDefault from '../../../public/OotdDefault.png';

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange }) => {
  const [images, setImages] = useState<string[]>([OotdDefault.src]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      let newImages;
      if (images[0] === OotdDefault.src) {
        newImages = [reader.result as string];
      } else {
        if (images.length >= 5) return;
        newImages = [...images, reader.result as string];
      }
      setImages(newImages);
      onImagesChange(newImages);
    };
    reader.readAsDataURL(file);
  };

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
          width: '350px', 
          height: '350px', 
          paddingBottom: '56.25%',
          cursor: 'pointer', 
          overflow: 'hidden',
          background: images.length > 1 ? 'none' : `url(${images[0]}) no-repeat center center / cover` 
        }} 
      >
        {images.length === 1 && (
          <img 
            src={images[0]} 
            alt="Upload Default" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '350px', 
              height: '350px', 
              objectFit: 'cover' 
            }} 
          />
        )}
        {images.length > 1 && (
          <Carousel 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%' 
            }}
          >
            {images.map((image, index) => (
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
