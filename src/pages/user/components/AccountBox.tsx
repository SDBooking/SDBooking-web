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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { roleNameMappingToTH } from "../../room/scripts/roleNameMappingToTH";

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
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string[]>([]);

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

  const aggregatedAccounts: {
    [key: string]: { roles: Set<string>; [key: string]: any };
  } = {};

  accountData?.forEach((account) => {
    if (!aggregatedAccounts[account.cmuitaccount]) {
      aggregatedAccounts[account.cmuitaccount] = {
        ...account,
        roles: new Set(),
      };
    }
    const roles = systemAccountRole
      ?.filter((role) => role.account_id === account.cmuitaccount)
      .map((role) => systemRoles?.find((r) => r.id === role.role_id)?.role)
      .filter((role) => role) as string[];

    roles.forEach((role) => {
      aggregatedAccounts[account.cmuitaccount].roles.add(role);
    });
  });

  // Filter accounts based on search query and selected roles
  const filteredAccounts = Object.values(aggregatedAccounts).filter(
    (account) => {
      const matchesSearchQuery = account.firstname
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRoleFilter =
        selectedRoleFilter.length === 0 ||
        Array.from(account.roles).some((role) =>
          selectedRoleFilter.includes(role)
        );
      return matchesSearchQuery && matchesRoleFilter;
    }
  );

  console.log(aggregatedAccounts);

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
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRoleFilter.length === 0}
                onChange={() => setSelectedRoleFilter([])}
              />
            }
            label={<em>All Roles</em>}
          />
          {systemRoles?.map((role) => (
            <FormControlLabel
              key={role.id}
              control={
                <Checkbox
                  checked={selectedRoleFilter.includes(role.role)}
                  onChange={() => {
                    if (selectedRoleFilter.includes(role.role)) {
                      setSelectedRoleFilter(
                        selectedRoleFilter.filter((r) => r !== role.role)
                      );
                    } else {
                      setSelectedRoleFilter([...selectedRoleFilter, role.role]);
                    }
                  }}
                />
              }
              label={roleNameMappingToTH(role.role)}
            />
          ))}
        </FormGroup>
      </div>

      {/* Desktop Table */}
      <TableContainer
        component={Paper}
        className="overflow-x-auto h-full hidden md:block"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>ชื่อ-สกุล</TableCell>
              <TableCell>อัพเดทล่าสุด</TableCell>
              <TableCell>ตำแหน่งทั้งหมด</TableCell>
              <TableCell>แก้ไข</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account, index) => (
              <TableRow key={account.cmuitaccount || index}>
                <TableCell>
                  <Typography
                    variant="body2"
                    className="font-semibold truncate"
                    title={account.cmuitaccount}
                  >
                    {account.cmuitaccount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    className="truncate"
                    title={`${account.firstname} ${account.lastname}`}
                  >
                    {account.firstname} {account.lastname}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(account.updated_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  {account.roles.size > 0
                    ? Array.from(account.roles).map((role, index) => (
                        <Box
                          key={index}
                          component="span"
                          className="bg-gray-200 rounded px-2 py-1 mr-1"
                        >
                          {roleNameMappingToTH(role)}
                        </Box>
                      ))
                    : "No roles assigned"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleOpenDialog(account.cmuitaccount)}
                  >
                    Edit
                  </Button>
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
              <TableCell>บัญชีผู้ใช้ทั้งหมดในระบบ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account, index) => (
              <TableRow key={account.cmuitaccount || index}>
                <TableCell>
                  <table className="table-auto w-full">
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">
                          <strong>Account</strong>
                        </td>
                        <td className="border px-4 py-2">
                          {account.cmuitaccount}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">
                          <strong>ชื่อ-สกุล</strong>
                        </td>
                        <td className="border px-4 py-2">
                          {account.firstname} {account.lastname}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">
                          <strong>อัพเดทล่าสุด</strong>
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(account.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">
                          <strong>ตำแหน่งทั้งหมด</strong>
                        </td>
                        <td className="border px-4 py-2">
                          {account.roles.size > 0
                            ? Array.from(account.roles).map((role, index) => (
                                <Box
                                  key={index}
                                  component="span"
                                  className="bg-gray-200 rounded px-2 py-1 mr-1"
                                >
                                  {role}
                                </Box>
                              ))
                            : "No roles assigned"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2" colSpan={2}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() =>
                              handleOpenDialog(account.cmuitaccount)
                            }
                            className="mt-2"
                          >
                            Edit
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
                    {roleNameMappingToTH(role.role)}{" "}
                    {["ADMIN", "STUDENT", "EMPLOYEE"].includes(role.role) && (
                      <Box
                        component="span"
                        className="bg-gray-200 rounded px-2 py-1 ml-1"
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
        <DialogTitle>จัดการตำแหน่งของผู้ใช้</DialogTitle>
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
                  label={roleNameMappingToTH(role.role)}
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
