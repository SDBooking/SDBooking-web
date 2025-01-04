import React, { useEffect, useState } from "react";
import { User } from "../../../types";
import { GetAllAccount } from "../../../common/apis/account/queries";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { SystemAccountRole } from "../../../types/sys_account_role";
import { GetAllSystemAccountRoles } from "../../../common/apis/system/system_account_role/queries";
import { SystemRole } from "../../../types/sys_role";
import { GetAllSystemRoles } from "../../../common/apis/system/system_role/queries";
import {
  CreateSystemAccountRole,
  DeleteSystemAccountRoleByRoleIDAndCMUITAccount,
} from "../../../common/apis/system/system_account_role/manipulates";
import {
  CreateSystemRole,
  UpdateSystemRole,
  DeleteSystemRole,
} from "../../../common/apis/system/system_role/manipulates";
import toast from "react-hot-toast";

const AccountBox: React.FC = () => {
  const [accountData, setAccountData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [systemAccountRole, setSystemAccountRole] =
    useState<SystemAccountRole[]>();
  const [systemRoles, setSystemRoles] = useState<SystemRole[]>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [newRoleName, setNewRoleName] = useState<string>("");
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRoleName, setEditRoleName] = useState<string>("");

  const fetchData = async () => {
    try {
      const [accountResponse, systemAccountRoleResponse, systemRoleResponse] =
        await Promise.all([
          GetAllAccount(),
          GetAllSystemAccountRoles(),
          GetAllSystemRoles(),
        ]);

      setAccountData(
        Array.isArray(accountResponse.result) ? accountResponse.result : []
      );
      setSystemAccountRole(
        Array.isArray(systemAccountRoleResponse.result)
          ? systemAccountRoleResponse.result
          : []
      );
      setSystemRoles(
        Array.isArray(systemRoleResponse.result)
          ? systemRoleResponse.result
          : []
      );
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (id: string) => {
    setSelectedAccount(id);
    setDialogOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }

    const isDuplicate = systemRoles?.some(
      (role) => role.role.toLowerCase() === newRoleName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Role name already exists");
      return;
    }

    try {
      await CreateSystemRole({ id: 0, role: newRoleName });
      setNewRoleName("");
      fetchData();
    } catch (err) {
      toast.error("Failed to create role");
    }
  };

  const handleUpdateRole = async () => {
    if (!editRoleId) return;
    const roleToUpdate = systemRoles?.find(
      (role) => role.id === Number(editRoleId)
    );
    if (
      roleToUpdate &&
      ["ADMIN", "STUDENT", "EMPLOYEE"].includes(roleToUpdate.role)
    ) {
      toast.error("Cannot edit this role");
      return;
    }
    try {
      await UpdateSystemRole({
        id: Number(editRoleId),
        role: editRoleName,
      });
      setEditRoleId(null);
      setEditRoleName("");
      fetchData();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteRole = async (id: number) => {
    const roleToDelete = systemRoles?.find((role) => role.id === id);
    if (
      roleToDelete &&
      ["ADMIN", "STUDENT", "EMPLOYEE"].includes(roleToDelete.role)
    ) {
      toast.error("Cannot delete this role");
      return;
    }
    try {
      await DeleteSystemRole(id);
      fetchData();
    } catch (err) {
      toast.error("Failed to delete role");
    }
  };

  const handleRoleChange = async () => {
    if (!selectedAccount) return;

    const selectedRoles = systemRoles?.filter((role) => {
      const checkbox = document.getElementById(
        `role-checkbox-${role.id}`
      ) as HTMLInputElement;
      return checkbox?.checked;
    });

    const unselectedRoles = systemRoles?.filter((role) => {
      const checkbox = document.getElementById(
        `role-checkbox-${role.id}`
      ) as HTMLInputElement;
      return !checkbox?.checked;
    });

    try {
      // Remove unselected roles from the account
      if (unselectedRoles) {
        for (const role of unselectedRoles) {
          await DeleteSystemAccountRoleByRoleIDAndCMUITAccount(
            role.id,
            selectedAccount
          );
        }
      }

      // Add selected roles to the account without duplication
      if (selectedRoles) {
        for (const role of selectedRoles) {
          const existingRole = systemAccountRole?.find(
            (accountRole) =>
              accountRole.account_id === selectedAccount &&
              accountRole.role_id === role.id
          );
          if (!existingRole) {
            await CreateSystemAccountRole({
              account_id: selectedAccount,
              role_id: role.id,
            });
          }
        }
      }

      fetchData();
      setDialogOpen(false);
    } catch (err) {
      toast.error("Failed to update account roles");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Group accounts by role
  const accountsByRole: { [key: string]: User[] } = {};
  accountData?.forEach((account) => {
    const roles = systemAccountRole
      ?.filter((role) => role.account_id === account.cmuitaccount)
      .map((role) => systemRoles?.find((r) => r.id === role.role_id)?.role)
      .filter((role) => role) as string[];

    roles.forEach((role) => {
      if (!accountsByRole[role]) {
        accountsByRole[role] = [];
      }
      accountsByRole[role].push(account);
    });
  });

  return (
    <div className="min-w-full p-4">
      <Typography variant="body1" gutterBottom className="p-2">
        บัญชีผู้ใช้ทั้งหมดในระบบ
      </Typography>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <TextField
          label="ค้นหาชื่อ"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/2"
        />
      </div>

      {Object.keys(accountsByRole).length > 0 ? (
        Object.keys(accountsByRole).map((role) => (
          <div key={role}>
            <Typography variant="h6" gutterBottom className="p-2">
              {role}
            </Typography>
            <Grid container spacing={2}>
              {accountsByRole[role]
                .filter((account) =>
                  account.firstname
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((account, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={account.cmuitaccount || index}
                  >
                    <Paper elevation={3} className="p-4">
                      <Box className="flex flex-col gap-2">
                        <Typography
                          variant="body2"
                          className="font-semibold truncate"
                          title={account.cmuitaccount}
                        >
                          {account.cmuitaccount}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="truncate"
                          title={`${account.firstname} ${account.lastname}`}
                        >
                          {account.firstname} {account.lastname}
                        </Typography>
                        <Typography variant="body2">
                          {new Date(account.updated_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Roles:{" "}
                          {systemAccountRole
                            ?.filter(
                              (role) => role.account_id === account.cmuitaccount
                            )
                            .map((role) => {
                              const roleName = systemRoles?.find(
                                (r) => r.id === role.role_id
                              )?.role;
                              return (
                                <Box
                                  key={role.role_id}
                                  component="span"
                                  sx={{
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: "4px",
                                    padding: "2px 4px",
                                    marginRight: "4px",
                                  }}
                                >
                                  {roleName}
                                </Box>
                              );
                            }) || "No roles assigned"}
                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleOpenDialog(account.cmuitaccount)}
                          className="mt-2"
                        >
                          Edit
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </div>
        ))
      ) : (
        <Paper elevation={3} className="p-4 mt-4">
          <Typography>No accounts found</Typography>
        </Paper>
      )}

      <div className="my-4" />
      <Typography variant="body1" gutterBottom className="p-2">
        ระบบจัดการตำแหน่งของผู้ใช้สำหรับให้สิทธิ์การใช้งานห้อง (เพิ่ม/แก้ไข/ลบ)
      </Typography>
      <Box className="flex flex-col gap-4 mb-4">
        <TextField
          label="เพิ่มตำแหน่งใหม่"
          variant="outlined"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          className="w-full"
        />
        <Button variant="contained" color="primary" onClick={handleCreateRole}>
          สร้างตำแหน่งใหม่
        </Button>
      </Box>
      {systemRoles && systemRoles.length > 0 ? (
        <Grid container spacing={2}>
          {systemRoles.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <Paper elevation={3} className="p-4">
                <Box className="flex flex-col gap-2">
                  <Typography
                    variant="body2"
                    className="font-semibold text-center"
                  >
                    {role.role}{" "}
                    {["ADMIN", "STUDENT", "EMPLOYEE"].includes(role.role) && (
                      <Box
                        component="span"
                        sx={{
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px",
                          padding: "2px 4px",
                          marginLeft: "4px",
                        }}
                      >
                        Default
                      </Box>
                    )}
                  </Typography>
                  {!["ADMIN", "STUDENT", "EMPLOYEE"].includes(role.role) && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        if (role.id !== undefined) {
                          setEditRoleId(role.id.toString());
                        }
                        setEditRoleName(role.role);
                      }}
                      className="mt-2"
                      disabled={["ADMIN", "STUDENT", "EMPLOYEE"].includes(
                        role.role
                      )}
                    >
                      แก้ไขชื่อตำแหน่ง
                    </Button>
                  )}
                  {!["ADMIN", "STUDENT", "EMPLOYEE"].includes(role.role) && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        role.id !== undefined && handleDeleteRole(role.id)
                      }
                      className="mt-2"
                    >
                      ลบตำแหน่ง
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={3} className="p-4 mt-4">
          <Typography>ไม่มีตำแหน่งในระบบ</Typography>
        </Paper>
      )}

      <Dialog open={!!editRoleId} onClose={() => setEditRoleId(null)}>
        <DialogTitle>แก้ไขตำแหน่ง</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            variant="outlined"
            value={editRoleName}
            onChange={(e) => setEditRoleName(e.target.value)}
            className="w-full"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRoleId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateRole} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Manage Account Roles</DialogTitle>
        <DialogContent>
          {systemRoles && systemRoles.length > 0 ? (
            <FormGroup>
              {systemRoles.map((role) => (
                <FormControlLabel
                  key={role.id}
                  control={
                    <Checkbox
                      id={`role-checkbox-${role.id}`}
                      defaultChecked={systemAccountRole?.some(
                        (accountRole) =>
                          accountRole.account_id === selectedAccount &&
                          accountRole.role_id === role.id
                      )}
                    />
                  }
                  label={role.role}
                />
              ))}
            </FormGroup>
          ) : (
            <Typography>No roles found</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRoleChange} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountBox;
