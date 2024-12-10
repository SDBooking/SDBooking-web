import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useNavigate } from "react-router";

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const BackPageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  description,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-[85vw] overflow-y-auto main-content p-10 relative z-20">
        <div className="px-6 py-4 flex items-center gap-6">
          <ArrowLeftIcon
            className="cursor-pointer size-10 rounded-full text-maincolor p-1"
            style={{
              background:
                "linear-gradient(0deg, #FFF6EE, #FFF6EE), linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 200, 149, 0.35) 100%)",
            }}
            onClick={() => navigate(-1)}
          />
          <span className="text-2xl font-semibold text-maincolor">{title}</span>
        </div>
        <div className="ml-16 px-6 rounded-t-xl flex items-center ">
          <span className="text-sm">{description}</span>
        </div>
        <div className="m-10 z-5">{children}</div>
      </div>
      <img
        src="/imgs/circledecor.svg"
        alt="Circle Decoration"
        className="fixed bottom-0 right-0 z-10 w-1/4"
      />
    </>
  );
};

export default BackPageContainer;
