import { Component, OnInit, Input } from '@angular/core';
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

import { RowComponent, ColComponent } from '@coreui/angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

export interface NhatkymayxucDetail {
  id: number;
  tonghopmayxucId: number;
  ngaythang: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
}

@Component({
  selector: 'app-nhatkymayxuc-tab',
  imports: [RowComponent, ColComponent, ButtonDirective, AgGridAngular],
  templateUrl: './nhatkymayxuc-tab.component.html',
  styleUrl: './nhatkymayxuc-tab.component.scss',
})
export class NhatkymayxucTabComponent implements OnInit {
  @Input() TonghopmayxucDetail: any;
  @Input() Tieude: string = '';
  private gridApi!: GridApi<NhatkymayxucDetail>;
  tenPhong: any[] = [];
  dsDonvi: any[] = [];
  rowData: NhatkymayxucDetail[] = [];
  tonghopmayxucId!: number;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    alert(JSON.stringify(this.TonghopmayxucDetail));
    this.getDetailById();
  }

  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };
  onGridReady(params: GridReadyEvent<NhatkymayxucDetail>) {
    this.gridApi = params.api;
  }
  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tonghopmayxucId: 0,
          ngaythang: '',
          donVi: '',
          viTri: '',
          trangThai: '',
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
      hide: true,
    },
    {
      field: 'tonghopmayxucId',
      hide: true,
    },
    {
      field: 'ngaythang',
      headerName: 'Ngày sử dụng',
      editable: true,
      cellEditorPopup: true,
    },
    {
      field: 'donVi',
      headerName: 'Đơn vị',
      editable: true,
      cellEditorPopup: true,
    },

    {
      field: 'viTri',
      headerName: 'Vị trí',
      editable: true,
      cellEditorPopup: true,
    },
    {
      field: 'trangThai',
      headerName: 'Tình trạng',
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorParams: { maxLength: 10000 },
    },
    { field: 'ghiChu', headerName: 'Ghi trú' },
  ];

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
        let resul: any[] = [];
        this.dsDonvi.forEach(function (n) {
          resul.push(n.tenPhong);
        });
        this.tenPhong = resul;
      },
      error: (eror) => {
        alert(eror);
      },
    });
  }

  getDetailById() {
    this.tonghopmayxucId = this.TonghopmayxucDetail.id;

    this.dataService
      .getById('/api/Nhatkymayxuc/DatailById/' + this.tonghopmayxucId)
      .subscribe({
        next: (response) => {
          this.rowData = response;
        },
        error: () => {
          this.toastr.error('Lấy dữ liệu thất bại', 'Error');
        },
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: 'Bán có muốn xóa bản ghi này?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedRows = this.gridApi.getSelectedRows();
        this.dataService.delete('/api/Nhatkymayxuc/' + selectedRows).subscribe({
          next: () => {
            this.getDetailById();
            this.toastr.success('Xóa dữ liệu thành công', 'Success');
          },
          error: () => {
            this.toastr.error('Xóa dữ liệu thất bại', 'Error');
          },
        });
      }
    });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();

    this.dataService
      .put('/api/Nhatkymayxuc/UpdateMultiple', selectedRows)
      .subscribe({
        next: (data: any) => {
          this.getDetailById();
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
}
