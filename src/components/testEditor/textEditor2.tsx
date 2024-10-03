import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadImage } from '@/services/blog';

interface editorProps {
    postRequest: any;
    setPostRequest: any;
    onImageUpload: (imageUrl: string) => void; // 이미지 업로드 핸들러를 props로 추가
}

const inputAPI = process.env.NEXT_PUBLIC_INPUT_TEXT_API_KEY;

const MyTinyMCEEditor = ({ postRequest, setPostRequest, onImageUpload }: editorProps) => {
    const [contented, setContented] = useState('')

    const handleEditorChange = (content: string) => {
        setContented((prev: any) => ({ ...prev, body: content })); // 에디터 내용 업데이트

        const imgTags = content.match(/<img[^>]*>/g) || [];
        let index = 1;

        // 이미지 태그를 인덱스로 대체
        const cleanContent = content.replace(/<img[^>]*>/g, () => {
            const imgIndex = "imageData" + index++;
            return imgIndex.toString(); // 인덱스를 문자열로 반환
        });

        setPostRequest((prev: any) => ({ ...prev, body: cleanContent })); // 에디터 내용 업데이트
    };

    const handleImageUpload = async (blobInfo: any) => {
        const file = blobInfo.blob(); // Blob 객체 가져오기
        try {
            const uploadedImage = await uploadImage(file); // 이미지 업로드 함수 호출
            const imageUrl = uploadedImage.result; // 업로드된 이미지 URL 가져오기

            // 이미지 URL을 postRequest.images에 추가
            setPostRequest((prev: any) => ({
                ...prev,
                images: [...prev.images, imageUrl], // 이미지 URL 추가
            }));

            // TinyMCE에 이미지 URL 반환
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return ''; // 실패 시 빈 문자열 반환
        }
    };

    console.log(postRequest); // postRequest 확인

    return (
        <div>
            <Editor
                initialValue="<p>여러분의 경험을 자유롭게 적어주세요.</p>"
                apiKey={inputAPI}
                init={{
                    height: 820,
                    menubar: false,
                    plugins: [
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'searchreplace',
                        'fullscreen',
                        'media',
                        'table',
                        'code',
                        'help',
                        'emoticons',
                        'codesample',
                        'quickbars',
                    ],
                    toolbar: 'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'lists table link charmap searchreplace | ' +
                        'image media codesample emoticons fullscreen preview | ' +
                        'removeformat | undo redo',
                    images_upload_handler: handleImageUpload, // 이미지 업로드 핸들러 지정
                }}
                value={contented} // 에디터의 내용을 상태로 관리
                onEditorChange={handleEditorChange}
            />
        </div>
    );
};

export default MyTinyMCEEditor;
