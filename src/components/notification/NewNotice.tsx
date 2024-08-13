import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Cookies from "js-cookie";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { INewNotice, IEmergency, INoticeAdmin } from "@/types/notice";

function NewNotice() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const queryClient = useQueryClient();

  const [newNotice, setNewNotice] = useState<INewNotice>();
  const [newStatus, setStatus] = useState<IEmergency>();
  const [newApply, setNewApply] = useState<INoticeAdmin>();
  const [animationClass, setAnimationClass] = useState("slide-in");

  useEffect(() => {
    console.log("notifyConnect");
    const EventSource = EventSourcePolyfill || NativeEventSource;
    const eventSource = new EventSource(`${backendUrl}//api/notify/subscribe`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Connection: "keep-alive",
        Accept: "text/event-stream",
      },
      heartbeatTimeout: 86400000,
    });
    console.log("eventSource", eventSource);
    eventSource.addEventListener("connect", (event: any) => {
      const { data: receivedConnectData } = event;
      if (receivedConnectData === "SSE 연결이 완료되었습니다.") {
        console.log("SSE CONNECTED");
      } else {
        console.log(event);
      }
    });

    eventSource.addEventListener("newNotice", (event: any) => {
      const newNoticeInfo: INewNotice = JSON.parse(event.data);
      setNewNotice(newNoticeInfo);
      setAnimationClass("slide-in");
      queryClient.invalidateQueries("noticeCnt");
      queryClient.invalidateQueries("noticeList");
      queryClient.invalidateQueries(["unreadReceiveList", 0]);

      const slideOutTimer = setTimeout(() => {
        setAnimationClass("slide-out");

        const clearNoticeTimer = setTimeout(() => {
          setNewNotice(undefined);
        }, 500);

        return () => clearTimeout(clearNoticeTimer);
      }, 5000);

      return () => clearTimeout(slideOutTimer);
    });

    eventSource.addEventListener("statusChange", (event: any) => {
      const newStatusInfo: IEmergency = JSON.parse(event.data);
      setStatus(newStatusInfo);
      setAnimationClass("slide-in");
      queryClient.invalidateQueries("noticeCnt");
      queryClient.invalidateQueries("noticeList");
      queryClient.invalidateQueries(["unreadReceiveList"]);
      queryClient.invalidateQueries("apiCount");
      queryClient.invalidateQueries("apiStatuslist 전체");
      queryClient.invalidateQueries(["apiStatus"]);

      const slideOutTimer = setTimeout(() => {
        setAnimationClass("slide-out");

        const clearStatusTimer = setTimeout(() => {
          setStatus(undefined);
        }, 500);

        return () => clearTimeout(clearStatusTimer);
      }, 5000);

      return () => clearTimeout(slideOutTimer);
    });

    eventSource.addEventListener("newApply", (event: any) => {
      const newApplyInfo: INoticeAdmin = JSON.parse(event.data);
      setNewApply(newApplyInfo);
      setAnimationClass("slide-in");
      queryClient.invalidateQueries("noticeCnt");
      queryClient.invalidateQueries("noticeList");
      queryClient.invalidateQueries(["unreadReceiveList"]);
      queryClient.invalidateQueries(["provideApplyList"]);
      queryClient.invalidateQueries(["useApplyList"]);

      const slideOutTimer = setTimeout(() => {
        setAnimationClass("slide-out");

        const clearApplyTimer = setTimeout(() => {
          setNewApply(undefined);
        }, 500);

        return () => clearTimeout(clearApplyTimer);
      }, 5000);

      return () => clearTimeout(slideOutTimer);
    });

    return () => {
      eventSource.close();
      console.log("SSE CLOSED");
    };
  }, []);

  const handleClose = () => {
    setAnimationClass("slide-out");
  };

  if (!newNotice && !newStatus && !newApply) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-gray-800 p-4 text-white shadow-lg transform transition-transform duration-500 ${
        animationClass === "slide-in" ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {newNotice && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">{newNotice.user.nickname}</p>
            <p>{newNotice.message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-sm font-semibold text-red-400"
          >
            Close
          </button>
        </div>
      )}
      {newStatus && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">Emergency</p>
            <p>{newStatus.message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-sm font-semibold text-red-400"
          >
            Close
          </button>
        </div>
      )}
      {newApply && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">{newApply.user.nickname}</p>
            <p>{newApply.message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-sm font-semibold text-red-400"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default NewNotice;
