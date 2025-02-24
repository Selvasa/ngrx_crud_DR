import { Employee } from "../model/employee";

export interface EmployeeModel{
    list:Employee[],
    errormessage:string,
    empobj:Employee
}