import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadImage } from '@/services/blog';

interface editorProps {
    postRequest: any;
    setPostRequest: any;
}

const inputAPI = process.env.NEXT_PUBLIC_INPUT_TEXT_API_KEY;

const TextEditorEdits = ({ postRequest, setPostRequest }: editorProps) => {
    const [contented, setContented] = useState('');

    const handleEditorChange = (newContent: string) => {
        // 이미지 태그를 인덱스로 대체
        const imgTags = newContent.match(/<img[^>]*>/g) || [];
        let index = 1;

        const cleanContent = newContent.replace(/<img[^>]*>/g, () => {
            const imgIndex = "imageData" + index++;
            return imgIndex; // 인덱스를 문자열로 반환
        });

        setContented(cleanContent);
        setPostRequest((prev: any) => ({
            ...prev,
            body: cleanContent, // 텍스트 내용 업데이트
        }));
    };

    const handleImageUpload = async (blobInfo: any) => {
        const file = blobInfo.blob(); // blobInfo에서 파일 추출

        try {
            const uploadedImage = await uploadImage(file);
            const imageUrl = uploadedImage.result; // 업로드한 이미지의 URL

            // 성공적인 업로드 후 URL을 배열에 추가
            setPostRequest((prev: any) => ({
                ...prev,
                images: [...prev.images, { accessUri: imageUrl }], // 이미지 URL 추가
            }));

            // 성공적인 업로드 후 URL을 반환
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            // failure('이미지 업로드에 실패했습니다.'); // 실패 시 에러 메시지
        }
    };

    const renderBodyWithImages = (body: string, images: { accessUri: string }[]) => {
        return body.replace(/imageData(\d+)/g, (match, index) => {
            const imgIndex = parseInt(index) - 1; // imageData1 -> 0, imageData2 -> 1 등
            const image = images[imgIndex]; // 해당 이미지 객체 가져오기
            return image ? `<img src="${image.accessUri}" alt="Uploaded Image" width="400" height="300" />` : match; // 이미지가 있으면 img 태그 반환, 없으면 원래 문자열 반환
        });
    };

    console.log(postRequest); // postRequest 확인

    return (
        <div>
            <Editor
                initialValue=""
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
                value={renderBodyWithImages(postRequest.body, postRequest.images)} // 에디터의 내용을 상태로 관리
                onEditorChange={handleEditorChange}
            // dangerouslySetInnerHTML 사용하여 HTML을 직접 삽입
            // 주의: XSS 공격 방지를 위해 신뢰할 수 있는 데이터만 사용해야 합니다.
            // outputFormat="html" // HTML 형식으로 출력
            />
        </div>
    );
};

export default TextEditorEdits;
