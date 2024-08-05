import { getUserBoard } from "@/services/board/get/getBoard";
import { colorTicket } from "@/types/board";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useQuery } from "react-query";
import air from '@/dummy/air.svg'


interface userProps {
  memberEmail: string;
  userBoardCount: number | undefined;
}

const PAGE_SIZE = 8

const UserTicket = ({ memberEmail, userBoardCount }: userProps) => {
  const [orderTypes, setOrderTypes] = useState("LATEST");
  const [pages, setPages] = useState(0);
  const router = useRouter();

  const { data: userTicketData } = useQuery({
    queryKey: ['userTicketData'],
    queryFn: () => getUserBoard(PAGE_SIZE, pages, orderTypes, memberEmail),
  })

  const totalPages = userBoardCount ? Math.ceil(userBoardCount / PAGE_SIZE) : 0;

  const handlePageClick = (pageIndex: number) => {
    setPages(pageIndex);
  };

  const handleBoardLink = (boardId: number) => {
    router.push(`/board/${boardId}`)
  }

  console.log(userTicketData)
  return (
    <div>
      <div className="grid grid-cols-4 gap-12">
        {userTicketData?.result.map((ticektDatas: any) => {
          console.log(colorTicket[ticektDatas.ticket.ticketColor])
          return (
            <div key={ticektDatas.ticket.id} className={`flex-1 cursor-pointer `} onClick={() => { handleBoardLink(ticektDatas.post.id) }} >
              {ticektDatas.post.images.length > 0 && (
                <div className={`relative w-full pb-[100%] rounded-[1rem] ${colorTicket[ticektDatas.ticket.ticketColor] ? `bg-[${colorTicket[ticektDatas.ticket.ticketColor]}]` : ''}`}> {/* 컨테이너를 정사각형으로 설정 */}
                  <Image
                    src={ticektDatas.post.images[0].accessUri}
                    alt="OOTD"
                    className="absolute inset-0 w-full h-full object-cover rounded-[1rem] p-[1.3rem]"
                    width={200} // Width and height are for aspect ratio purposes
                    height={200}
                  />
                </div>
              )}
              <div className="font-normal font-['Pretendard'] shadowall rounded-[1rem] p-[1rem] flex">
                <div className="mx-auto">
                  <div className="flex flex-col">
                    <span className={`text-[1.2rem] font-extrabold`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>
                      PASSENGER
                    </span>
                    <span className="text-[1.2rem] font-medium text-[#6B6B6B]">USERID</span>
                  </div>
                  <div className="flex flex-col mt-[0.5rem]">
                    <span className={`text-[1.2rem] font-extrabold`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>DATE</span>
                    <span className="text-[1.2rem] font-medium text-[#6B6B6B]">{ticektDatas.ticket.startDate} ~<br /> {ticektDatas.ticket.endDate}</span>
                  </div>
                  <div className="flex flex-col mt-[0.5rem]">
                    <span className={`text-[1.2rem] font-extrabold`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>GROUP</span>
                    <span className="text-[1.2rem] font-medium text-[#6B6B6B]">{ticektDatas.ticket.memberNum}</span>
                  </div>
                </div>
                <div className="mx-auto border border-dashed border-[#CFCFCF]" />
                <div className="flex flex-col text-[3.2rem] font-extrabold font-akira mx-auto">
                  <span>KOR</span>
                  <Image className="mx-auto my-[1rem]" src={air} width={15} height={15} alt="air" />
                  <span>KOR</span>
                </div>
              </div>

            </div>
          )
        }

        )}
      </div>
      <div className="flex w-full justify-center my-16">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`mx-1 py-2 px-4 ${pages === index ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTicket;
