import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function checkNickNameDuplicate(nickName: string) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/member/isDuplicated?nickName=${nickName}`
    );
    const data = response.data;
    console.log(response);
    console.log(data);
    if (data.isSuccess && data.result && data.result.duplicated) {
      return { duplicated: true };
    } else {
      return { duplicated: false };
    }
  } catch (error) {
    throw new Error(`Error checking email duplication: ${error}`);
  }
}

export async function checkBlogNameDuplicate(blogName: string) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/blog/isDuplicated?blogName=${blogName}`
    );
    const data = response.data;
    console.log(response);
    console.log(data);
    if (data.isSuccess && data.result && data.result.duplicated) {
      return { duplicated: true };
    } else {
      return { duplicated: false };
    }
  } catch (error) {
    throw new Error(`Error checking email duplication: ${error}`);
  }
}
