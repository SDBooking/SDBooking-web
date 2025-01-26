const colors = [
  "#FFEBD9",
  "#FAE1E4",
  "#FFE4EF",
  "#FDE8FA",
  "#F0E7FD",
  "#FFFBDF",
  "#EFFFE7",
  "#D5F3F0",
  "#E5F7FF",
  "#EAECFF",
];

const contrastColors = [
  "text-[#FD7427]",
  "text-[#A7172B]",
  "text-[#FD6CA9]",
  "text-[#D755C5]",
  "text-[#6A29C7]",
  "text-[#F9A224]",
  "text-[#91B380]",
  "text-[#078378]",
  "text-[#4CA0C4]",
  "text-[#7076B6]",
];

const contrastColorsWithoutText = [
  "#FD7427",
  "#A7172B",
  "#FD6CA9",
  "#D755C5",
  "#6A29C7",
  "#F9A224",
  "#91B380",
  "#078378",
  "#4CA0C4",
  "#7076B6",
];

const bgcolors = [
  "bg-[#FFEBD9]",
  "bg-[#FAE1E4]",
  "bg-[#FFE4EF]",
  "bg-[#FDE8FA]",
  "bg-[#F0E7FD]",
  "bg-[#FFFBDF]",
  "bg-[#EFFFE7]",
  "bg-[#D5F3F0]",
  "bg-[#E5F7FF]",
  "bg-[#EAECFF]",
];

export const getColorForRoom = (roomId: number) => {
  return bgcolors[(roomId - 1) % bgcolors.length];
};

export const getPureContrastColorForRoom = (roomId: number) => {
  return contrastColorsWithoutText[
    (roomId - 1) % contrastColorsWithoutText.length
  ];
};

export const getContrastColorForRoom = (roomId: number) => {
  return contrastColors[(roomId - 1) % contrastColors.length];
};

export const getPureColorForRoom = (roomId: number) => {
  return colors[(roomId - 1) % colors.length];
};
