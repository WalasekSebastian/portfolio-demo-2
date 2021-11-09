export interface User {
  id: number;
  login: string;
  password: string;
  isAdmin: number;
  token: string;
  active: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notificationsSMS: number;
}

export interface UserSimply {
  id: number;
  name: string;
}

export interface UserWorks {
  id: number;
  name: string;
  date: Date;
  installName: string;
  timeWork: string;
  timeDuration: number;
  timeTravel: string;
}
