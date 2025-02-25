import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DataService } from '../../../core/services/data.service';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
('@coreui/angular');

import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
} from '@coreui/angular';

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
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    AgGridAngular,
  ],
  templateUrl: './danhmuctoidien.component.html',
  styleUrl: './danhmuctoidien.component.scss',
})
export class DanhmuctoidienComponent implements OnInit {
  private gridApi!: GridApi<Danhmuctoitruc>;
  dsDanhmuctoitruc: Danhmuctoitruc[] = [];

  public rowSelection: 'single' | 'multiple' = 'multiple';

  constructor(private dataService: DataService, private router: Router) {}
  ngOnInit() {
    this.getDanhmuctoitruc();
  }

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
      headerCheckboxSelection: true,
      checkboxSelection: true,
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
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
        alert(JSON.stringify(this.dsDanhmuctoitruc));
      },
      error: () => {
        alert('Lấy dữ liệu thất bại');
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

  edit() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .put('/api/Danhmuctoitruc/UpdateMultiple', selectedRows)
      .subscribe({
        next: (data) => {
          this.getDanhmuctoitruc();
        },
        error: () => {
          alert('Sửa thất bại');
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
          this.router.navigate(['/dashboard/danhmuctoitruc']);
        },
        error: () => {
          alert('Xóa thất bại');
        },
      });
  }

  onBtExport() {
    this.gridApi.exportDataAsCsv();
  }
}
