import { getBoardMyTotal } from "@/services/board/get/getBoard";
import { colorTicket } from "@/types/board";
import Image from "next/image";
import React, { useState } from "react";
import { useQuery } from "react-query";
import air from '@/dummy/mypage/air.svg'
import bus from '@/dummy/mypage/bus.svg'
import bycicle from '@/dummy/mypage/bycicle.svg'
import car from '@/dummy/mypage/car.svg'
import train from '@/dummy/mypage/train.svg'
import { useRouter } from "next/navigation";
import { MyAirSVG, MyBusSVG, MyBycicleSVG, MyCarSVG, MyTrainSVG } from "../transportsvg/mypage";
interface ticketProps {
  totalBoardCount: number | undefined;
}

const PAGE_SIZE = 8
const MyTicket = ({ totalBoardCount }: ticketProps) => {
  const [orderTypes, setOrderTypes] = useState("LATEST");
  const [pages, setPages] = useState(0);
  const router = useRouter();

  const { data: myTicketData, refetch: TicketRefetch } = useQuery({
    queryKey: ['myTicketData'],
    queryFn: () => getBoardMyTotal(PAGE_SIZE, pages, orderTypes)
  })

  const totalPages = totalBoardCount ? Math.ceil(totalBoardCount / PAGE_SIZE) : 0;

  const handleBoardLink = (boardId: number) => {
    router.push(`/board/${boardId}`)
  }

  const handlePageClick = (pageIndex: number) => {
    setPages(pageIndex);
    setTimeout(() => {
      TicketRefetch();
    }, 100)
  };



  // console.log(myTicketData)
  return (
    <div>
      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {myTicketData?.result.map((ticektDatas: any) => {

          const getTransportImage = (transport: string, ticketColor: any) => {
            switch (transport) {
              case 'Airplane':
                return <MyAirSVG fillColor={colorTicket[ticketColor]} />;
              case 'Car':
                return <MyCarSVG fillColor={colorTicket[ticketColor]} />;
              case 'Bus':
                return <MyBusSVG fillColor={colorTicket[ticketColor]} />;
              case 'Bicycle':
                return <MyBycicleSVG fillColor={colorTicket[ticketColor]} />;
              case 'Train':
                return <MyTrainSVG fillColor={colorTicket[ticketColor]} />;
              default:
                return null; // 기본값 또는 대체 이미지
            }
          };

          // console.log(colorTicket[ticektDatas.ticket.ticketColor])
          return (
            <div key={ticektDatas.ticket.id} className={`flex-1 cursor-pointer `} onClick={() => { handleBoardLink(ticektDatas.post.id) }} >
              {/* {ticektDatas.post.images.length > 0 && ( */}
              <div className={`relative w-full pb-[100%] rounded-[1rem] ${colorTicket[ticektDatas.ticket.ticketColor] ? `bg-[${colorTicket[ticektDatas.ticket.ticketColor]}]` : ''}`}> {/* 컨테이너를 정사각형으로 설정 */}
                <Image
                  src={ticektDatas?.ticket.image.accessUri}
                  alt="OOTD"
                  className="absolute inset-0 w-full h-full object-cover rounded-[1rem] p-[1.3rem]"
                  width={200} // Width and height are for aspect ratio purposes
                  height={200}
                />
              </div>
              {/* )} */}
              <div className="font-normal font-['Pretendard'] shadowall rounded-[1rem] p-[1rem] flex">
                <div className="mx-auto">
                  <div className="flex flex-col">
                    <span className={`text-[0.8rem] lg:text-[0.8rem] xl:text-[1.2rem] font-extrabold font-akira`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>
                      PASSENGER
                    </span>
                    <span className="text-[1.2rem] font-medium text-[#6B6B6B]">{ticektDatas.member.nickName}</span>
                  </div>
                  <div className="flex flex-col mt-[0.5rem]">
                    <span className={`text-[1.2rem] font-extrabold font-akira`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>DATE</span>
                    <span className="text-[1.2rem] font-medium text-[#6B6B6B]">{ticektDatas.ticket.startDate} ~<br /> {ticektDatas.ticket.endDate}</span>
                  </div>
                  <div className="flex flex-col mt-[0.5rem]">
                    <span className={`text-[1.2rem] font-extrabold font-akira`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>GROUP</span>
                    <span className="text-[1.2rem] font-medium text-[#6B6B6B]">{ticektDatas.ticket.memberNum}</span>
                  </div>
                </div>
                <div className="mx-auto border border-dashed border-[#CFCFCF]" />
                <div className="flex flex-col font-extrabold font-akira mx-auto">
                  <span className="text-[1.8rem] sm:text-[2.8rem] md:text-[2.4rem] lg:text-[1.8rem] xl:text-[3.2rem]">{ticektDatas.ticket.departureCode}</span>
                  <div className="mx-auto">
                    {getTransportImage(ticektDatas.ticket.transport, ticektDatas.ticket.ticketColor)}
                  </div>
                  <span className="text-[1.8rem] sm:text-[2.8rem] md:text-[2.4rem] lg:text-[1.8rem] xl:text-[3.2rem]">{ticektDatas.ticket.destinationCode}</span>
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

export default MyTicket;
