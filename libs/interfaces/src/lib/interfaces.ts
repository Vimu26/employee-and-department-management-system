import {
  USER_ROLES,
  ACTIVITY_ACTIONS,
  JOB_POSITION,
  DEPARTMENT_TYPE,
} from '@employee-and-department-management-system/enums';
import { Types } from 'mongoose';

export interface IEmployee extends IBaseEntity {
  name: IName;
  address: IAddress;
  epf_no:string;
  employee_id : string;
  email: string;
  phone: string;
  position: JOB_POSITION;
  department_id: string;
}

export interface IUser extends IBaseEntity {
  username: string;
  email: string;
  password: string;
  role: USER_ROLES;
  name: IName;
  address: IAddress;
}

export type IUserOptional = Partial<IUser>;

export type IEmployeeOptional = Partial<IEmployee>;

export type IIdentity = Omit<IUser, 'password'>;

export interface AuthResponse {
  user: IIdentity;
  token: string;
}
export interface IActivityLog extends IBaseEntity {
  employee_id: string;
  action: ACTIVITY_ACTIONS;
}

export interface ILoggedUser {
  user_id: string | Types.ObjectId;
  token: string;
}

export interface IDepartment extends IBaseEntity {
  name: string;
  type : DEPARTMENT_TYPE;
  description?: string;
}

export interface IBaseEntity {
  _id?: Types.ObjectId | string;
  created_on?: Date;
  last_modified_on?: Date;
  created_by?: string;
  last_modified_by?: string;
}

export interface IName {
  first_name: string;
  last_name: string;
}

export interface IAddress {
  no: string;
  street1: string;
  street2?: string;
  city: string;
  province: string;
  country: string;
}
