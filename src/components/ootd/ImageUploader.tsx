import React, { ChangeEvent, useCallback, useState } from 'react';
import Slider from 'react-slick';
import Cropper from 'react-easy-crop';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import OotdDefault from '../../../public/OotdPostAddImg.svg';
import OotdAddImage from '../../../public/ootdImageAdd.svg';
import OOtdDeleteImage from '../../../public/ootdImageDelete.svg';
import { uploadImage } from '@/services/blog';
import { UploadedImage } from '@/types/ootd';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import LeftArrowIcon from '../../../public/left-arrow.svg';
import RightArrowIcon from '../../../public/right-arrow.svg';
import { getCroppedImg } from '@/utils/getCroppedImg';
import { Area } from 'react-easy-crop';

interface ImageUploaderProps {
  onImagesChange: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null); // 크롭할 이미지 소스
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  // 모달을 열고 닫는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCropping(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsModalOpen(true); // 모달을 엽니다
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
        const fileName = 'croppedImage.jpg'; // 파일 이름을 지정해 줍니다.
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
            position: 'absolute', // 부모 요소 기준으로 절대 배치
            right: '5px',
            top: '50%', // 세로 중앙에 배치
            transform: 'translateY(-50%)', // 세로 중앙 정렬
            zIndex: 10, // 모달과 겹치지 않도록 z-index 조정
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
            position: 'absolute', // 부모 요소 기준으로 절대 배치
            left: '3px',
            top: '50%', // 세로 중앙에 배치
            transform: 'translateY(-50%)', // 세로 중앙 정렬
            zIndex: 10, // 모달과 겹치지 않도록 z-index 조정
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
          id="image-upload-input"
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
                    aspect={1} // 1:1 비율 유지
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    objectFit="cover" // 이미지 여백을 없애고, 화면에 맞춤
                  />
                )}
              </div>
              <div className="flex justify-end mt-4">
                <div className="bg-btn-color text-white px-4 py-2 font-medium font-['Pretendard'] rounded mr-2 cursor-pointer" onClick={handleCropImage}>
                  완료
                </div>
                <div className="border  text-[#cfcfcf] px-4 py-2 font-medium font-['Pretendard'] rounded cursor-pointer" onClick={() => setIsModalOpen(false)}>
                  취소
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 기존 이미지 영역은 모달이 열려도 그대로 유지 */}
        <div
          onClick={() => displayImages.length === 0 && document.getElementById('image-upload-input')?.click()}
          className={`relative cursor-pointer overflow-hidden bg-cover bg-center mx-auto ${displayImages.length > 0 ? '' : 'border' // 이미지가 없을 때만 border를 적용
            } rounded-[8px] ${isModalOpen ? 'opacity-50' : '' // 모달이 열릴 때 투명도 조정
            }`}
          style={{
            backgroundImage: displayImages.length > 0 ? 'none' : `url(${OotdDefault.src})`,
            maxWidth: '460px',
            aspectRatio: '1 / 1', // 1:1 비율 유지
          }}
        >
          {!isUploading && displayImages.length === 0 && (
            <div className="flex items-center justify-center w-full h-full ">
              <img
                src={OotdDefault.src}
                alt="Default Image"
                className="object-cover w-full h-full "
              />
            </div>
          )}
          {displayImages.length === 1 && (
            <div className="absolute inset-0 w-full h-full ">
              <Image
                src={displayImages[0]}
                alt="Uploaded Image"
                className="object-cover w-full h-full rounded-[8px]"
                width={200}
                height={200}
              />
            </div>
          )}
          {displayImages.length > 1 && (
            <Slider {...settings}>
              {displayImages.map((image, index) => (
                <div key={index}>
                  <div className="relative w-full h-full rounded-[8px]">
                    <Image
                      src={image}
                      alt={`Slide ${index}`}
                      className="w-full h-auto object-cover rounded-[8px]"
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
                className={`flex w-full mx-auto mt-4 p-[2%] ${displayImages.length === 0 ? '' : 'rounded-[8px] border'
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
                {images.length > 0 && images.length < 5 && (
                  <div
                    onClick={() => document.getElementById('image-upload-input')?.click()}
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

export default ImageUploader;