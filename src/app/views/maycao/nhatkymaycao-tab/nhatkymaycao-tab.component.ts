import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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

ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

export interface NhatkymaycaoDetail {
  id: number;
  tonghopmaycaoId: number;
  ngaythang: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
}

@Component({
  selector: 'app-nhatkymaycao-tab',
  imports: [RowComponent, ColComponent, ButtonDirective, AgGridAngular],
  templateUrl: './nhatkymaycao-tab.component.html',
  styleUrl: './nhatkymaycao-tab.component.scss',
})
export class NhatkymaycaoTabComponent implements OnChanges {
  @Input() TonghopmaycaoDetail: any;
  private gridApi!: GridApi<NhatkymaycaoDetail>;
  tenPhong: any[] = [];
  dsDonvi: any[] = [];
  rowData: NhatkymaycaoDetail[] = [];
  tonghopmaycaoId!: number;
  entity: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };
  onGridReady(params: GridReadyEvent<NhatkymaycaoDetail>) {
    this.gridApi = params.api;
  }
  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tonghopmaycaoId: this.tonghopmaycaoId,
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
      field: 'tonghopmaycaoId',
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
      .getById('/api/Nhatkymaycao/DetailById/' + this.tonghopmaycaoId)
      .subscribe({
        next: (response) => {
          this.rowData = response;
        },
      });
  }

  onDelete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .post('/api/Nhatkymaycao/DeleteMultipale', selectedRows)
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
      .put('/api/Nhatkymaycao/UpdateMultiple', selectedRows)
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
  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghopmaycaoDetail'].currentValue;
    this.tonghopmaycaoId = this.entity.id;
    if (this.tonghopmaycaoId > 0) {
      this.getDataDetailById();
    }
  }
}
