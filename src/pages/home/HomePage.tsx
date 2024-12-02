import React, { useEffect, useState } from "react";
import PageContainer from "../../common/components/container/PageContainer";
import {
  Booking,
  BookingStatusList,
  BookingUpdateModel,
} from "../../types/booking";
import { GetBookByAccountId } from "../../common/apis/booking/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
  colors,
  Typography,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useAccountContext from "../../common/contexts/AccountContext";
import ResubmitBookingModal from "./components/RenewRejectBook";
import RejectionHistoryModal from "../history/components/RejectionHistoryModal";
import { Room } from "../../types/room";
import { GetAllRooms } from "../../common/apis/room/queries";

dayjs.extend(utc);

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Booking>("id");
  const [isResubmitModalOpen, setResubmitModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingUpdateModel | null>(null);
  const [selectedRejectHistory, setSelectedRejectHistory] = useState<
    { reason: string }[] | null
  >(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { accountData } = useAccountContext();

  const fetchData = async () => {
    const fetchBooks = async () => {
      try {
        if (accountData?.userData?.cmuitaccount) {
          const bookResponse = await GetBookByAccountId(
            accountData?.userData.cmuitaccount
          );
          if (Array.isArray(bookResponse.result)) {
            setBooks(bookResponse.result);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const roomResponse = await GetAllRooms();
        if (Array.isArray(roomResponse.result)) {
          setRooms(roomResponse.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRooms();
    fetchBooks();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestSort = (property: keyof Booking) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBooks = books.sort((a, b) => {
    if (
      orderBy === "date" ||
      orderBy === "start_time" ||
      orderBy === "end_time"
    ) {
      return order === "asc"
        ? dayjs(a[orderBy]).unix() - dayjs(b[orderBy]).unix()
        : dayjs(b[orderBy]).unix() - dayjs(a[orderBy]).unix();
    } else {
      return order === "asc"
        ? a[orderBy] !== undefined &&
          b[orderBy] !== undefined &&
          a[orderBy] < b[orderBy]
          ? -1
          : 1
        : a[orderBy] !== undefined &&
          b[orderBy] !== undefined &&
          a[orderBy] > b[orderBy]
        ? -1
        : 1;
    }
  });

  const handleOpenModal = (rejectHistory: { reason: string }[]) => {
    setSelectedRejectHistory(rejectHistory);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRejectHistory(null);
  };

  if (loading) {
    return <PageContainer>Loading...</PageContainer>;
  }

  return (
    <PageContainer>
      <div className="p-4">
        <div className="p-4">
          <h1 className="text-maincolor text-xl">รายการจองของคุณ</h1>
        </div>

        <TableContainer
          component={Paper}
          style={{ overflowX: "auto" }}
          className="h-full"
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => handleRequestSort("id")}
                  >
                    Booking ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "room_name"}
                    direction={orderBy === "room_name" ? order : "asc"}
                    onClick={() => handleRequestSort("room_name")}
                  >
                    Room Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "account_name"}
                    direction={orderBy === "account_name" ? order : "asc"}
                    onClick={() => handleRequestSort("account_name")}
                  >
                    Account Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "title"}
                    direction={orderBy === "title" ? order : "asc"}
                    onClick={() => handleRequestSort("title")}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "reason"}
                    direction={orderBy === "reason" ? order : "asc"}
                    onClick={() => handleRequestSort("reason")}
                  >
                    Reason
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "tel"}
                    direction={orderBy === "tel" ? order : "asc"}
                    onClick={() => handleRequestSort("tel")}
                  >
                    Contact
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleRequestSort("date")}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "start_time"}
                    direction={orderBy === "start_time" ? order : "asc"}
                    onClick={() => handleRequestSort("start_time")}
                  >
                    Start Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "end_time"}
                    direction={orderBy === "end_time" ? order : "asc"}
                    onClick={() => handleRequestSort("end_time")}
                  >
                    End Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>Confirmed By</TableCell>{" "}
                <TableCell
                  style={{
                    position: "sticky",
                    right: 245,
                    background: "white",
                    padding: 20,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{
                    position: "sticky",
                    right: 125,
                    background: "white",
                    padding: 20,
                  }}
                >
                  Reject Reasons
                </TableCell>
                <TableCell
                  style={{ position: "sticky", right: 0, background: "white" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.room_name}</TableCell>
                  <TableCell>{book.account_name}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>
                    <Tooltip title={book.reason}>
                      <Typography noWrap>{book.reason}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{book.tel}</TableCell>
                  <TableCell>
                    {dayjs(book.date).utc().format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {dayjs(book.start_time).utc().format("HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {dayjs(book.end_time).utc().format("HH:mm:ss")}
                  </TableCell>

                  <TableCell>{book.confirmed_by}</TableCell>
                  <TableCell
                    style={{
                      color:
                        book.status === BookingStatusList[0]
                          ? "#F3A51D"
                          : book.status === BookingStatusList[1]
                          ? "#5FA13F"
                          : book.status === BookingStatusList[2]
                          ? "#E54444"
                          : colors.grey[500], // Default color for the fourth status
                      position: "sticky",
                      right: 245,
                      background: "white",
                      padding: 20,
                    }}
                  >
                    {book.status}
                  </TableCell>
                  <TableCell
                    style={{
                      position: "sticky",
                      right: 125,
                      background: "white",
                      padding: 20,
                    }}
                  >
                    {book.reject_historys && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleOpenModal(book.reject_historys || [])
                        }
                        disabled={book.reject_historys?.length === 0}
                      >
                        Details
                      </Button>
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      position: "sticky",
                      right: 0,
                      background: "white",
                    }}
                  >
                    {book.status === "REJECTED" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedBooking({
                            ...book,
                            confirmed_by:
                              accountData?.userData.cmuitaccount ?? null,
                          });
                          setResubmitModalOpen(true);
                        }}
                      >
                        Resubmit
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedBooking({
                            ...book,
                            confirmed_by:
                              accountData?.userData.cmuitaccount ?? null,
                          });
                          setResubmitModalOpen(true);
                        }}
                        disabled={true}
                      >
                        Resubmit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedBooking && (
          <ResubmitBookingModal
            isOpen={isResubmitModalOpen}
            onClose={() => {
              setResubmitModalOpen(false);
              fetchData();
            }}
            BookingFormData={selectedBooking}
            booking_interval_minutes={
              rooms?.find((room) => room.id === selectedBooking?.room_id)
                ?.booking_interval_minutes ?? 0
            }
            open_time={
              rooms?.find((room) => room.id === selectedBooking?.room_id)
                ?.open_time ?? "00:00:00"
            }
            close_time={
              rooms?.find((room) => room.id === selectedBooking?.room_id)
                ?.close_time ?? "00:00:00"
            }
          />
        )}

        {selectedRejectHistory && (
          <RejectionHistoryModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            rejectHistory={selectedRejectHistory}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default HomePage;
