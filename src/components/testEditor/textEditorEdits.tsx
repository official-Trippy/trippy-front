import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadImage } from '@/services/blog';

interface editorProps {
    postRequest: any;
    setPostRequest: any;
}

const inputAPI = process.env.INPUT_TEXT_API_KEY;

const TextEditorEdits = ({ postRequest, setPostRequest }: editorProps) => {


    const handleEditorChange = (newContent: string) => {
        setPostRequest((prev: any) => ({
            ...prev,
            body: newContent, // 텍스트 내용 업데이트
        }));
    };

    const handleImageUpload = async (blobInfo: any, success: (url: string) => void, failure: (message: string) => void) => {
        const file = blobInfo.blob(); // blobInfo에서 파일 추출

        try {
            const uploadedImage = await uploadImage(file);
            const imageUrl = uploadedImage.result; // 업로드한 이미지의 URL

            // 성공적인 업로드 후 URL을 배열에 추가
            setPostRequest((prev: any) => ({
                ...prev,
                images: [...prev.images, imageUrl], // 이미지 URL 추가
            }));

            // 성공적인 업로드 후 URL을 반환
            success(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            failure('이미지 업로드에 실패했습니다.'); // 실패 시 에러 메시지
        }
    };

    console.log(postRequest); // postRequest 확인

    return (
        <div>
            <Editor
                initialValue="<p>여러분의 경험을 자유롭게 적어주세요.</p>"
                apiKey="a7jtjjd8h1f0ofvjye2cxg0xwzsz6576rgwoj91atcc2i8pf"
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
                    Images_upload_handler: handleImageUpload, // 이미지 업로드 핸들러 지정
                }}
                value={postRequest.body} // 에디터의 내용을 상태로 관리
                onEditorChange={handleEditorChange}
            />
        </div>
    );
};

export default TextEditorEdits;
