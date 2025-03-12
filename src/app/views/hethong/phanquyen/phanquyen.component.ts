import { AfterViewInit, Component, OnInit} from '@angular/core';
import { ButtonDirective } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectionModule,
  RowSelectionOptions,
} from 'ag-grid-community';
import { DataService } from '../../../core/services/data.service';
import { AgGridAngular } from 'ag-grid-angular';

import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,  
} from '@coreui/angular';

// Modal
import {
  ButtonCloseDirective, 
  ModalBodyComponent,
  ModalComponent, 
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  FormModule,
  GridModule
  
} from '@coreui/angular';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { FormControl, FormGroup } from '@angular/forms';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);
export interface UserRole {
  userId: any
roleId: any
userName: string
roleName: string
email: string
fullName: string

}

export interface Users {
  id: string
firstName: string
lastName: string
phoneNumber: string
userName: string
email: string
dob: string
roles: any
}

export interface Roles {
  id: string
  name: string
  description: string 
}

@Component({
  selector: 'app-phanquyen',
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    AgGridAngular, 
    FormsModule,
    ReactiveFormsModule,
    // Modal   
    
     ModalComponent, 
     ModalHeaderComponent, 
     ModalTitleDirective, 
     ThemeDirective, 
     ButtonCloseDirective, 
     ModalBodyComponent,   
    FormModule,
    GridModule
  ],
  templateUrl: './phanquyen.component.html',
  styleUrl: './phanquyen.component.scss'
})
export class PhanquyenComponent implements OnInit, AfterViewInit {
   private gridApi!: GridApi<UserRole>;
        data: UserRole[] = [];
        dsUser:Users[]=[];
        dsRole:Roles[]=[];
        Form!: FormGroup;
        userId='Hùng';
        roleId:any;
        public visible = false;
        dataDetail:any;
        constructor(
          private dataService: DataService,
          private toastr: ToastrService,
          private dialog: MatDialog
        ) {}
  ngOnInit(): void {
    this.loadData();
    this.initFormBuilder();
  }
  ngAfterViewInit(): void {
    this.loadDataUser();
    this.loadDataRoles();
    
  }
  loadDataUser() {
    this.dataService.get('/api/Users/getall').subscribe({
      next: (response: any) => {
        this.dsUser = response;        
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }
  loadDataRoles() {
    this.dataService.get('/api/Roles').subscribe({
      next: (response: any) => {
        this.dsRole = response;
        console.log(this.data);
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }
  private initFormBuilder() {
 
    this.Form = new FormGroup({
      userId: new FormControl({ value: null, disabled: false }),
      roleId: new FormControl({ value: null, disabled: false }),    
      
    });
  }
  saveForm(){
   
    const data=this.Form.value;  
   
    this.dataService
      .put('/api/UserRole/Create', data)
      .subscribe({
        next: (data) => {
          this.loadData();
          this.toastr.success(
            'Thêm thành công ' + data + ' bản ghi',
            'Success'
          );
        },
        error: () => {
          this.toastr.warning('Phải chọn danh sách cần lưu ', 'Warning');
        },
      });

  }
   rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
                mode: 'multiRow',
              };
              defaulColDef = {
                flex: 1,
                minWith: 100,
                minHight: 50,
              };
              onGridReady(params: GridReadyEvent<UserRole>) {
                this.gridApi = params.api;
              }
          
              onAddRow() {
                this.gridApi.applyTransaction({
                  add: [
                    {
                      userId: '',
                      roleId: '',
                      userName: '',
                      roleName: '',
                      email: '',
                      fullName: ''
                    },
                  ],
                  addIndex: 0,
                });
              }

              colDefs:ColDef[]=[

                { field: "userId",
                  headerName:"userId",
                  width:200,
                  headerCheckboxSelection:true,
                  checkboxSelection:true,
                  hide:true,
                cellRenderer:(item:any)=>{
                  return "guid:"+item.value
                }
                
                     },
            
              {field:'roleId',
              headerName:'RoleID',
              filter: 'agTextColumnFilter', 
              cellEditor: "agLargeTextCellEditor",
              hide:true,
              cellEditorPopup: true},
            
              {field:'fullName',
              headerName:'Họ tên',
              filter: 'agTextColumnFilter', 
              cellEditor: "agLargeTextCellEditor",              
              cellEditorPopup: true},
            
              {field:'userName',
              headerName:'Tài khoản',
              filter: 'agTextColumnFilter',  
              cellEditor: "agLargeTextCellEditor",
              cellEditorPopup: true},
            
              {field:'email',
              headerName:'Email',
              filter: 'agTextColumnFilter',
              cellEditor: "agLargeTextCellEditor",
              cellEditorPopup: true},
              
              {field:'roleName',
              headerName:'Quyền',
              filter: 'agTextColumnFilter', 
              cellEditor: "agLargeTextCellEditor",
              cellEditorPopup: true},
              
              ];

              loadData() {
                this.dataService.get('/api/UserRole/getAll').subscribe({
                  next: (response: any) => {
                    this.data = response;
                    console.log(this.data);
                  },
                  error: () => {
                    this.toastr.error('Lấy dữ liệu thất bại', 'Error');
                  },
                });
              }

              save() {
                const selectedRows = this.gridApi.getSelectedRows();
                this.dataService
                  .put('/api/UserRole/UpdateMultiple', selectedRows)
                  .subscribe({
                    next: (data) => {
                      this.loadData();
                      this.toastr.success(
                        'Thêm thành công ' + data + ' bản ghi',
                        'Success'
                      );
                    },
                    error: () => {
                      this.toastr.warning('Phải chọn danh sách cần lưu ', 'Warning');
                    },
                  });
              }
        
              confirmDelete() {
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                  data: {
                    name: 'Bán có muốn xóa bản ghi này?',
                  },
                });
            
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    const selectedRows = this.gridApi.getSelectedRows();
                    this.dataService
                      .post('/api/UserRole/DeleteMultipale', selectedRows)
                      .subscribe({
                        next: (data) => {
                          this.loadData();
                          this.toastr.success(
                            'Xóa thành công ' + data + ' bản ghi',
                            'Success'
                          );
                        },
                        error: () => {
                          this.toastr.error('Xóa bản ghi thất bại ', 'Error');
                        },
                      });
                  }
                });
              }

              toggleLive() {
                const selectedRows = this.gridApi.getSelectedRows();
                console.log(selectedRows)
                const id=selectedRows[0].userId;
                console.log(id)
                this.loadDataDetail(id)
                this.visible = !this.visible;
              }
            
              handleLiveDemoChange(event: any) {
                this.visible = event;
              }

              loadDataDetail(id:any) {
                  this.dataService.getById('/api/UserRole/' + id).subscribe({
                    next: (data: any) => {
                      this.dataDetail=data;
                      console.log(data)
                    },
                  });
                }

}
