import React, { useState } from 'react';

interface PostInputProps {
  onPostChange: (post: string) => void;
  onTagsChange: (tags: string[]) => void;
}

const PostInput: React.FC<PostInputProps> = ({ onPostChange, onTagsChange }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onPostChange(event.target.value);
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        placeholder="특별한 OOTD를 소개하는 문구를 작성해보세요. 다양한 #태그도 사용할 수 있어요."
        className="w-full h-[300px] border p-2 rounded resize-none"
        onChange={handlePostChange}
      />
      <input
        type="text"
        placeholder="태그를 입력하고 Enter 키를 누르세요."
        className="w-full border p-2 rounded"
        value={tagInput}
        onChange={handleTagInputChange}
        onKeyDown={handleTagInputKeyDown}
      />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 p-2 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PostInput;
