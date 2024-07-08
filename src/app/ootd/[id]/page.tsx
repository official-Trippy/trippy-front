import React from 'react';
import OotdDetail from '@/components/ootd/OotdDetail';
import Header from '@/components/shared/header/Header';

interface OotdDetailPageProps {
  params: { id: string };
}

const OotdDetailPage: React.FC<OotdDetailPageProps> = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <Header/>
      <OotdDetail id={Number(id)} />
    </div>
  );
};

export default OotdDetailPage;
