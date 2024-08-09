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
                init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'styleselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | link image | \
                        removeformat | help | undo redo',
                }}
                onEditorChange={handleEditorChange}
            />
        </div>
    );
};

export default MyTinyMCEEditor;
