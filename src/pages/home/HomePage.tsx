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
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useAccountContext from "../../common/contexts/AccountContext";
import ResubmitBookingModal from "./components/RenewRejectBook";
import BookingDetailsViewDialog from "../calendar/components/BookingDetailViewDialog";
import { Room } from "../../types/room";
import { GetAllRooms } from "../../common/apis/room/queries";
import { getStatusInThai } from "./scripts/StatusMapping";

dayjs.extend(utc);

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Booking>("id");
  const [isResubmitModalOpen, setResubmitModalOpen] = useState<boolean>(false);
  const [selectedBooking] = useState<BookingUpdateModel | null>(null);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false); // State for details dialog
  const [selectedBookingDetails, setSelectedBookingDetails] =
    useState<Booking | null>(null); // State for selected booking details
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

  const handleOpenDetailsDialog = (booking: Booking) => {
    setSelectedBookingDetails(booking);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedBookingDetails(null);
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

        {/* Desktop Table */}
        <TableContainer
          component={Paper}
          className="overflow-x-auto h-full hidden md:block"
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
                    รหัสการจองห้อง
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "room_name"}
                    direction={orderBy === "room_name" ? order : "asc"}
                    onClick={() => handleRequestSort("room_name")}
                  >
                    ชื่อห้อง
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "title"}
                    direction={orderBy === "title" ? order : "asc"}
                    onClick={() => handleRequestSort("title")}
                  >
                    หัวข้อการจอง
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleRequestSort("date")}
                  >
                    วัน
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "start_time"}
                    direction={orderBy === "start_time" ? order : "asc"}
                    onClick={() => handleRequestSort("start_time")}
                  >
                    เวลา
                  </TableSortLabel>
                </TableCell>
                <TableCell className="sticky right-32 bg-white p-5">
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    สถานะการจอง
                  </TableSortLabel>
                </TableCell>
                <TableCell className="sticky right-0 bg-white p-5">
                  รายละเอียดการจอง
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.room_name}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>
                    {dayjs(book.date).utc().format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>{`${dayjs(book.start_time)
                    .utc()
                    .format("HH:mm")} - ${dayjs(book.end_time)
                    .utc()
                    .format("HH:mm")}`}</TableCell>
                  <TableCell
                    className="sticky right-32 bg-white p-5"
                    style={{
                      color:
                        book.status === BookingStatusList[0]
                          ? "#F3A51D"
                          : book.status === BookingStatusList[1]
                          ? "#5FA13F"
                          : book.status === BookingStatusList[2]
                          ? "#E54444"
                          : colors.grey[500], // Default color for the fourth status
                    }}
                  >
                    {getStatusInThai(book.status)}
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white p-5">
                    {book && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDetailsDialog(book)}
                        disabled={!book}
                      >
                        Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Mobile Table */}
        <TableContainer
          component={Paper}
          className="overflow-x-auto h-full md:hidden"
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>รายการจองของคุณ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <table className="table-auto w-full">
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2">
                            <strong>รหัสการจองห้อง</strong>
                          </td>
                          <td className="border px-4 py-2">{book.id}</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">
                            <strong>ชื่อห้อง</strong>
                          </td>
                          <td className="border px-4 py-2">{book.room_name}</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">
                            <strong>หัวข้อการจอง</strong>
                          </td>
                          <td className="border px-4 py-2">{book.title}</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">
                            <strong>วัน</strong>
                          </td>
                          <td className="border px-4 py-2">
                            {dayjs(book.date).utc().format("YYYY-MM-DD")}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">
                            <strong>เวลา</strong>
                          </td>
                          <td className="border px-4 py-2">{`${dayjs(
                            book.start_time
                          )
                            .utc()
                            .format("HH:mm")} - ${dayjs(book.end_time)
                            .utc()
                            .format("HH:mm")}`}</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">
                            <strong>สถานะ</strong>
                          </td>
                          <td
                            className="border px-4 py-2"
                            style={{
                              color:
                                book.status === BookingStatusList[0]
                                  ? "#F3A51D"
                                  : book.status === BookingStatusList[1]
                                  ? "#5FA13F"
                                  : book.status === BookingStatusList[2]
                                  ? "#E54444"
                                  : colors.grey[500],
                            }}
                          >
                            {getStatusInThai(book.status)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2" colSpan={2}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenDetailsDialog(book)}
                              disabled={!book}
                              className="mt-2"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

        {selectedBookingDetails && (
          <BookingDetailsViewDialog
            isOpen={isDetailsDialogOpen}
            onClose={handleCloseDetailsDialog}
            selectedBooking={selectedBookingDetails}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default HomePage;
