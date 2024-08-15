import React from 'react';
import Image from 'next/image';
import OpencampusLogo from '@/assets/common/OpencampusLogo.svg';
import { ContentContainer } from './common/ContentContainer';

export const Guide = () => {
  return (
    <ContentContainer contentHeader="Steps">
      <>
        <div className="step1 flex flex-col justify-center items-start">
          <div className="flex justify-start items-baseline gap-4">
            <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
              1
            </span>
            <span className="text-xl text-neutral-700">Write program details</span>
          </div>
          <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
            <span className="text-neutral-400">Title, Description, Period, etc..</span>
          </div>
        </div>
        <div className="step2 flex flex-col justify-center items-start">
          <div className="flex justify-start items-baseline gap-4">
            <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
              2
            </span>
            <span className="text-xl text-neutral-700">Set program managers</span>
          </div>
          <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
            <span className="text-neutral-400">
              Managers can create missions and assign auditors on behalf of the owner
            </span>
          </div>
        </div>
        <div className="step3 flex flex-col justify-center items-start">
          <div className="flex justify-start items-baseline gap-4">
            <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
              3
            </span>
            <span className="text-xl text-neutral-700">Allocate bounty</span>
          </div>
          <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
            <div className="text-neutral-400 flex items-center justify-start gap-1">
              <span>On </span>
              <Image src={OpencampusLogo} alt="educoin-logo" width={14} height={14} />
              <span>OpenCampus EDU coin</span>
            </div>
          </div>
        </div>
        <div className="step4 flex flex-col justify-center items-start">
          <div className="flex justify-start items-baseline gap-4">
            <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
              4
            </span>
            <span className="text-xl text-neutral-700">Add missions</span>
          </div>
          <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
            <span className="text-neutral-400">(Optional) You can add missions whenever you want</span>
          </div>
        </div>
        <div className="step5 flex flex-col justify-center items-start">
          <div className="flex justify-start items-baseline gap-4">
            <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
              5
            </span>
            <span className="text-xl text-neutral-700">Confirm and create</span>
          </div>
          <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3">
            <span className="text-neutral-400">Review the program settings and create it if everything looks good</span>
          </div>
        </div>
      </>
    </ContentContainer>
    // <div className="contentContainer w-full flex flex-col">
    //   <div className="containerHeader text-2xl text-neutral-500 mb-4">Steps</div>
    //   <div className="containerBody px-1 flex flex-col">
    //     <div className="step1 flex flex-col justify-center items-start">
    //       <div className="flex justify-start items-baseline gap-4">
    //         <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
    //           1
    //         </span>
    //         <span className="text-xl text-neutral-700">Write program details</span>
    //       </div>
    //       <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
    //         <span className="text-neutral-400">Title, Description, Period, etc..</span>
    //       </div>
    //     </div>
    //     <div className="step2 flex flex-col justify-center items-start">
    //       <div className="flex justify-start items-baseline gap-4">
    //         <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
    //           2
    //         </span>
    //         <span className="text-xl text-neutral-700">Set program managers</span>
    //       </div>
    //       <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
    //         <span className="text-neutral-400">
    //           Managers can create missions and assign auditors on behalf of the owner
    //         </span>
    //       </div>
    //     </div>
    //     <div className="step3 flex flex-col justify-center items-start">
    //       <div className="flex justify-start items-baseline gap-4">
    //         <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
    //           3
    //         </span>
    //         <span className="text-xl text-neutral-700">Allocate bounty</span>
    //       </div>
    //       <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
    //         <div className="text-neutral-400 flex items-center justify-start gap-1">
    //           <span>On </span>
    //           <Image
    //             src="https://opencampus-codex.blockscout.com/assets/configs/network_icon.svg"
    //             alt="educoin-logo"
    //             width={14}
    //             height={14}
    //           />
    //           <span>OpenCampus EDU coin</span>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="step4 flex flex-col justify-center items-start">
    //       <div className="flex justify-start items-baseline gap-4">
    //         <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
    //           4
    //         </span>
    //         <span className="text-xl text-neutral-700">Add missions</span>
    //       </div>
    //       <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3 border-l-1.5 border-l-neutral-200 border-solid">
    //         <span className="text-neutral-400">(Optional) You can add missions whenever you want</span>
    //       </div>
    //     </div>
    //     <div className="step5 flex flex-col justify-center items-start">
    //       <div className="flex justify-start items-baseline gap-4">
    //         <span className="rounded-full bg-neutral-200 text-neutral-500 font-semibold w-8 h-8 justify-center items-center flex">
    //           5
    //         </span>
    //         <span className="text-xl text-neutral-700">Confirm and create</span>
    //       </div>
    //       <div className="flex justify-center items-start my-2 ml-4 pl-10 pb-3">
    //         <span className="text-neutral-400">Review the program settings and create it if everything looks good</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
