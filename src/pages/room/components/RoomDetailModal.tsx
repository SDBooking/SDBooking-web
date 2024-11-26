import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  type: string;
  location: string;
  capacity: number;
  description: string;
  services?: string[];
  requiresConfirmation: boolean;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  isOpen,
  onClose,
  name,
  type,
  location,
  capacity,
  description,
  services,
  requiresConfirmation,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{name}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary">
          ประเภท: {type}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          สถานที่: {location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ความจุ: {capacity} ที่นั่ง
        </Typography>
        <Typography variant="body2" color="textSecondary">
          รายละเอียด: {description}
        </Typography>
        {services && (
          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle2">สิ่งอำนวยความสะดวก:</Typography>
            <ul style={{ paddingLeft: 16 }}>
              {services.map((service, index) => (
                <li key={index}>
                  <Typography variant="body2" color="textSecondary">
                    {service}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        )}
        {requiresConfirmation && (
          <Typography variant="caption" color="error" style={{ marginTop: 8 }}>
            * ต้องขออนุมัติก่อนใช้งาน
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomDetailModal;
