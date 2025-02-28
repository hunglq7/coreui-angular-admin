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
  templateUrl: './nhatkymayxuc-tab.component.html',
  styleUrl: './nhatkymayxuc-tab.component.scss',
})
export class NhatkymayxucTabComponent implements OnInit {
  @Input() TonghopmayxucDetail: any;
  private gridApi!: GridApi<NhatkymayxucDetail>;
  tenPhong: any[] = [];
  dsDonvi: any[] = [];
  nhatkymayxucDetail: NhatkymayxucDetail[] = [];
  tonghopmayxucId!: number;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellEditorPopup: true,
    },
    {
      field: 'donVi',
      headerName: 'Đơn vị',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.tenPhong,
      },
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
        console.log(this.tenPhong);
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
          this.nhatkymayxucDetail = response;
          console.log('Nhật ký' + this.nhatkymayxucDetail);
        },
        error: () => {
          this.toastr.error('Lấy dữ liệu thất bại', 'Error');
        },
      });
  }
}
