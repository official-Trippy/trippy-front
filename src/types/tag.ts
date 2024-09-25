export interface TagContainerProps {
    item: {
      post: {
        id: number;
        body: string;
        tags: string[];
        images: { accessUri: string }[];
        likeCount: number;
        commentCount: number;
      };
      member: {
        profileUrl: string;
        nickName: string;
      };
    };
  }
  