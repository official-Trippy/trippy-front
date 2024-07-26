import React, { ChangeEvent, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import OotdDefault from '../../../public/ootdDefaultImg.svg';
import OotdAddImage from '../../../public/ootdImageAdd.svg';
import OOtdDeleteImage from '../../../public/ootdImageDelete.svg';
import { uploadImage } from '@/services/blog';
import { UploadedImage } from '@/types/ootd';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface ImageUploaderProps {
  onImagesChange: (images: UploadedImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadedImage = await uploadImage(file);
      const newImages = [...images, uploadedImage.result];
      setImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newImages = Array.from(images);
    const [reorderedImage] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedImage);

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
        {!isUploading && displayImages.length === 0 && (
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src={OotdDefault.src}
              alt="Default Image"
              className="object-cover"
              width={400}
              height={400}
            />
          </div>
        )}
        {displayImages.length === 1 && (
          <Image
            src={displayImages[0]}
            alt="Uploaded Image"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            width={400}
            height={400}
          />
        )}
        {displayImages.length > 1 && (
          <Carousel className="absolute inset-0">
            {displayImages.map((image, index) => (
              <Carousel.Item key={index}>
                <Image
                  src={image}
                  alt={`Slide ${index}`}
                  className="d-block w-100 h-100 object-cover rounded-lg"
                  width={400}
                  height={400}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-images" direction="horizontal">
          {(provided) => (
            <div
              className={`flex w-[400px] mt-4 p-[10px] ${
                displayImages.length === 0 ? '' : 'rounded-lg border border-[#cfcfcf]'
              }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {images.map((image, index) => (
                <Draggable key={image.accessUri} draggableId={image.accessUri} index={index}>
                  {(provided) => (
                    <div
                      className={`relative ${index === images.length - 1 ? '' : 'mr-[5px]'}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Image
                        src={image.accessUri}
                        alt={`Uploaded Image ${index}`}
                        className="object-cover rounded-lg"
                        width={72}
                        height={72}
                      />
                      <Image
                        src={OOtdDeleteImage.src}
                        alt="Delete Image"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 rounded-full w-[20px] h-[20px] cursor-pointer"
                        width={10}
                        height={10}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {images.length > 0 && images.length < 5 && (
                <div
                  onClick={() => document.getElementById('image-upload-input')?.click()}
                  className="w-[72px] h-[72px] ml-[5px] flex justify-center items-center cursor-pointer"
                >
                  <Image
                    src={OotdAddImage.src}
                    alt="Add Image"
                    width={72}
                    height={72}
                  />
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageUploader;
