export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };


  export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  export const formatTimetoDays = (dateString: string) => {
    const commentDate = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - commentDate.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    // 1분에서 59분까지는 분 단위로 표시
    if (diffInMinutes < 1) {
      return "방금 전";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }
    // 1시간에서 23시간까지는 시간 단위로 표시
    else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }
    // 1일에서 2일, 3일 전까지는 일 단위로 표시
    else if (diffInDays < 3) {
      return `${diffInDays}일 전`;
    }
    // 3일을 넘으면 기존 형식으로 날짜와 시간 표시
    else {
      const year = commentDate.getFullYear();
      const month = String(commentDate.getMonth() + 1).padStart(2, '0');
      const day = String(commentDate.getDate()).padStart(2, '0');
      const hours = String(commentDate.getHours()).padStart(2, '0');
      const minutes = String(commentDate.getMinutes()).padStart(2, '0');
      return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
  };
  