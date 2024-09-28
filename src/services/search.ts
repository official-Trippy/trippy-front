import axios from "@/app/api/axios";
import { useUserStore } from "@/store/useUserStore";
import { useFollowingStore } from "@/store/useFollowingStore";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function searchTag(tag: string) {
  try {
    const response = await axios.get(
      `${backendUrl}//api/search/tag?tags=${tag}&postType=OOTD&page=0&size=1`
    );
    console.log("API Response tag~:", response.data);

    const postsData = response.data.result;
  } catch (error) {
    throw new Error(`Error during showFollowers: ${error}`);
  }
}
