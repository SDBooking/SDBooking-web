import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      <div className="w-[85vw] overflow-y-auto main-content p-10 z-20">
        {children}
      </div>
      <img
        src="/imgs/circledecor.svg"
        alt="Circle Decoration"
        className="fixed bottom-0 right-0 z-10 w-1/4"
      />
    </>
  );
};

export default PageContainer;
