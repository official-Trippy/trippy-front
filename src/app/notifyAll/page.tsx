// import axios from "axios";

// interface Notification {
//   notifyId: number;
//   title: string;
//   content: string | null;
//   senderProfileImgAccessUri: string;
//   senderNickName: string;
//   notificationType: "LIKE" | "COMMENT" | "FOLLOW";
//   createdAt: string;
//   read: boolean;
// }
// let accessToken = "";

// async function fetchNotifications(): Promise<Notification[]> {
//   const response = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/notify`
//   );
//   return response.data;
// }

// export default async function NotificationsPage() {
//   const notifications = await fetchNotifications();

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">All Notifications</h1>
//       <ul>
//         {notifications.map((notification) => (
//           <li
//             key={notification.notifyId}
//             className="flex items-center mb-4 p-4 rounded-md shadow-lg"
//           >
//             <img
//               src={notification.senderProfileImgAccessUri}
//               alt="Profile"
//               className="w-10 h-10 rounded-full mr-4"
//             />
//             <div>
//               <p className="font-semibold">{notification.title}</p>
//               {notification.notificationType === "COMMENT" &&
//                 notification.content && (
//                   <p className="text-sm text-gray-600">
//                     {truncateText(notification.content, 30)}
//                   </p>
//                 )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// const truncateText = (text: string, length: number) => {
//   if (text.length <= length) return text;
//   return text.substring(0, length) + "...";
// };

const notifyAllPage = () => {
  <div>알림페이지</div>
};

export default notifyAllPage;