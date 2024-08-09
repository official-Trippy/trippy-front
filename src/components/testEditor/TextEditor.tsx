import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Quill의 CSS 파일
import Quill from 'quill'; // Quill 타입 가져오기

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Editor = () => {
    const [content, setContent] = useState('');

    const handleImageUpload = (file: File) => {
        const uploadUrl = URL.createObjectURL(file);
        const quillElement = document.querySelector('.quill') as HTMLDivElement; // HTMLDivElement로 타입 단언
        const quill = (quillElement && (quillElement as any).quill) as Quill; // any로 타입 단언 후 Quill 타입으로 변환

        if (quill) { // quill이 null이 아닐 때만 실행
            const range = quill.getSelection();
            if (range) {
                quill.insertEmbed(range.index, 'image', uploadUrl);
            }
        }
    };

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement; // Event를 HTMLInputElement로 변환
        const file = target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image'], // 이미지 버튼 추가
                ['clean'] // 서식 초기화 버튼
            ],
            handlers: {
                'image': () => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.onchange = handleFileChange; // 일반 이벤트 핸들러로 설정
                    input.click();
                }
            }
        }
    };

    return (
        <ReactQuill
            className='h-full text-[2rem]'
            value={content}
            onChange={setContent}
            placeholder="여러분의 경험을 자유롭게 적어주세요."
            modules={modules} // 모듈 설정 추가
        />
    );
};

export default Editor;
