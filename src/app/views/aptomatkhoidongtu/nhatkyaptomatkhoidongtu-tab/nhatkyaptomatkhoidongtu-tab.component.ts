import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';
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

export interface NhatKyAptomatKhoiDongTuDetail {
  id: number;
  tonghopaptomatkhoidongtuId: number;
  ngayLap: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
}

ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

@Component({
  selector: 'app-nhatkyaptomatkhoidongtu-tab',
  imports: [RowComponent, ColComponent, ButtonDirective, AgGridAngular],
  templateUrl: './nhatkyaptomatkhoidongtu-tab.component.html',
  styleUrl: './nhatkyaptomatkhoidongtu-tab.component.scss',
})
export class NhatkyaptomatkhoidongtuTabComponent implements OnChanges {
  @Input() TonghopaptomatkhoidongtuDetail: any;
  private gridApi!: GridApi<NhatKyAptomatKhoiDongTuDetail>;
  rowData: NhatKyAptomatKhoiDongTuDetail[] = [];
  tonghopaptomatkhoidongtuId!: number;
  entity: any;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghopaptomatkhoidongtuDetail'].currentValue;
    this.tonghopaptomatkhoidongtuId = this.entity.id;
    this.getDataDetailById();
  }

  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };
  onGridReady(params: GridReadyEvent<NhatKyAptomatKhoiDongTuDetail>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tonghopaptomatkhoidongtuId: this.tonghopaptomatkhoidongtuId,
          ngayLap: '',
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
      field: 'tonghopaptomatkhoidongtuId',
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
    { field: 'ghiChu', headerName: 'Ghi chú' },
  ];

  getDataDetailById() {
    this.dataService
      .getById('/api/Nhatkyaptomatkhoidongtu/DatailById/' + this.tonghopaptomatkhoidongtuId)
      .subscribe({
        next: (response) => {
          this.rowData = response;
        },
      });
  }

  onDelete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .post('/api/Nhatkyaptomatkhoidongtu/DeleteMultipale', selectedRows)
      .subscribe({
        next: () => {
          this.getDataDetailById();
          this.toastr.success('Xóa dữ liệu thành công', 'Success');
        },
        error: () => {
          this.toastr.error('Xóa dữ liệu thất bại', 'Error');
        },
      });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .put('/api/Nhatkyaptomatkhoidongtu/UpdateMultiple', selectedRows)
      .subscribe({
        next: (data: any) => {
          this.getDataDetailById();
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
