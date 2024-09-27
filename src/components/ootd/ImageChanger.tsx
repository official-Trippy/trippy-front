import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/utils/getCroppedImg';

interface ImageChangerProps {
  onImagesChange: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
}

const ImageChanger: React.FC<ImageChangerProps> = ({ onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null); // 크롭할 이미지 소스
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  // 모달을 열고 닫는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    setIsCropping(true); // 크롭 시작
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsModalOpen(true); // 크롭 모달을 엽니다
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      if (croppedBlob) {
        const fileName = 'croppedImage.jpg'; // 파일 이름 지정
        const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });
        const uploadedImage = await uploadImage(croppedFile); // File 형식으로 업로드
        const newImages = [...images, uploadedImage.result];
        setImages(newImages);
        onImagesChange(newImages);
        setIsModalOpen(false); // 모달을 닫습니다
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      setIsCropping(false);
      setImageSrc(null);
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
          style={{
            ...style,
            display: 'block',
            position: 'absolute',
            right: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
          }}
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
          style={{
            ...style,
            display: 'block',
            position: 'absolute',
            left: '3px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
          }}
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
        {/* 크롭 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white py-4 px-8 rounded-lg shadow-lg">
              <h3 className="mb-4 text-center">이미지 영역 선택</h3>
              <div className="relative w-[300px] h-[300px] bg-gray-200">
                {imageSrc && (
                 <Cropper
                   image={imageSrc}
                   crop={crop}
                   zoom={zoom}
                   aspect={1}
                   onCropChange={setCrop}
                   onCropComplete={onCropComplete}
                   onZoomChange={setZoom}
                   objectFit="cover"
                 />
                )}
              </div>
              <div className="flex justify-end mt-4">
                <div className="bg-btn-color text-white px-4 py-2 font-medium font-['Pretendard'] rounded mr-2 cursor-pointer" onClick={handleCropImage}>
                  완료
                </div>
                <div className="border border-[#cfcfcf] text-[#cfcfcf] px-4 py-2 font-medium font-['Pretendard'] rounded cursor-pointer" onClick={() => setIsModalOpen(false)}>
                  취소
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 기존 이미지 영역은 모달이 열려도 그대로 유지 */}
        <div
          onClick={() => displayImages.length === 0 && document.getElementById('image-change-input')?.click()}
          className={`relative cursor-pointer overflow-hidden bg-cover bg-center mx-auto ${
            isModalOpen ? 'opacity-50' : ''
          }`}
          style={{
            backgroundImage: displayImages.length > 0 ? 'none' : `url(${OotdDefault.src})`,
            maxWidth: '460px',
            aspectRatio: '1 / 1',
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
                  maxWidth: '460px',
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
                          width: '18%',
                          paddingBottom: '18%', 
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
                {images.length > 0 && images.length < 5 && (
                  <div
                    onClick={() => document.getElementById('image-change-input')?.click()}
                    className="flex justify-center items-center cursor-pointer ml-[2%]"
                    style={{
                      width: '18%',
                      paddingBottom: '18%',
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