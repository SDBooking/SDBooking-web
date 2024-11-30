import React, { useEffect, useState } from "react";
import { User, Role } from "../../../types";
import {
  GetAllAccount,
  GetAllStudentRequests,
} from "../../../common/apis/account/queries";
import {
  ApproveStudent,
  UpdateAccountRole,
} from "../../../common/apis/account/manipulates";
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { StudentRoleRequest } from "../../../types/student_request_role";

const AccountBox: React.FC = () => {
  const [accountData, setAccountData] = useState<User[] | null>(null);
  const [studentRequestData, setStudentRequestData] =
    useState<StudentRoleRequest[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: Role }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveStudent = async (id: string) => {
    try {
      await ApproveStudent(id);
      fetchData();
    } catch (err) {
      setError("Failed to approve student request");
    }
  };

  const handleUpdateAccountRole = async () => {
    if (selectedAccount) {
      try {
        const role = selectedRoles[selectedAccount];
        if (role) {
          await UpdateAccountRole(selectedAccount, role);
          fetchData();
        }
      } catch (err) {
        setError("Failed to update account role");
      } finally {
        setDialogOpen(false);
        setSelectedAccount(null);
      }
    }
  };

  const handleRoleChange = (id: string, role: Role) => {
    setSelectedRoles((prev) => ({ ...prev, [id]: role }));
  };

  const handleOpenDialog = (id: string) => {
    setSelectedAccount(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAccount(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="body1" gutterBottom className="p-2">
        บัญชีผู้ใช้ทั้งหมดในระบบ
      </Typography>
      {accountData && accountData.length > 0 ? (
        <Grid container spacing={2}>
          {accountData.map((account, index) => (
            <Grid item xs={6} md={6} key={account.cmuitaccount || index}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {account.cmuitaccount}
                  </Typography>
                  <Typography variant="body2">
                    {account.firstname} {account.lastname}
                  </Typography>
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
                    {account.role == "STUDENT"
                      ? "APPROVED STUDENT"
                      : account.role}
                  </Typography>
                  <Select
                    value={selectedRoles[account.cmuitaccount] || account.role}
                    onChange={(e) =>
                      handleRoleChange(
                        account.cmuitaccount,
                        e.target.value as Role
                      )
                    }
                    sx={{ marginTop: 1 }}
                  >
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                    <MenuItem value="STUDENT">STUDENT</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(account.cmuitaccount)}
                    sx={{ marginTop: 1 }}
                  >
                    Update
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography>No account found</Typography>
        </Paper>
      )}
      <div className="my-4" />
      <Typography variant="body1" gutterBottom className="p-2">
        นักศึกษาที่ส่งคำขอใช้งานระบบ
      </Typography>
      {studentRequestData && studentRequestData.length > 0 ? (
        <Grid container spacing={2}>
          {studentRequestData.map((account, index) => (
            <Grid item xs={6} md={6} key={account.cmuitaccount || index}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {account.cmuitaccount}
                  </Typography>
                  <Typography variant="body2">
                    {account.firstname} {account.lastname}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(account.updated_at).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApproveStudent(account.cmuitaccount)}
                    sx={{ marginTop: 1 }}
                  >
                    Approve
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography>No student requests found</Typography>
        </Paper>
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"ยืนยันการอัพเดท Role"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {selectedAccount &&
            accountData?.find(
              (account) => account.cmuitaccount === selectedAccount
            )?.role === "ADMIN" && (
              <Typography color="error" variant="body2">
                คุณคือ Admin โปรดระมัดระวังการเปลี่ยนแปลง Role ของตนเอง
              </Typography>
            )}
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            ยกเลิก
          </Button>
          <Button
            onClick={handleUpdateAccountRole}
            color="success"
            variant="contained"
            autoFocus
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountBox;
