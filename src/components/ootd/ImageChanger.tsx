import React, { ChangeEvent, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import OotdDefault from '../../../public/ootdDefaultImg.svg';
import OotdAddImage from '../../../public/ootdImageAdd.svg';
import OOtdDeleteImage from '../../../public/ootdImageDelete.svg';
import { uploadImage } from '@/services/blog';
import { UploadedImage } from '@/types/ootd';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import LeftArrowIcon from '../../../public/left-arrow.svg'; 
import RightArrowIcon from '../../../public/right-arrow.svg'; 

interface ImageChangerProps {
  onImagesChange: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
}

const ImageChanger: React.FC<ImageChangerProps> = ({ onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  console.log(initialImages);

  // Update images when initialImages change, but only on initial load
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  // Notify parent component when images change
  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

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

  const SampleNextArrow = (props: any) => {
    const { className, style, onClick, currentSlide, slideCount } = props;
    return (
      currentSlide !== slideCount - 1 && (
        <div
          className={`${className} custom-arrow`}
          style={{ ...style, display: 'block', right: '10px', zIndex: 1000 }}
          onClick={onClick}
        >
          <Image src={RightArrowIcon} alt="Next" width={24} height={24} />
        </div>
      )
    );
  };

  const SamplePrevArrow = (props: any) => {
    const { className, style, onClick, currentSlide } = props;
    return (
      currentSlide !== 0 && (
        <div
          className={`${className} custom-arrow`}
          style={{ ...style, display: 'block', left: '10px', zIndex: 1000 }}
          onClick={onClick}
        >
          <Image src={LeftArrowIcon} alt="Previous" width={24} height={24} />
        </div>
      )
    );
  };

  const settings = {
    dots: true,
    infinite: displayImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: displayImages.length > 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className=''>
      <div className="relative mx-auto">
        <input
          type="file"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-change-input"
        />
        <div
          onClick={() => displayImages.length === 0 && document.getElementById('image-change-input')?.click()}
          className="relative cursor-pointer overflow-hidden bg-cover bg-center mx-auto"
          style={{
            backgroundImage: displayImages.length > 0 ? 'none' : `url(${OotdDefault.src})`,
            maxWidth: '460px',
            aspectRatio: '1 / 1', // 1:1 비율 유지
          }}
        >
          {!isUploading && displayImages.length === 0 && (
            <div className="flex items-center justify-center w-full h-full">
               <img
                src={OotdDefault.src}
                alt="Default Image"
                className="object-cover w-full h-full"  
              />
            </div>
          )}
          {displayImages.length === 1 && (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={displayImages[0]}
                alt="Uploaded Image"
                className="w-full h-full object-cover rounded-lg"
                width={400}
                height={400}
              />
            </div>
          )}
          {displayImages.length > 1 && (
            <Slider {...settings}>
              {displayImages.map((image, index) => (
                <div key={index}>
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`Slide ${index}`}
                      className="d-block w-full h-full object-cover rounded-lg"
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-images" direction="horizontal">
            {(provided) => (
                <div
                className={`flex w-full mx-auto mt-4 p-[2%] ${
                  displayImages.length === 0 ? '' : 'rounded-lg border border-[#cfcfcf]'
                }`}
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  maxWidth: '460px', // 부모 컨테이너 최대 너비
                }}
              >
                {images.map((image, index) => (
                  <Draggable key={image.accessUri} draggableId={image.accessUri} index={index}>
                    {(provided) => (
                      <div
                        className={`relative ${index === images.length - 1 ? '' : 'mr-[2%]'}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          width: '18%', // 사진 하나의 크기를 컨테이너의 너비 대비 18%로 설정 (최대 5개가 배치됨)
                          paddingBottom: '18%', // 가로세로 비율 1:1 유지
                          position: 'relative',
                        }}
                      >
                       <img
                          src={image.accessUri}
                          alt={`Uploaded Image ${index}`}
                          className="object-cover rounded-lg"
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                          }}
                        />
                        <div
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-0 right-0 rounded-full cursor-pointer"
                        >
                           <img
                            src={OOtdDeleteImage.src}
                            alt="Delete Image"
                            style={{
                              width: '20px',
                              height: '20px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {images.length > 0 && (
                   <div
                      onClick={() => document.getElementById('image-change-input')?.click()}
                      className="flex justify-center items-center cursor-pointer ml-[2%]"
                      style={{
                        width: '18%', // 새로운 이미지 추가 버튼도 같은 크기
                        paddingBottom: '18%', // 가로세로 비율 1:1
                        position: 'relative',
                      }}
                    >
                    <img
                      src={OotdAddImage.src}
                      alt="Add Image"
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ImageChanger;
