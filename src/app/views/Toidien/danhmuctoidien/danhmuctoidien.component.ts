import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
import { NzButtonModule } from 'ng-zorro-antd/button';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

export interface Danhmuctoitruc {
  id: number;
  tenThietBi: string;
  loaiThietBi: string;
  namSanXuat: string;
  hangSanXuat: string;
  tinhTrang: boolean;
  ghiChu: string;
}

@Component({
  selector: 'app-danhmuctoidien',
  imports: [RowComponent, ColComponent, AgGridAngular, NzButtonModule],
  templateUrl: './danhmuctoidien.component.html',
  styleUrl: './danhmuctoidien.component.scss',
})
export class DanhmuctoidienComponent implements OnInit {
  private gridApi!: GridApi<Danhmuctoitruc>;
  dsDanhmuctoitruc: Danhmuctoitruc[] = [];

  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.getDanhmuctoitruc();
  }
  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };

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
      field: 'hangSanXuat',
      headerName: 'Hãng sản xuất',
      cellEditorParams: {
        maxLength: 10000,
      },
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },

    {
      field: 'namSanXuat',
      headerName: 'Năm sản xuất',
      filter: 'agDateColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },
    {
      field: 'tinhTrang',
      headerName: 'Tình trạng',
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },
    {
      field: 'ghiChu',
      headerName: 'Ghi chú',
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },
  ];

  getDanhmuctoitruc() {
    this.dataService.get('/api/Danhmuctoitruc').subscribe({
      next: (response: any) => {
        this.dsDanhmuctoitruc = response;
      },
    });
  }

  onGridReady(params: GridReadyEvent<Danhmuctoitruc>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tenThietBi: '',
          loaiThietBi: '',
          hangSanXuat: '',
          tinhTrang: true,
          namSanXuat: '',
          ghiChu: '',
        },
      ],
      addIndex: 0,
    });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .put('/api/Danhmuctoitruc/UpdateMultiple', selectedRows)
      .subscribe({
        next: (data) => {
          this.getDanhmuctoitruc();
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
    this.delete();
  }

  delete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .post('/api/Danhmuctoitruc/DeleteMultipale', selectedRows)
      .subscribe({
        next: (data) => {
          this.getDanhmuctoitruc();
          this.toastr.success('Xóa thành công ' + data + ' bản ghi', 'Success');
        },
        error: () => {
          this.toastr.error('Xóa bản ghi thất bại ', 'Error');
        },
      });
  }

  onBtExport() {
    this.gridApi.exportDataAsCsv();
  }
}
