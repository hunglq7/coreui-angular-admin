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

ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);
export interface NhatkyquatgioDetail {
  id: number;
  tonghopquatgioId: number;
  ngaythang: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
  isModified?: boolean;
}
@Component({
  selector: 'app-nhatkyquatgio-tab',
  imports: [RowComponent, ColComponent, ButtonDirective, AgGridAngular],
  templateUrl: './nhatkyquatgio-tab.component.html',
  styleUrl: './nhatkyquatgio-tab.component.scss',
})
export class NhatkyquatgioTabComponent implements OnChanges {
  @Input() TonghopquatgioDetail: any;
  private gridApi!: GridApi<NhatkyquatgioDetail>;
  rowData: NhatkyquatgioDetail[] = [];
  tonghopquatgioId!: number;
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

  colDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      hide: true,
    },
    {
      field: 'tonghopquatgioId',
      hide: true,
    },
    {
      field: 'ngaythang',
      headerName: 'Ngày sử dụng',
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        maxLength: 10,
      },
      
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
  onGridReady(params: GridReadyEvent<NhatkyquatgioDetail>) {
    this.gridApi = params.api;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghopquatgioDetail'].currentValue;
    this.tonghopquatgioId = this.entity.id;
    if (this.tonghopquatgioId > 0) {
      this.getDataDetailById();
    }
  }
  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tonghopquatgioId: this.tonghopquatgioId,
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

  getDataDetailById() {
    this.dataService
      .getById('/api/Nhatkyquatgio/DatailById/' + this.tonghopquatgioId)
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
      .post('/api/Nhatkyquatgio/DeleteMultipale', selectedRows)
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
      .put('/api/Nhatkyquatgio/UpdateMultiple', selectedRows)
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


