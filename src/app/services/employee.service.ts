import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/employee';

  getAllEmployee() {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  postEmployee(payLoad: Employee) {
    return this.http.post(this.apiUrl, payLoad);
  }

  getEmployee(empId: number) {
    return this.http.get<Employee>(this.apiUrl + '/' + empId);
  }

  updateEmployee(payLoad: Employee) {
    return this.http.put(this.apiUrl + '/' + payLoad?.id, payLoad);
  }

  deleteEmployee(empId: number) {
    return this.http.delete(this.apiUrl + '/' + empId);
  }

}
