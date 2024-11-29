import React from "react";
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
} from "@mui/material";
import { Booking } from "../../../types/booking";
import { ClockIcon, DateRangeIcon } from "@mui/x-date-pickers";
import useAccountContext from "../../../common/contexts/AccountContext";

interface BookingDetailsViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: Booking;
}

const BookingDetailsViewDialog: React.FC<BookingDetailsViewDialogProps> = ({
  isOpen,
  onClose,
  selectedBooking,
}) => {
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

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-center">ข้อมูลการจอง</DialogTitle>
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
              <Typography variant="body1">{selectedBooking.reason}</Typography>
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
                {selectedBooking.status}
              </Typography>
            </Grid>
            {selectedBooking.reject_historys &&
              selectedBooking.reject_historys.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" className="text-gray-400">
                      Reject Reasons
                    </Typography>
                  </Grid>
                  {selectedBooking.reject_historys.map((reject, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={4}>
                        <Typography variant="body1">
                          <strong>Reason {index + 1}</strong>
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
        <Button onClick={onClose} color="primary" variant="contained">
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsViewDialog;