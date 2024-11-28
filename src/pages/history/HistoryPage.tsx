import React, { useEffect, useState } from "react";
import PageContainer from "../../common/components/container/PageContainer";
import { Booking, BookingStatusList } from "../../types/booking";
import {
  GetAllBooks,
  GetBookByAccountId,
} from "../../common/apis/booking/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TableSortLabel,
  colors,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useAccountContext from "../../common/contexts/AccountContext";
import RejectionHistoryModal from "./components/RejectionHistoryModal";

dayjs.extend(utc);

type Order = "asc" | "desc";

const HistoryPage: React.FC = () => {
  const [books, setBooks] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Booking>("id");
  const [selectedRejectHistory, setSelectedRejectHistory] = useState<
    { reason: string }[] | null
  >(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { accountData } = useAccountContext();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (accountData?.isAdmin) {
          const bookResponse = await GetAllBooks();
          if (Array.isArray(bookResponse.result)) {
            setBooks(bookResponse.result);
          }
        } else {
          if (accountData?.userData.cmuitaccount) {
            const bookResponse = await GetBookByAccountId(
              accountData.userData.cmuitaccount
            );
            if (Array.isArray(bookResponse.result)) {
              setBooks(bookResponse.result);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleRequestSort = (property: keyof Booking) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBooks = books.sort((a, b) => {
    if ((a[orderBy] ?? "") < (b[orderBy] ?? "")) {
      return order === "asc" ? -1 : 1;
    }
    if ((a[orderBy] ?? "") > (b[orderBy] ?? "")) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
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
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <div className="flex flex-row gap-2 mb-4">
        <img src="/imgs/history.svg" />
        <Typography variant="h5" color="primary">
          ประวัติการจองห้อง
        </Typography>
      </div>

      <div className="p-4">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === "id" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => handleRequestSort("id")}
                  >
                    Booking ID
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "room_name" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "room_name"}
                    direction={orderBy === "room_name" ? order : "asc"}
                    onClick={() => handleRequestSort("room_name")}
                  >
                    Room Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "title" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "title"}
                    direction={orderBy === "title" ? order : "asc"}
                    onClick={() => handleRequestSort("title")}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "reason" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "reason"}
                    direction={orderBy === "reason" ? order : "asc"}
                    onClick={() => handleRequestSort("reason")}
                  >
                    Reason
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "tel" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "tel"}
                    direction={orderBy === "tel" ? order : "asc"}
                    onClick={() => handleRequestSort("tel")}
                  >
                    Tel
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "date" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleRequestSort("date")}
                  >
                    Date/Time
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "status" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Reject Reasons</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.room_name}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.reason}</TableCell>
                  <TableCell>{book.tel}</TableCell>
                  <TableCell>
                    {dayjs(book.date).utc().format("YYYY-MM-DD")}{" "}
                    {dayjs(book.start_time).utc().format("HH:mm:ss:A")} -{" "}
                    {dayjs(book.end_time).utc().format("HH:mm:ss:A")}
                  </TableCell>
                  <TableCell>
                    <Typography
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
                      {book.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {selectedRejectHistory && (
            <RejectionHistoryModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              rejectHistory={selectedRejectHistory}
            />
          )}
        </TableContainer>
      </div>
    </PageContainer>
  );
};

export default HistoryPage;
