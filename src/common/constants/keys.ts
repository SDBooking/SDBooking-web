export const enum LocalStorageKey {
  Auth = "auth",
}

export const enum ApiRouteKey {
  SignIn = "/oauth",
  SignOut = "/oauth/signout",
  Me = "/oauth/me",
  Room = "/room",
  RoomService = "/room_service",
  RoomType = "/room_type",
  RoomLocation = "/room_location",
  RoomFacility = "/room_facility",
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
}

export const enum AuthKey {
  StudentAuth = "STUDENT",
  EmployeeAuth = "EMPLOYEE",
  AdminAuth = "ADMIN",
  Both = "Both",
}
