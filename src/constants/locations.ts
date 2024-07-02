export const SEOUL = { value: 'Seoul', label: '서울', latitude: 37.5665, longitude: 126.9780 };
export const BUSAN = { value: 'Busan', label: '부산', latitude: 35.1796, longitude: 129.0756 };
export const INCHEON = { value: 'Incheon', label: '인천', latitude: 37.4563, longitude: 126.7052 };
export const DAEGU = { value: 'Daegu', label: '대구', latitude: 35.8156, longitude: 128.5327 };
export const GWANGJU = { value: 'Gwangju', label: '광주', latitude: 35.1595, longitude: 126.8526 };
export const DAEJEON = { value: 'Daejeon', label: '대전', latitude: 36.3504, longitude: 127.3845 };
export const ULSAN = { value: 'Ulsan', label: '울산', latitude: 35.5384, longitude: 129.3114 };
export const SEJONG = { value: 'Sejong', label: '세종', latitude: 36.4800, longitude: 127.2890 };
export const GYEONGGI = { value: 'Gyeonggi', label: '경기도', latitude: 37.4138, longitude: 127.5183 };
export const GANGWON = { value: 'Gangwon', label: '강원도', latitude: 37.8228, longitude: 128.1555 };
export const CHUNGBUK = { value: 'Chungbuk', label: '충청북도', latitude: 36.6354, longitude: 127.4914 };
export const CHUNGNAM = { value: 'Chungnam', label: '충청남도', latitude: 36.5184, longitude: 126.8008 };
export const JEONBUK = { value: 'Jeonbuk', label: '전라북도', latitude: 35.7175, longitude: 127.1530 };
export const JEONNAM = { value: 'Jeonnam', label: '전라남도', latitude: 34.8679, longitude: 126.9910 };
export const GYEONGBUK = { value: 'Gyeongbuk', label: '경상북도', latitude: 36.5760, longitude: 128.5056 };
export const GYEONGNAM = { value: 'Gyeongnam', label: '경상남도', latitude: 35.2598, longitude: 128.6647 };
export const JEJU = { value: 'Jeju', label: '제주도', latitude: 33.4996, longitude: 126.5312 };

export const LOCATIONS = {
  Seoul: SEOUL,
  Busan: BUSAN,
  Incheon: INCHEON,
  Daegu: DAEGU,
  Gwangju: GWANGJU,
  Daejeon: DAEJEON,
  Ulsan: ULSAN,
  Sejong: SEJONG,
  Gyeonggi: GYEONGGI,
  Gangwon: GANGWON,
  Chungbuk: CHUNGBUK,
  Chungnam: CHUNGNAM,
  Jeonbuk: JEONBUK,
  Jeonnam: JEONNAM,
  Gyeongbuk: GYEONGBUK,
  Gyeongnam: GYEONGNAM,
  Jeju: JEJU
};

export type LocationKey = keyof typeof LOCATIONS;
