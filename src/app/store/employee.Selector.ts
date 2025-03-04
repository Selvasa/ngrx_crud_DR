import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EmployeeModel } from "./employee.Model";

const getEmployeeState = createFeatureSelector<EmployeeModel>('emp');

export const getEmpList =createSelector(getEmployeeState,(state)=> state.list);
export const selectEmployee =createSelector(getEmployeeState,(state)=> state.empobj);