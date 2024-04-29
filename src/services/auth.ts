import axios from 'axios';

export async function signUp(formData: any) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/member/signup`, formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error during signup: ${error}`);
  }
}
