import axios from 'axios';

const backendUrl = 'http://158.180.85.187:8080';

export async function signUp(formData: any) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/signup`, formData);
    return response.data;
  } catch (error) {
    throw new Error(`Error during signup: ${error}`);
  }
}
