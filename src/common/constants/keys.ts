export const enum LocalStorageKey {
  Auth = "auth",
}

export const enum ApiRouteKey {
  SignIn = "/oauth",
  SignOut = "/oauth/signout",
  Me = "/oauth/me",
  Room = "/room",
  Booking = "/booking",
  RoomService = "/room_service",
  RoomType = "/room_type",
  RoomLocation = "/room_location",
  RoomFacility = "/room_facility",
  RoomAuthorization = "/room_authorization",
  RoomAuthorizationAccount = "room_authorization_account",
  Account = "/account",
  SystemRole = "/sys_role",
  SystemAccountRole = "/sys_account_role",
}

export const enum ClientRouteKey {
  Home = "/",
  Book = "/book",
  Calendar = "/calendar",
  History = "/history",
  Profile = "/profile",
  Login = "/login",
  OAuth = "/cmuOAuthCallback",
  Setting = "/setting",
  RoomManagement = "/room-management",
  RoomManipulate = "/room-management/manipulate",
  RoomUpdate = "/room-management/update",
  UserSetting = "/user-setting",
}

export const enum AuthKey {
  StudentAuth = "STUDENT",
  EmployeeAuth = "EMPLOYEE",
  AdminAuth = "ADMIN",
  Both = "Both",
}
