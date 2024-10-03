import ReactQuill from "react-quill";
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/getCroppedImg";
import { uploadImage } from "@/services/blog";

function Write({ onImagesChange }: { onImagesChange: (images: string[]) => void }) {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            setIsModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsUploading(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (croppedBlob) {
                const fileName = 'croppedImage.jpg';
                const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });
                const uploadedImage = await uploadImage(croppedFile);

                const newImages = [...images, uploadedImage.result];
                setImages(newImages);
                onImagesChange(newImages);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false);
            setImageSrc("");
        }
    };

    const handleImageButtonClick = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                handleImageUpload(files[0]);
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                ["image"],
                [{ header: [1, 2, 3, 4, 5, false] }],
                ["bold", "underline"],
            ],
            handlers: {
                image: handleImageButtonClick, // 핸들러를 별도로 분리
            },
        },
    };

    const handleSubmit = async () => {
        const date = new Date();
        // 여기서 createPost 함수를 사용하여 포스트를 제출할 수 있습니다.
    };

    return (
        <>
            <div style={{ width: "100%", height: "79rem", position: "relative" }}>
                <ReactQuill
                    style={{ width: "100%", height: "100%" }}
                    modules={modules}
                    value={content}
                    onChange={setContent}
                />
            </div>
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
                                    onCropComplete={handleCropComplete}
                                    onZoomChange={setZoom}
                                    objectFit="cover"
                                />
                            )}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-btn-color text-white px-4 py-2 font-medium rounded mr-2 cursor-pointer"
                                onClick={handleCropImage}
                            >
                                완료
                            </button>
                            <button
                                className="border text-[#cfcfcf] px-4 py-2 font-medium rounded cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Write;
