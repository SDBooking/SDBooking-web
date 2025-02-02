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
  "bg-[#FFEBD9] hover:bg-[#FFD9B3]",
  "bg-[#FAE1E4] hover:bg-[#F5C3D1]",
  "bg-[#FFE4EF] hover:bg-[#FFC9E0]",
  "bg-[#FDE8FA] hover:bg-[#F9D1F5]",
  "bg-[#F0E7FD] hover:bg-[#D9D1F5]",
  "bg-[#FFFBDF] hover:bg-[#FFF6B3]",
  "bg-[#EFFFE7] hover:bg-[#D9F5C3]",
  "bg-[#D5F3F0] hover:bg-[#A7E8E1]",
  "bg-[#E5F7FF] hover:bg-[#C5E8FD]",
  "bg-[#EAECFF] hover:bg-[#D1D3F5]",
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
