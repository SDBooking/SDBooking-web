import React, { useEffect, useState } from "react";
import { User } from "../../../types";
import {
  GetAllAccount,
  GetAllStudentRequests,
} from "../../../common/apis/account/queries";
import { Box, Typography, Paper } from "@mui/material";
import { StudentRoleRequest } from "../../../types/student_request_role";

const AccountBox: React.FC = () => {
  const [accountData, setAccountData] = useState<User[] | null>(null);
  const [studentRequestData, setStudentRequestData] =
    useState<StudentRoleRequest[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await GetAllAccount();
        setAccountData(Array.isArray(response.result) ? response.result : []); // Ensure result is an array
      } catch (err) {
        setError("Failed to fetch account data");
      } finally {
        setLoading(false);
      }
    };
    const fetchStudentRequestData = async () => {
      try {
        const response = await GetAllStudentRequests();
        setStudentRequestData(
          Array.isArray(response.result) ? response.result : []
        );
      } catch (err) {
        setError("Failed to fetch student request data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentRequestData();
    fetchAccountData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.log(studentRequestData);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="body1" gutterBottom className="p-2">
        บัญชีผู้ใช้ทั้งหมดในระบบ
      </Typography>
      {accountData && accountData.length > 0 ? (
        accountData.map((account, index) => (
          <Paper
            key={account.cmuitaccount || index}
            elevation={3}
            className="flex flex-row p-4 gap-4 m-2 w-2/3"
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {account.cmuitaccount}
              </Typography>
              <Typography variant="body2">
                {account.firstname} {account.lastname}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                color:
                  account.role === "ADMIN"
                    ? "red"
                    : account.role === "EMPLOYEE"
                    ? "blue"
                    : "green",
              }}
            >
              {account.role == "STUDENT" ? "APPROVED STUDENT" : account.role}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography>No accounts found</Typography>
      )}
      <div className="my-4" />
      <Typography variant="body1" gutterBottom className="p-2">
        นักศึกษาที่ส่งคำขอใช้งานระบบ
      </Typography>
      {studentRequestData && studentRequestData.length > 0 ? (
        studentRequestData.map((account, index) => (
          <Paper
            key={account.cmuitaccount || index}
            elevation={3}
            className="flex flex-row p-4 gap-4 m-2 w-2/3"
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {account.cmuitaccount}
              </Typography>
              <Typography variant="body2">{account.name}</Typography>
            </Box>
            <Typography variant="body2">
              {new Date(account.updated_at).toLocaleDateString()}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography>No accounts found</Typography>
      )}
    </Box>
  );
};

export default AccountBox;
