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
      const newImages = [...images, uploadedImage.result];
      setImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
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
        onClick={() => displayImages.length === 0 && document.getElementById('image-upload-input')?.click()}
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
      <div className="flex mt-4">
        {images.map((image, index) => (
          <div key={index} className="relative mr-2">
            <img
              src={image.accessUri}
              alt={`Uploaded Image ${index}`}
              className="w-24 h-24 object-cover"
            />
            <button
              onClick={() => handleDeleteImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              X
            </button>
          </div>
        ))}
        {images.length > 0 && images.length < 5 && (
          <div
            onClick={() => document.getElementById('image-upload-input')?.click()}
            className="w-24 h-24 flex justify-center items-center border border-dashed border-gray-400 cursor-pointer"
          >
            +
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
