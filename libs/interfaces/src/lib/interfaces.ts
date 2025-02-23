import {
  USER_ROLES,
  ACTIVITY_ACTIONS,
} from '@employee-and-department-management-system/enums';

export interface IEmployee extends IBaseEntity {
  name: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
}

export interface IUser extends IBaseEntity {
  username: string;
  email: string;
  password: string;
  role: USER_ROLES;
  name: IName;
  address: IAddress;
}

export interface IActivityLog extends IBaseEntity {
  employee_id: string;
  action: ACTIVITY_ACTIONS;
}

export interface IDepartment extends IBaseEntity {
  name: string;
  description: string;
}

export interface IBaseEntity {
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
