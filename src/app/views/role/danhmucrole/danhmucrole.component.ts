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
import { DanhmucRole } from '../../../core/interface/Role/danhmuc-role';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

@Component({
  selector: 'app-danhmucrole',
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
  templateUrl: './danhmucrole.component.html',
  styleUrl: './danhmucrole.component.scss',
})
export class DanhmucroleComponent implements OnInit {
  private gridApi!: GridApi<DanhmucRole>;
  dataRole: DanhmucRole[] = [];
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loadDataRole();
  }

  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'tenThietBi', headerName: 'Tên thiết bị', flex: 1 },
    { field: 'loaiThietBi', headerName: 'Loại thiết bị', flex: 2 },
    { field: 'ghiChu', headerName: 'Ghi chú', flex: 2 },
  ];
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tenThietBi: '',
          loaiThietBi: '',
          ghiChu: '',
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
      cellRenderer: (item: any) => {
        return 'MTB-' + item.value;
      },
    },

    {
      field: 'tenThietBi',
      headerName: 'Tên thiết bị',
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },
    {
      field: 'loaiThietBi',
      headerName: 'Loại thiết bị',
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },
    {
      field: 'ghichu',
      headerName: 'Ghi chú',
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },
  ];
  loadDataRole() {
    this.dataService.get('/api/DanhmucRole').subscribe({
      next: (response: any) => {
        this.dataRole = response;
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .put('/api/DanhmucRole/UpdateMultiple', selectedRows)
      .subscribe({
        next: (data) => {
          this.loadDataRole();
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
          .post('/api/DanhmucRole/DeleteMultipale', selectedRows)
          .subscribe({
            next: (data) => {
              this.loadDataRole();
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
