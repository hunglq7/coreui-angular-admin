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

export interface MayXuc {
  id: number;
  tenThietBi: string;
  loaiThietBi: string;
  hangSanXuat: String;
  tinhTrang: boolean;
  namSanXuat: string;
  ghiChu: string;
}

@Component({
  selector: 'app-danhmucmayxuc',
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
  templateUrl: './danhmucmayxuc.component.html',
  styleUrl: './danhmucmayxuc.component.scss',
})
export class DanhmucmayxucComponent implements OnInit {
  private gridApi!: GridApi<MayXuc>;
  dataMayxuc: MayXuc[] = [];
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loadDataMayxuc();
  }
  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };
  onGridReady(params: GridReadyEvent<MayXuc>) {
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

  loadDataMayxuc() {
    this.dataService.get('/api/MayXuc').subscribe({
      next: (response: any) => {
        this.dataMayxuc = response;
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService.put('/api/Mayxuc/UpdateMultiple', selectedRows).subscribe({
      next: (data) => {
        this.loadDataMayxuc();
        this.toastr.success('Thêm thành công ' + data + ' bản ghi', 'Success');
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
          .post('/api/Mayxuc/DeleteMultipale', selectedRows)
          .subscribe({
            next: (data) => {
              this.loadDataMayxuc();
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
