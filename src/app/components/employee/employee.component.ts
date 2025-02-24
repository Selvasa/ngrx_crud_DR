import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { Employee } from '../../model/employee';
import { Store } from '@ngrx/store';
import { deleteEmployee, loadEmployee } from '../../store/employee.Actions';
import { getEmpList } from '../../store/employee.Selector';
// import { EmployeeService } from '../../services/employee.service';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  private dialog = inject(MatDialog);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  // private service = inject(EmployeeService);

  // private toastr = inject(ToastrService);

  empList: Employee[] = [];
  dataTable!: MatTableDataSource<Employee>;
  displayedColumns: string[] = ['id', 'name', 'role', 'doj', 'salary', 'actions']

  ngOnInit() {
    this.getAllEmployee();
  }

  addEmployee(empId: number = 0) {
    this.dialog.open(AddEmployeeComponent, {
      width: '50%',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: {
        'code': empId
      }
    })
    // .afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    //   next: () => this.getAllEmployee()
    // });
  }

  getAllEmployee() {
    this.store.dispatch(loadEmployee());
    this.store.select(getEmpList)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: Employee[]) => {
          this.empList = res;
          this.dataTable = new MatTableDataSource(this.empList);
        }
      })
  }

  editEmployee(id: number) {
    this.addEmployee(id);
  }

  deleteEmployee(data: number) {
    if (confirm('Are You Sure?')) {
      // this.service.deleteEmployee(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      //   next: () => {
      //     this.toastr.warning('Employee Details Deleted SuccessFully', 'Deleted');
      //     this.getAllEmployee();
      //   }
      // })

      this.store.dispatch(deleteEmployee({empId:data}));
    }
  }

}
