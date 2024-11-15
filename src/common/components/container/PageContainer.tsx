import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="w-[85vw] overflow-y-auto main-content p-10">{children}</div>
  );
};

export default PageContainer;
