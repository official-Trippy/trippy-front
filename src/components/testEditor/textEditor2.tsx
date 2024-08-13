import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MyTinyMCEEditor = () => {
    const [content, setContent] = useState('');

    const handleEditorChange = (content: string) => {
        setContent(content);
    };

    return (
        <div>
            <Editor
                initialValue="<p>여러분의 경험을 자유롭게 적어주세요.</p>"
                apiKey='a7jtjjd8h1f0ofvjye2cxg0xwzsz6576rgwoj91atcc2i8pf'
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
                    toolbar:

                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'lists table link charmap searchreplace | ' +
                        'image media codesample emoticons fullscreen preview | ' +
                        'removeformat | undo redo' +
                        '',
                    // setup(editor) {
                    //     setTinymceEditor(editor); // activeEditor를 전역적으로 관리

                    //     // 이미지를 업로드하는 버튼 추가
                    //     editor.ui.registry.addButton('image-upload', {
                    //       icon: 'image',
                    //       tooltip: '업로드',
                    //       onAction: () => {
                    //         editor.execCommand('image-upload');
                    //       },
                    //     });

                    //     editor.addCommand('image-upload', onOpenFile); // onOpenFile 함수 실행
                    //   },
                }}
                onEditorChange={handleEditorChange}
            />
        </div>
    );
};

export default MyTinyMCEEditor;
