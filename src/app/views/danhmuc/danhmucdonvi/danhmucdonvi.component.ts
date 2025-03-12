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


export interface DonVi{
  id:number,
  tenPhong:string,
  trangThai:boolean
}


@Component({
  selector: 'app-danhmucdonvi',
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
  templateUrl: './danhmucdonvi.component.html',
  styleUrl: './danhmucdonvi.component.scss'
})
export class DanhmucdonviComponent implements OnInit {
   private gridApi!: GridApi<DonVi>;
      data: DonVi[] = [];
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
          onGridReady(params: GridReadyEvent<DonVi>) {
            this.gridApi = params.api;
          }
      
          onAddRow() {
            this.gridApi.applyTransaction({
              add: [
                {
                  id: 0,
                  tenPhong: '',
                  trangThai: true,
                },
              ],
              addIndex: 0,
            });
          }
    
          colDefs: ColDef[] = [
            {
              field: 'id',
              headerName: 'Id',
              width: 200,
              hide: true,
            },
        
            {
              field: 'tenPhong',
              headerName: 'Tên đơn vị',
              filter: 'agTextColumnFilter',
              editable: true,
              cellEditorPopup: true,
            },
            {
              field: 'trangThai',
              headerName: 'Trạng thái',
              filter: 'agTextColumnFilter',
              editable: true,
              cellEditorPopup: true,
            },
          ];
    
          loadData() {
            this.dataService.get('/api/Phongban').subscribe({
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
              .put('/api/Phongban/UpdateMultiple', selectedRows)
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
                  .post('/api/Phongban/DeleteMultipale', selectedRows)
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
