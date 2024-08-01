export interface INewNotice {
  id: string;
  message: string;
  type: string;
  user: {
    id: string;
    nickname: string;
    avatarUrl: string;
  };
}

export interface IEmergency {
  id: string;
  message: string;
}

export interface INoticeAdmin {
  id: string;
  message: string;
  user: {
    id: string;
    nickname: string;
    avatarUrl: string;
  };
}
