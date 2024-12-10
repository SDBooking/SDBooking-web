import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  DialogContentText,
  IconButton,
} from "@mui/material";
import { Booking } from "../../../types/booking";
import { ClockIcon, DateRangeIcon } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import useAccountContext from "../../../common/contexts/AccountContext";
import { TrashIcon } from "@heroicons/react/24/solid";
import { getStatusInThai } from "../../home/scripts/StatusMapping";

interface BookingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: Booking;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onDiscard: () => void;
  onDeleted?: () => void;
}

const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
  isOpen,
  onClose,
  selectedBooking,
  onApprove,
  onReject,
  onDiscard,
  onDeleted,
}) => {
  const [rejectReason, setRejectReason] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const { accountData } = useAccountContext();

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      PENDING: "orange",
      APPROVED: "green",
      REJECTED: "red",
      DISCARDED: "grey",
    };
    return statusColors[status] || "inherit";
  };

  const handleReject = () => {
    onReject(rejectReason);
    setRejectReason("");
  };

  const handleOpenConfirmDelete = () => setConfirmDeleteOpen(true);
  const handleCloseConfirmDelete = () => setConfirmDeleteOpen(false);

  const handleOpenConfirmDiscard = () => setConfirmDiscardOpen(true);
  const handleCloseConfirmDiscard = () => setConfirmDiscardOpen(false);

  const handleOpenConfirmApprove = () => setConfirmApproveOpen(true);
  const handleCloseConfirmApprove = () => setConfirmApproveOpen(false);

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle className="text-center">
          ข้อมูลการจอง
          <div className="absolute right-4 top-3 ">
            <IconButton onClick={onClose} color="warning" className="size-10">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" className="text-center text-maincolor">
            {selectedBooking.room_name}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            gap={2}
            justifyContent="center"
            p={2}
          >
            <Typography
              variant="body2"
              style={{
                backgroundColor: "#FFF1DA",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: 400,
                fontSize: "0.875rem",
              }}
              className="text-maincolor"
            >
              <DateRangeIcon style={{ marginRight: "8px" }} />
              {dayjs(selectedBooking.date).utc().format("YYYY-MM-DD")}
            </Typography>
            <Typography
              variant="body2"
              style={{
                backgroundColor: "#FFF1DA",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: 400,
                fontSize: "0.875rem",
              }}
              className="text-maincolor"
            >
              <ClockIcon style={{ marginRight: "8px" }} />
              {dayjs(selectedBooking.start_time).utc().format("HH:mm")} -{" "}
              {dayjs(selectedBooking.end_time).utc().format("HH:mm")}
            </Typography>
          </Box>
          <Box className="p-6">
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>รหัสการจองห้อง</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{selectedBooking.id}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>ชื่อผู้จอง</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {selectedBooking.account_name}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>หัวข้อการจอง</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{selectedBooking.title}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>เหตุผลการจอง</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {selectedBooking.reason}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {accountData?.isAdmin && (
                  <Typography variant="body1">
                    <strong>เบอร์โทรติดต่อ</strong>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                {accountData?.isAdmin && (
                  <Typography variant="body1">{selectedBooking.tel}</Typography>
                )}
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>สถานะการจอง</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  style={{ color: getStatusColor(selectedBooking.status) }}
                >
                  {getStatusInThai(selectedBooking.status)}
                </Typography>
              </Grid>
              {selectedBooking.reject_historys &&
                selectedBooking.reject_historys.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" className="text-gray-400">
                        เหตุผลที่ไม่อนุมัติ
                      </Typography>
                    </Grid>
                    {selectedBooking.reject_historys.map((reject, index) => (
                      <React.Fragment key={index}>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>เหตุผล {index + 1}</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1">
                            {reject.reason || "No reason provided"}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </>
                )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedBooking.account_id ===
            accountData?.userData.cmuitaccount && (
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                onClick={handleOpenConfirmDelete}
                color="error"
                variant="contained"
                startIcon={<TrashIcon className="size-4" />}
              >
                ลบ
              </Button>
            </Box>
          )}
          {selectedBooking.status === "PENDING" && (
            <>
              <Box display="flex" justifyContent="flex-end" width="100%">
                {accountData?.isAdmin && (
                  <Box display="flex" gap={1}>
                    <Button
                      onClick={handleOpenConfirmDiscard}
                      color="error"
                      variant="contained"
                    >
                      ไม่อนุมัติ
                    </Button>
                    <Button
                      onClick={handleOpenConfirmApprove}
                      color="success"
                      variant="contained"
                    >
                      อนุมัติ
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">
          {"ยืนยันที่จะลบการจอง"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            คุณแน่ใจหรือไม่ที่จะลบการจองนี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmDelete}
            color="error"
            variant="contained"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              onDeleted && onDeleted();
              handleCloseConfirmDelete();
            }}
            color="success"
            variant="contained"
            autoFocus
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDiscardOpen}
        onClose={handleCloseConfirmDiscard}
        aria-labelledby="confirm-discard-title"
        aria-describedby="confirm-discard-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="confirm-discard-title">
          {"ยืนยันที่จะไม่อนุมัติการจอง"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-discard-description">
            คุณแน่ใจหรือไม่ที่จะไม่อนุมัติการจองนี้?
          </DialogContentText>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="เหตุผลการไม่อนุมัติ (ถ้ามี)"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmDiscard}
            color="error"
            variant="contained"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              if (rejectReason.length > 0) {
                handleReject();
              } else {
                onDiscard();
              }
              handleCloseConfirmDiscard();
            }}
            color="success"
            variant="contained"
            autoFocus
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmApproveOpen}
        onClose={handleCloseConfirmApprove}
        aria-labelledby="confirm-approve-title"
        aria-describedby="confirm-approve-description"
      >
        <DialogTitle id="confirm-approve-title">
          {"ยืนยันที่จะอนุมัติการจอง"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-approve-description">
            คุณแน่ใจหรือไม่ที่จะอนุมัติการจองนี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmApprove}
            color="error"
            variant="contained"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              onApprove();
              handleCloseConfirmApprove();
            }}
            color="success"
            variant="contained"
            autoFocus
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookingDetailsDialog;
