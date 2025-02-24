import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { addEmployee, getEmployee, updateEmployee } from '../../store/employee.Actions';
import { selectEmployee } from '../../store/employee.Selector';

@Component({
  selector: 'app-add-employee',
  imports: [
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    TitleCasePipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  private service = inject(EmployeeService);
  private store = inject(Store);
  private ref = inject(MatDialogRef<AddEmployeeComponent>);
  private toast = inject(ToastrService);
  private destroyRef = inject(DestroyRef);
  data = inject(MAT_DIALOG_DATA) as any;

  title = signal<string>('Add Employee');
  dialogData: any;

  empForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    doj: new FormControl(new Date(), Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl(0, Validators.required),
  });

  ngOnInit() {
    this.dialogData = this.data;
    if (this.dialogData.code) {
      this.title.set('Edit Employee');
      this.store.dispatch(getEmployee({empId:this.dialogData.code}));
      this.store.select(selectEmployee).
      pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: Employee) => {
            if (!!res)
              this.empForm.patchValue(res);
          }
        })
    }
  }

  saveEmployee() {
    if (this.empForm.valid) {
      const payload: Employee = {
        id: this.empForm.value.id as number,
        name: this.empForm.value.name as string,
        doj: new Date(this.empForm.value.doj as Date),
        role: this.empForm.value.role as string,
        salary: this.empForm.value.salary as number
      }
      const code = this.dialogData.code;
      // const Update = this.service.updateEmployee(payload);
      // const Post = this.service.postEmployee(payload);
      // const apiEndpoint = code ? Update : Post;
      // apiEndpoint.subscribe(
      //   {
      //     next: () => {
      //       this.toast.success(code ? 'Employee Details Updated SuccesFully' : 'Employee Details Added SuccesFully' , 'SUCCESS');
      //       this.closePopup();
      //     }
      //   }
      // );

      const action = code ? updateEmployee({ data: payload }) : addEmployee({ data: payload });
      this.store.dispatch(action);
      this.closePopup();
    }
  }

  closePopup() {
    this.ref.close();
  }
}
