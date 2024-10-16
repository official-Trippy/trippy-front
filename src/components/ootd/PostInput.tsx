import React, { useState, useEffect, useRef } from 'react';

interface PostInputProps {
  onPostChange: (post: string) => void;
  onTagsChange: (tags: string[]) => void;
  tags: string[];
  initialPost?: string; // 초기 post를 받을 수 있도록 추가
}

const PostInput: React.FC<PostInputProps> = ({ onPostChange, onTagsChange, tags, initialPost = '' }) => {
  const [post, setPost] = useState<string>(initialPost); 
  const [tagInput, setTagInput] = useState<string>('');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.placeholder = "특별한 OOTD를 소개하는 문구를 작성해보세요.";
    }
  }, []);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPost = event.target.value;
    setPost(newPost);
    onPostChange(event.target.value);
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleCompositionEvent = () => {
    setIsComposing(prev => !prev);
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputTag = tagInput.trim();
      if (inputTag !== '') {
        const formattedTag = `${inputTag}`;
        if (!tags.includes(formattedTag)) {
          const newTags = [...tags, formattedTag];
          onTagsChange(newTags);
        }
        setTagInput('');
      }
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    const newTags = tags.filter(tag => tag !== tagToDelete);
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-4">
      <textarea
        ref={textareaRef}
        className="w-full h-64 text-lg border py-4 px-4 rounded-[8px] resize-none placeholder:text-[#cfcfcf]" // placeholder 색상 추가
        onChange={handlePostChange}
        value={post}
        style={{ whiteSpace: 'pre-wrap' }} 
        placeholder="특별한 OOTD를 소개하는 문구를 작성해보세요."
      />
      <div className="relative w-full border py-4 px-4 rounded-[8px]">
        <input
          type="text"
          placeholder="태그를 3개 이상 입력해주세요."
          className="w-full h-12 border-none outline-none text-lg placeholder:text-[#cfcfcf]" // placeholder 색상 추가
          value={tagInput}
          onCompositionStart={handleCompositionEvent}
          onCompositionEnd={handleCompositionEvent}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
        />
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag, index) => (
            <span key={index} className="h-8 text-white pl-3 pr-2 py-1 bg-[#fa3463] rounded-2xl flex items-center">
              {tag}
              <button
                type="button"
                onClick={() => handleTagDelete(tag)}
                className="ml-2 text-white mb-[1.7px]"
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostInput;