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