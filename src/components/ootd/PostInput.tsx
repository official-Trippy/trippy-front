import React, { useState, useEffect, useRef } from 'react';

interface PostInputProps {
  onPostChange: (post: string) => void;
  onTagsChange: (tags: string[]) => void;
}

const PostInput: React.FC<PostInputProps> = ({ onPostChange, onTagsChange }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.placeholder = "특별한 OOTD를 소개하는 문구를 작성해보세요.\n다양한 #태그도 사용할 수 있어요.";
    }
  }, []);

  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        const formattedTag = `#${inputTag}`;
        if (!tags.includes(formattedTag)) {
          const newTags = [...tags, formattedTag];
          setTags(newTags);
          onTagsChange(newTags);
        }
        setTagInput('');
      }
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        className="w-full h-[500px] text-2xl border p-2 rounded resize-none"
        onChange={handlePostChange}
      />
      <div className="relative w-full text-2xl border p-2 rounded">
        <input
          type="text"
          placeholder="태그를 3개 이상 입력해주세요."
          className="w-full h-[50px] border-none outline-none text-2xl"
          value={tagInput}
          onCompositionStart={handleCompositionEvent}
          onCompositionEnd={handleCompositionEvent}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="h-[30px] text-neutral-400 px-3 py-1 bg-neutral-100 rounded-2xl justify-center items-center gap-2.5 inline-flex">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostInput;
