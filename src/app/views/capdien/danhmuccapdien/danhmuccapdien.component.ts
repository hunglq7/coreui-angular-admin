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

export interface CapDien {
  id: number;
  tenThietBi: string;
  ghiChu: string;
}
@Component({
  selector: 'app-danhmuccapdien',
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
  templateUrl: './danhmuccapdien.component.html',
  styleUrl: './danhmuccapdien.component.scss',
})
export class DanhmuccapdienComponent implements OnInit {
  private gridApi!: GridApi<CapDien>;
  dataCapdien: CapDien[] = [];
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loadDataCapdien();
  }

  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };
  onGridReady(params: GridReadyEvent<CapDien>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tenThietBi: '',
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
      field: 'tenthietbi',
      headerName: 'Tên thiết bị',
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

  loadDataCapdien() {
    this.dataService.get('/api/Capdien').subscribe({
      next: (response: any) => {
        this.dataCapdien = response;
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .put('/api/Capdien/UpdateMultiple', selectedRows)
      .subscribe({
        next: (data) => {
          this.loadDataCapdien();
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
          .post('/api/Capdien/DeleteMultipale', selectedRows)
          .subscribe({
            next: (data) => {
              this.loadDataCapdien();
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
