import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class userQueryDto extends PartialType(CreateUserDto) {
  _id?: string;
  start? : number;
  size?:number
}