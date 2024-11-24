import { ChangeEvent } from "react";
import UploadBox from "./UploadBox";
import toast from "react-hot-toast";

interface Props {
  image: File | string | null;
  handleAttachImage: (file: File) => void;
  placeholder?: boolean;
}

const ImgPreview = (props: { imgSrc: string }) => {
  return (
    <img
      src={props.imgSrc}
      alt="ImgPreview"
      className="object-scale-down rounded-lg h-full"
    />
  );
};

function AttachImage({ image, handleAttachImage, placeholder = true }: Props) {
  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const addedImage = event.target.files;

    if (addedImage) {
      const img = addedImage[0];
      if (img.size > 5 * 1024 * 1024) {
        toast.error("ไฟล์มีขนาดเกิน 5MB");
      } else handleAttachImage(addedImage[0]);
    }
  };
  return (
    <>
      <div className="flex mt-4 gap-2 flex-col md:flex-row md:h-[270px]">
        {placeholder && (
          <img
            src={"/images/ImgExm.png"}
            alt="ImgExm"
            style={{ height: "100%" }}
            className="object-scale-down rounded-lg md:w-3/4"
          />
        )}
        <UploadBox
          title="Click Upload Image Here"
          accept="image/jpeg, image/png"
          multiple={false}
          children={
            image ? (
              typeof image === "string" ? (
                <ImgPreview imgSrc={image} />
              ) : (
                <ImgPreview imgSrc={URL.createObjectURL(image)} />
              )
            ) : undefined
          }
          handleChange={handleChangeImage}
        />
      </div>
    </>
  );
}

export default AttachImage;
