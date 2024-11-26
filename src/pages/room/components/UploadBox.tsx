import { ChangeEvent, useRef } from "react";
import styled from "styled-components";

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  multiple: boolean;
  title: string;
  children?: JSX.Element;
}

function UploadBox({ handleChange, accept, multiple, title, children }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return (
    <DottedBox className="w-full h-full" onClick={handleInputClick}>
      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
      />
      {children ? (
        children
      ) : (
        <>
          <img
            src="/images/upload.svg"
            alt="Upload Icon"
            className="mt-2 w-12"
          />
          <div>{title}</div>
        </>
      )}
      {/* SVG icon */}
    </DottedBox>
  );
}

export default UploadBox;

const DottedBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  cursor: pointer;
  border-radius: 0.75rem;
  height: 220px;

  @media (min-width: 768px) {
    height: 100%;
  }

  &:hover {
    border-color: #e798a3;
  }
`;
