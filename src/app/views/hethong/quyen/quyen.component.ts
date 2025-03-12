import { Component, OnInit } from '@angular/core';
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
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

export interface Roles {
  id: string
  name: string
  description: string 
}

@Component({
  selector: 'app-quyen',
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    AgGridAngular,
  ],
  templateUrl: './quyen.component.html',
  styleUrl: './quyen.component.scss'
})
export class QuyenComponent implements OnInit{
  private gridApi!: GridApi<Roles>;
      data: Roles[] = [];
      constructor(
        private dataService: DataService,
        private toastr: ToastrService,
        private dialog: MatDialog
      ) {}
  ngOnInit(): void {
    this.loadData();
  }

  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
              mode: 'multiRow',
            };
            defaulColDef = {
              flex: 1,
              minWith: 100,
              minHight: 50,
            };
            onGridReady(params: GridReadyEvent<Roles>) {
              this.gridApi = params.api;
            }
        
            onAddRow() {
              this.gridApi.applyTransaction({
                add: [
                  {
                    id: '',
                    name: '',
                    description: ''
                  },
                ],
                addIndex: 0,
              });
            }
            colDefs:ColDef[]=[

              { field: "id",headerName:"Id",
                width:200,
                headerCheckboxSelection:true,
                checkboxSelection:true,
                hide:true,
            cellRenderer:(item:any)=>{
              return "guid:"+item.value
            }
            
                 },
              {field:'name',
              headerName:'Tên chức năng',
              filter: 'agTextColumnFilter',
              editable:true,
              cellEditor: "agLargeTextCellEditor",              
              cellEditorPopup: true},
            
              {field:'description',
              headerName:'Mô tả chức năng',
              editable:true,
              cellEditor: "agLargeTextCellEditor",
              cellEditorPopup: true}
            ];

            loadData() {
              this.dataService.get('/api/Roles').subscribe({
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
                .put('/api/Roles/UpdateMultiple', selectedRows)
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
                    .post('/api/Roles/DeleteMultipale', selectedRows)
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
}
