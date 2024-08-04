import { getBoardMyTotal } from "@/services/board/get/getBoard";
import Image from "next/image";
import React, { useState } from "react";
import { useQuery } from "react-query";

interface ticketProps {
  totalBoardCount: number | undefined;
}

const PAGE_SIZE = 5
const MyTicket = ({ totalBoardCount }: ticketProps) => {
  const [orderTypes, setOrderTypes] = useState("LATEST");
  const [pages, setPages] = useState(0);

  const { data: myTicketData } = useQuery({
    queryKey: ['myTicketData'],
    queryFn: () => getBoardMyTotal(PAGE_SIZE, pages, orderTypes),
  })

  const totalPages = totalBoardCount ? Math.ceil(totalBoardCount / PAGE_SIZE) : 0;

  const handlePageClick = (pageIndex: number) => {
    setPages(pageIndex);
  };

  console.log(myTicketData)
  return (
    <div className="mt-[3rem] grid grid-cols-1">
      <div className="flex">
        <h1 className="text-[2rem] font-semibold text-[#292929]">티켓</h1>
        <span className="text-[2rem] font-semibold text-[#FB3463] ml-[0.8rem]">{totalBoardCount}</span>
        <select
          className='flex w-[8rem] h-[3rem] ml-auto text-[1.5rem] font-medium selectshadow'
          value={orderTypes}
          onChange={(e) => setOrderTypes(e.target.value)}
        >
          <option value='LATEST'>최신순</option>
          <option value='VIEW'>조회순</option>
          <option value='LIKE'>인기순</option>
        </select>
      </div>
      {myTicketData?.result.map((ticektDatas: any) => {
        return (
          <div className="w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mt-[2rem]">
            <div
              className={`w-[15.4rem] h-full bg-[#55FBAF] rounded-l-[1rem]`}
            ></div>
            <div className="w-full mt-[5rem] relative">
              <div className="flex justify-center">
                <div>
                  <h1 className="text-[6rem] font-extrabold">KOR</h1>
                  <div className="w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex">
                    <span className="text-[#9D9D9D] text-[2.4rem] font-semibold">
                      {ticektDatas.ticket.departure}
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center bg-white z-10 mx-[5rem]">
                  {/* <Image className="" src={air} alt="비행기" /> */}
                </div>
                <div className="ml-[5rem]">
                  <h1 className="text-[6rem] font-extrabold">KOR</h1>
                  <div className="w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex">
                    <span className="text-[#9D9D9D] text-[2.4rem] font-semibold">
                      {ticektDatas.ticket.destination}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-[95%] border-2 border-dashed border-[#CFCFCF] my-[4rem] mx-auto relative z-0" />
              <div
                className={`flex justify-center text-[1.4rem] font-extrabold text-[#55FBAF]`}
              >
                <span className="w-[16rem]">PASSENGER</span>
                <span className="w-[25rem]">DATE</span>
                <span className="w-[8rem]">GROUP</span>
              </div>
              <div
                className={`flex justify-center text-[1.4rem] font-extrabold text-[#6B6B6B]`}
              >
                <span className="w-[16rem]">USERID</span>
                <span className="w-[25rem]">
                  {ticektDatas.ticket.startDate} ~{" "}
                  {ticektDatas.ticket.endDate}
                </span>
                <span className="w-[8rem]">
                  {ticektDatas.ticket.memberNum}
                </span>
              </div>
            </div>
            <div
              className={`w-[60rem] h-full bg-[#55FBAF] rounded-r-[1rem] ml-auto`}
            >
              <div className="absolute">
                <div className="relative bg-white w-[4rem] h-[4rem] rounded-full -mt-[2rem] -ml-[2rem]"></div>
                <div className="relative bg-white w-[4rem] h-[4rem] rounded-full mt-[28rem] -ml-[2rem]"></div>
              </div>
              <label className="w-full h-full flex" htmlFor="input-file">
                <div className="flex flex-col m-auto">
                  <Image
                    className="w-[23rem] h-[26rem] rounded-[1rem]"
                    src={ticektDatas.ticket.image.accessUri}
                    alt=""
                    width={230}
                    height={260}
                  />
                </div>
              </label>
            </div>
          </div>
        )
      })}
      <div className="flex justify-center my-16">
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
