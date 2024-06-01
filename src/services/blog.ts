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
      `${backendUrl}/api/member/isDuplicated?blogName=${blogName}`
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

export async function signupCommon(data: { nickName: string; blogName: string; blogIntroduce: string; }) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/signup/common`, data);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(`Error signing up: ${error}`);
  }
}

export async function submitInterests(selectedInterests: string[]) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/interest`, {
      koreanInterestedTypes: selectedInterests,
    });

    if (response.data.isSuccess) {
      return { success: true };
    } else {
      return { success: false, message: "Failed to submit interests" };
    }
  } catch (error) {
    throw new Error(`Error submitting interests: ${error}`);
  }
}

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${backendUrl}/api/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.isSuccess) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || 'Image upload failed');
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
