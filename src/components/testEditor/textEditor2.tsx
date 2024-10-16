import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uploadImage } from "@/services/blog";

interface editorProps {
  postRequest: any;
  setPostRequest: any;
}

const inputAPI = process.env.NEXT_PUBLIC_INPUT_TEXT_API_KEY;

const MyTinyMCEEditor = ({ postRequest, setPostRequest }: editorProps) => {
  const [editorInstance, setEditorInstance] = useState<any>(null); // 에디터 인스턴스 상태 추가
  // console.log(postRequest)
  const handleEditorChange = (content: string) => {
    // 에디터 내용 업데이트
    setPostRequest((prev: any) => ({ ...prev, body: content }));
  };

  const handleImageUpload = async (blobInfo: any) => {
    const file = blobInfo.blob(); // Blob 객체 가져오기
    try {
      const uploadedImage = await uploadImage(file); // 이미지 업로드 함수 호출
      const imageUrl = uploadedImage.result; // 업로드된 이미지 URL 가져오기

      // 이미지 URL을 postRequest.images에 객체 형태로 추가
      setPostRequest((prev: any) => ({
        ...prev,
        body: prev.body + `<img src="${imageUrl.accessUri}" alt="Uploaded Image" width="400" height="300" />`, // 문자열로 추가
        images: [...prev.images, imageUrl], // 객체 형태로 추가
      }));

      // TinyMCE에 이미지 URL 반환
      return imageUrl.accessUri; // 올바른 URL 반환
    } catch (error) {
      console.error("Error uploading image:", error);
      return ""; // 실패 시 빈 문자열 반환
    }
  };

  const handleSaveEditorContent = () => {
    if (editorInstance) {
      const content = editorInstance.getContent(); // 에디터 내용 가져오기
      handleEditorChange(content); // 내용 업데이트
    }
  };

  return (
    <div>
      <Editor
        onInit={(evt, editor) => setEditorInstance(editor)} // 에디터 인스턴스 설정
        initialValue="<p>여러분의 경험을 자유롭게 적어주세요.</p>"
        apiKey={inputAPI}
        init={{
          height: 820,
          menubar: false,
          plugins: [
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "searchreplace",
            "fullscreen",
            "media",
            "table",
            "code",
            "help",
            "emoticons",
            "codesample",
            "quickbars",
          ],
          toolbar:
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "lists table link charmap searchreplace | " +
            "image media codesample emoticons fullscreen preview | " +
            "removeformat | undo redo",
          images_upload_handler: handleImageUpload, // 이미지 업로드 핸들러 지정
        }}
        value={postRequest.body} // 에디터의 내용을 상태로 관리
        onEditorChange={handleEditorChange} // 텍스트 입력 시 내용 업데이트
        onBlur={handleSaveEditorContent} // 포커스 아웃 시 내용 저장
      />
    </div>
  );
};

export default MyTinyMCEEditor;
