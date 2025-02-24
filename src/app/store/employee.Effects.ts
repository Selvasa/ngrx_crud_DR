import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EmployeeService } from "../services/employee.service";
import {
    addEmployee,
    addEmployeeSuc,
    deleteEmployee,
    deleteEmployeeSuc,
    emptyAction,
    loadEmployee,
    loadEmployeeFail,
    loadEmployeeSuc,
    updateEmployee,
    updateEmployeeSuc
} from "./employee.Actions";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Employee } from "../model/employee";

@Injectable()
export class empEffect {
    private actions$ = inject(Actions);
    private service = inject(EmployeeService);
    private toastr = inject(ToastrService);

    _loadEmployee = createEffect(() =>
        this.actions$.pipe(
            ofType(loadEmployee),
            exhaustMap((action) => {
                return this.service.getAllEmployee().pipe(
                    map((data) => {
                        return loadEmployeeSuc({ list: data })
                    }),
                    catchError((err) => of(loadEmployeeFail({ errMsg: err.message })))
                )
            })
        ));

    _deleteEmployee = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteEmployee),
            switchMap((action) => {
                return this.service.deleteEmployee(action.empId).pipe(
                    switchMap((data) => {
                        return of(deleteEmployeeSuc({ empId: action.empId }),
                            this.showAlert('Employee Details Deleted Successfully', 'pass')
                        )
                    }),
                    catchError((err) => of(this.showAlert(err.message, 'fail')))
                )
            })
        ));

    _addEmployee = createEffect(() =>
        this.actions$.pipe(
            ofType(addEmployee),
            switchMap((action) => {
                return this.service.postEmployee(action.data).pipe(
                    switchMap((res: any) => {
                        return of(addEmployeeSuc({ data: res as Employee }),
                            this.showAlert('Employee Details Added Successfully', 'pass')
                        )
                    }),
                    catchError((err) => of(this.showAlert(err.message, 'fail')))
                )
            })
        ));

    _updateEmployee = createEffect(() =>
        this.actions$.pipe(
            ofType(updateEmployee),
            switchMap((action) => {
                return this.service.updateEmployee(action.data).pipe(
                    switchMap((data) => {
                        return of(updateEmployeeSuc({ data: action.data }),
                            this.showAlert('Employee Details Updated Successfully', 'pass')
                        )
                    }),
                    catchError((err) => of(this.showAlert(err.message, 'fail')))
                )
            })
        ));

    showAlert(message: string, respose: string) {
        if (respose == 'pass') {
            this.toastr.success(message);
        } else {
            this.toastr.error(message);
        }
        return emptyAction();
    }
}