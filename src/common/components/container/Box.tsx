import React from "react";

interface BoxProps {
  children: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({ children }) => {
  return (
    <div className="p-8 bg-white rounded-xl shadow-md w-2/3">{children}</div>
  );
};

export default Box;
