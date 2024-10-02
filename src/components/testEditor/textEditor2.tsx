import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { uploadImage } from '@/services/blog';

interface EditorProps {
    postRequest: any;
    setPostRequest: any;
    onImageUpload: (imageUrl: string) => void;
}

const inputAPI = process.env.NEXT_PUBLIC_INPUT_TEXT_API_KEY;

const MyTinyMCEEditor: React.FC<EditorProps> = ({ postRequest, setPostRequest, onImageUpload }) => {
    const editorRef = useRef<any>(null);

    const handleEditorChange = (content: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const images: { accessUri: string }[] = [];

        const imgTags = doc.getElementsByTagName('img');
        for (let i = 0; i < imgTags.length; i++) {
            const imgSrc = imgTags[i].getAttribute('src');
            if (imgSrc) {
                images.push({ accessUri: imgSrc });
            }
        }

        const cleanBody = doc.body.innerHTML.replace(/<img[^>]*>/g, '');

        setPostRequest((prev: any) => {
            const updatedImages = images.filter((newImage) =>
                !prev.images.some((img: any) => img.accessUri === newImage.accessUri)
            );

            // 상태가 실제로 변경되는 경우에만 업데이트
            if (cleanBody !== prev.body || updatedImages.length > 0) {
                return {
                    ...prev,
                    body: cleanBody,
                    images: [...prev.images, ...updatedImages],
                };
            }

            // 상태가 변경되지 않으면 이전 상태 반환
            return prev;
        });
    };




    const handleImageUpload = async (blobInfo: any) => {
        const file = blobInfo.blob();
        try {
            const uploadedImage = await uploadImage(file);
            const imageUrl = uploadedImage.result.accessUri;

            if (typeof imageUrl !== 'string') {
                throw new Error('Uploaded image URL is not a string');
            }

            onImageUpload(imageUrl);

            if (editorRef.current) {
                editorRef.current.insertContent(`<img src="${imageUrl}" />`);
                handleEditorChange(editorRef.current.getContent()); // 내용 업데이트 호출
            }

            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return '';
        }
    };

    const imagesHtml = postRequest.images
        .map((image: any) => `<img src="${image.accessUri}" />`)
        .join('');

    return (
        <div>
            <TinyMCEEditor
                onInit={(evt, editor) => (editorRef.current = editor)}
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
                    images_upload_handler: handleImageUpload,
                }}
                value={postRequest.body + imagesHtml}
                onEditorChange={handleEditorChange}
            />
        </div>
    );
};

export default MyTinyMCEEditor;
