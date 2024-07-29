import Header from "@/components/shared/header/Header";
import dynamic from 'next/dynamic';

const PostOotd = dynamic(() => import('@/components/ootd/PostOotd'), { ssr: false });

const WritePage = () => {

  return (
    <div>
      <Header />
      <PostOotd />
    </div>
  );
};

export default WritePage;