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
      <div className="w-full overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 z-20">
        <div className="flex items-center gap-4 sm:gap-6">
          <ArrowLeftIcon
            className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full text-maincolor p-1"
            style={{
              background:
                "linear-gradient(0deg, #FFF6EE, #FFF6EE), linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 200, 149, 0.35) 100%)",
            }}
            onClick={() => navigate(-1)}
          />
          <span className="text-xl sm:text-2xl font-semibold text-maincolor">
            {title}
          </span>
        </div>
        <div className="ml-12 sm:ml-16 px-4 sm:px-6 rounded-t-xl flex items-center">
          <span className="text-sm">{description}</span>
        </div>
        <div className="m-4 sm:m-6 md:m-8 lg:m-10 z-5">{children}</div>
      </div>
      <img
        src="/imgs/circledecor.svg"
        alt="Circle Decoration"
        className="fixed bottom-0 right-0 z-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
      />
    </>
  );
};

export default BackPageContainer;
