export interface ImageList {
    galTitle: string;
    galWebImageUrl: string;
  }
  
export interface RecommendedSpot {
    title: string;
    hubTatsNm: string;
    imgList: ImageList[] | null;
    content: string;
    imgCnt: number;
  }
  
export interface RecommendedSpotsResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: RecommendedSpot[];
  }