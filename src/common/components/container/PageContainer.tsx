import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      <div className="w-full overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 z-20">
        {children}
      </div>
      <img
        src="/imgs/circledecor.svg"
        alt="Circle Decoration"
        className="fixed bottom-0 right-0 z-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
      />
    </>
  );
};

export default PageContainer;
