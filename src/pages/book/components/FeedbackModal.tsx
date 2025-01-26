import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown maxWidth="sm">
      <DialogTitle
        className="flex text-center items-center justify-center"
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 181, 147, 0.35) 75%, rgba(255, 89, 103, 0.35) 100%)",
        }}
      >
        <img src="/imgs/emojihappy.svg" className="my-2"></img>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContent>
          <Typography variant="h6" className="text-center text-maincolor">
            แบบประเมินการใช้งาน
          </Typography>
          <div className="absolute right-4 top-3">
            <IconButton onClick={onClose} color="warning" className="size-10">
              <CloseIcon />
            </IconButton>
          </div>
          <Typography className="py-4">
            ขณะนี้เว็บไซต์ SD Booking กำลังอยู่ในช่วงการพัฒนา
            จึงขอความร่วมมือช่วยประเมินและให้ข้อเสนอแนะ
            เพื่อนำไปปรุงปรุงเว็บไซต์นี้ให้ดีขึ้นต่อไป
          </Typography>
        </DialogContent>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          component="a"
          href="https://forms.office.com/r/y0jCJG50qu"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          onClick={onClose}
          style={{
            fontSize: "1.25rem",
            padding: "12px 24px",
            backgroundColor: "#33302E",
            color: "#FFFFFF",
          }}
        >
          เริ่มทำแบบสอบถาม
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
