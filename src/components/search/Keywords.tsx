import React from "react";

interface KeywordsProps {
  keywords: string[];
}

const Keywords: React.FC<KeywordsProps> = ({ keywords }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Related Keywords</h2>
      <ul className="list-disc pl-5">
        {keywords.map((keyword, index) => (
          <li key={index} className="mb-2">
            {keyword}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Keywords;
