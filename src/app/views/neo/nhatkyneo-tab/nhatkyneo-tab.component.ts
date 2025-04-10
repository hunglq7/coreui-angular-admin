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
export interface NhatkyneoDetail {
  id: number;
  tonghopneoId: number;
  ngaythang: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
}

@Component({
  selector: 'app-nhatkyneo-tab',
  imports: [RowComponent, ColComponent, ButtonDirective, AgGridAngular],
  templateUrl: './nhatkyneo-tab.component.html',
  styleUrl: './nhatkyneo-tab.component.scss',
})
export class NhatkyneoTabComponent implements OnChanges {
  @Input() TonghopneoDetail: any;
  private gridApi!: GridApi<NhatkyneoDetail>;
  tenPhong: any[] = [];
  dsDonvi: any[] = [];
  rowData: NhatkyneoDetail[] = [];
  tonghopneoId!: number;
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
  onGridReady(params: GridReadyEvent<NhatkyneoDetail>) {
    this.gridApi = params.api;
  }
  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tonghopneoId: this.tonghopneoId,
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
      field: 'tonghopneoId',
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
      .getById('/api/Nhatkyneo/DetailById/' + this.tonghopneoId)
      .subscribe({
        next: (response) => {
          this.rowData = response;
        },
      });
  }

  onDelete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .post('/api/Nhatkyneo/DeleteMultipale', selectedRows)
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
      .put('/api/Nhatkyneo/UpdateMultiple', selectedRows)
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
    this.entity = changes['TonghopneoDetail'].currentValue;
    this.tonghopneoId = this.entity.id;
    if (this.tonghopneoId > 0) {
      this.getDataDetailById();
    }
  }
}
