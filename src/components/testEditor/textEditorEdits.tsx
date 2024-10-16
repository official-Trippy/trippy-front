import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadImage } from '@/services/blog';

interface editorProps {
    postRequest: any;
    setPostRequest: any;
}

const inputAPI = process.env.NEXT_PUBLIC_INPUT_TEXT_API_KEY;

const TextEditorEdits = ({ postRequest, setPostRequest }: editorProps) => {
    const [editorInstance, setEditorInstance] = useState<any>(null);
    console.log(postRequest)
    const handleEditorChange = (newContent: string) => {
        setPostRequest((prev: any) => ({
            ...prev,
            body: newContent,
        }));
    };

    const handleImageUpload = async (blobInfo: any) => {
        const file = blobInfo.blob();

        try {
            const uploadedImage = await uploadImage(file);
            const imageUrl = uploadedImage.result; // 올바른 URL을 가져옴

            // 이미지 URL을 postRequest.images에 추가
            setPostRequest((prev: any) => ({
                ...prev,
                images: [...prev.images, imageUrl], // 객체 형태로 추가
            }));

            // TinyMCE에 이미지 URL 반환
            return imageUrl.accessUri; // 올바른 URL 반환
        } catch (error) {
            console.error('Error uploading image:', error);
            return ''; // 실패 시 빈 문자열 반환
        }
    };

    const renderBodyWithImages = (body: string, images: { accessUri: string }[]) => {
        return body.replace(/<img src="([^"]+)"/g, (match, src) => {
            const image = images.find(img => img.accessUri === src); // 이미지 객체 찾기
            return image ? match.replace(src, image.accessUri) : match; // URL이 있으면 교체
        });
    };

    const handleSaveEditorContent = () => {
        if (editorInstance) {
            const content = editorInstance.getContent(); // 에디터 내용 가져오기
            setPostRequest((prev: any) => ({
                ...prev,
                body: content, // 내용 업데이트
            }));
        }
    };

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
                    images_upload_handler: handleImageUpload,
                }}
                value={renderBodyWithImages(postRequest.body, postRequest.images)}
                onEditorChange={handleEditorChange}
            />
        </div>
    );
};

export default TextEditorEdits;
