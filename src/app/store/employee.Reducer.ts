import { createReducer, on } from "@ngrx/store";
import { employeeState } from "./employee.State";
import { addEmployeeSuc, deleteEmployeeSuc, getEmployee, loadEmployeeFail, loadEmployeeSuc, updateEmployeeSuc } from "./employee.Actions";

const _employeeReducer = createReducer(employeeState,
    on(loadEmployeeSuc,(state,action)=>{
        return{
            ...state,
            list:action.list,
            errormessage:''
        }
    }),
    on(loadEmployeeFail,(state,action)=>{
        return{
            ...state,
            list:[],
            errormessage:action.errMsg
        }
    }),
    on(deleteEmployeeSuc,(state,action)=>{
        const _newValue = state.list.filter(o => o?.id != action.empId);
        return{
            ...state,
            list:_newValue,
            errormessage:''
        }
    }),
    on(addEmployeeSuc,(state,action)=>{
        const _newValue = {...action.data};
        return{
            ...state,
            list:[...state.list,_newValue],
            errormessage:''
        }
    }),
    on(updateEmployeeSuc,(state,action)=>{
        const _newValue = state?.list?.map(o=>{
            return o.id === action.data.id ? action.data : o
        });
        return{
            ...state,
            list:_newValue,
            errormessage:''
        }
    }),
    on(getEmployee,(state,action)=>{
        let _newValue = state?.list?.find((o)=> o.id == action.empId);
        if(_newValue == null){
            _newValue = state.empobj;
        }
        return{
            ...state,
            empobj:_newValue
        }
    }),
);

export function employeeReducer(state:any,action:any){
    return _employeeReducer(state,action);
}