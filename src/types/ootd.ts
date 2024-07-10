export interface Image {
    imgUrl: string;
    accessUri: string;
    authenticateId: string;
  };
  
export interface PostRequest {
    title: string;
    body: string;
    postType: string;
    location: string;
    images: Image[];
    tags: string[];
  };
  
  export interface OotdRequest {
    area: string;
    weatherStatus: string;
    weatherTemp: string;
    detailLocation: string;
    date: string;
  };

  
  export interface PostResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
      ootd: OotdRequest;
      post: {
        id: number;
        email: string;
        title: string;
        body: string;
        postType: string;
        location: string;
        images: Image[];
        tags: string[];
        likeCount: number;
      };
    };
  };

  export interface WeatherResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
      area: string;
      avgTemp: string;
      maxTemp: string;
      minTemp: string;
      status: string;
    };
  };


  export interface UploadedImage {
    imgUrl: string;
    accessUri: string;
    authenticateId: string;
  };

  export interface OotdGetResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
      map(arg0: (item: any) => import("react").JSX.Element): import("react").ReactNode;
      member: {
        memberId: string;
        nickName: string;
        profileUrl: string;
        blogName: string;
      };
        ootd: {
          id: number;
          area: string;
          weatherStatus: string;
          weatherTemp: string;
          detailLocation?: string | null;
          date: string;
        };
        post: {
          id: number;
          createDateTime: string;
          nickName: string;
          memberId: string;
          title: string;
          body: string;
          postType: string;
          location: string | null;
          images: {
            imgUrl: string;
            accessUri: string;
            authenticateId: string;
          }[];
          tags: string[];
          likeCount: number;
          commentCount: number;
        };
        isSuccess: boolean;
      }[];
  }

  export interface OotdDetailGetResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
      member: {
        memberId: string;
        nickName: string;
        profileUrl: string;
        blogName: string;
      };
      ootd: {
        id: number;
        area: string;
        weatherStatus: string;
        weatherTemp: string;
        detailLocation?: string | null;
        date: string;
      };
      post: {
        id: number;
        createDateTime: string;
        nickName: string;
        memberId: string;
        title: string;
        body: string;
        postType: string;
        location: string | null;
        images: {
          imgUrl: string;
          accessUri: string;
          authenticateId: string;
        }[];
        tags: string[];
        likeCount: number;
        commentCount: number;
      };
    };
  };
  
  export interface Comment {
    id: number;
    parentId: number;
    memberId: string;
    profileImageUrl: string;
    content: string;
    status: string;
    depth: number;
    createDateTime: string;
    children: Comment[];
  };
