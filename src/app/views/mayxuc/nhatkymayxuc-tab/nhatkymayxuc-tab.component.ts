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
export class NhatkymayxucTabComponent implements OnChanges {
  @Input('TonghopmayxucDetail') TonghopmayxucDetail: any;
  private gridApi!: GridApi<NhatkymayxucDetail>;
  tenPhong: any[] = [];
  dsDonvi: any[] = [];
  rowData: NhatkymayxucDetail[] = [];
  tonghopmayxucId!: number;
  entity: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghopmayxucDetail'].currentValue;
    this.tonghopmayxucId = this.entity.id;
    if (this.tonghopmayxucId > 0) {
      this.getDataDetailById();
    }
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
          tonghopmayxucId: this.tonghopmayxucId,
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
    { field: 'ghiChu', headerName: 'Ghi chú' },
  ];

  // getDataDonvi() {
  //   this.dataService.get('/api/Phongban').subscribe({
  //     next: (data: any) => {
  //       this.dsDonvi = data;
  //       let resul: any[] = [];
  //       this.dsDonvi.forEach(function (n) {
  //         resul.push(n.tenPhong);
  //       });
  //       this.tenPhong = resul;
  //     },
  //     error: (eror) => {
  //       alert(eror);
  //     },
  //   });
  // }

  getDataDetailById() {
    this.dataService
      .getById('/api/Nhatkymayxuc/DatailById/' + this.tonghopmayxucId)
      .subscribe({
        next: (response) => {
          this.rowData = response;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.toastr.error('Không thể tải dữ liệu', 'Lỗi');
          this.rowData = [];
        },
      });
  }

  onDelete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .post('/api/Nhatkymayxuc/DeleteMultipale', selectedRows)
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
      .put('/api/Nhatkymayxuc/UpdateMultiple', selectedRows)
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
