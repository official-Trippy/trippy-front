import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function checkSocial(email: string) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/member/isNewMember=${email}`
    );
    const data = response.data.result;
    console.log("CheckSocial response data:", data);
    return data.isNewMember;
  } catch (error) {
    console.error("Error checking social status:", error);
    throw new Error("Error data");
  }
}

export async function signUp({
  memberId,
  email,
  password,
}: {
  memberId: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/signup`, {
      memberId,
      email,
      password,
    });
    console.log("SignUp response:", response.data);
  } catch (error) {
    console.error("Error signing up:", error);
  }
}
