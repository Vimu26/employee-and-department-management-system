import {
  USER_ROLES,
  ACTIVITY_ACTIONS,
  JOB_POSITION,
  DEPARTMENT_TYPE,
  DB_COLLECTION_NAMES,
  EMPLOYEE_STATUS,
  CHIP_TYPES,
} from '@employee-and-department-management-system/enums';
import { Types } from 'mongoose';

export interface IEmployee extends IBaseEntity {
  name: IName;
  address: IAddress;
  epf_no?: string;
  nic: string;
  employee_id: string;
  profile_pic?: string;
  status: EMPLOYEE_STATUS;
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
  profile_pic?: string; //file name of the profile picture
}

export type IUserOptional = Partial<IUser>;

export type IEmployeeOptional = Partial<IEmployee>;

export type IIdentity = Omit<IUser, 'password'>;

export interface ILogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: IIdentity;
  token: string;
}
export interface IActivityLog extends IBaseEntity {
  parent_id?: Types.ObjectId | string;
  action?: ACTIVITY_ACTIONS;
  model?: DB_COLLECTION_NAMES;
}

export type IOptionalActivityLogs = Partial<IActivityLog>;

export interface ILoggedUser {
  user_id: string | Types.ObjectId;
  token: string;
}

export interface IDepartment extends IBaseEntity {
  name: string;
  type: DEPARTMENT_TYPE;
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

export interface CommonResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
  count?: number;
}

export interface CommonCheckRequest {
  success: boolean;
  error: string;
}

export interface IFiles extends Document {
  _id?: Types.ObjectId;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
}

export interface chipData {
  label: string;
  type: CHIP_TYPES;
  key: string;
  value: string;
  placeHolder: string;
  options?: any[];
}
