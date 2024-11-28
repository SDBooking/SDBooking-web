import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

interface RejectionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectHistory: { reason: string }[];
}

const RejectionHistoryModal: React.FC<RejectionHistoryModalProps> = ({
  isOpen,
  onClose,
  rejectHistory,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Rejection History</DialogTitle>
      <DialogContent dividers>
        {rejectHistory && rejectHistory.length > 0 ? (
          rejectHistory.map((reject, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body1" gutterBottom>
                <strong>Reason {index + 1}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {reject.reason ? reject.reason : "No reason provided"}
              </Typography>
              {index < rejectHistory.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <Typography variant="body1">No rejection history</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionHistoryModal;
