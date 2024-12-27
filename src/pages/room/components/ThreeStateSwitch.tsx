import React from "react";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import RemoveIcon from "@mui/icons-material/Remove";

interface ThreeStateSwitchProps {
  value: "checked" | "cross" | "blank";
  onChange: (newValue: "checked" | "cross" | "blank") => void;
}

const ThreeStateSwitch: React.FC<ThreeStateSwitchProps> = ({
  value,
  onChange,
}) => {
  const handleClick = () => {
    if (value === "checked") {
      onChange("cross");
    } else if (value === "cross") {
      onChange("blank");
    } else {
      onChange("checked");
    }
  };

  return (
    <IconButton onClick={handleClick}>
      {value === "checked" && <CheckIcon />}
      {value === "cross" && <ClearIcon />}
      {value === "blank" && <RemoveIcon />}
    </IconButton>
  );
};

export default ThreeStateSwitch;
