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
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

export interface Nhatkytoitruc {
  id: number;
  tonghoptoitrucId: number;
  ngaythang: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
}

@Component({
  selector: 'app-nhatkytoidien-tab',
  imports: [
    RowComponent,
    ColComponent,
    ButtonDirective,
    AgGridAngular,
    NzModalModule,
  ],
  templateUrl: './nhatkytoidien-tab.component.html',
  styleUrl: './nhatkytoidien-tab.component.scss',
})
export class NhatkytoidienTabComponent implements OnChanges {
  @Input('TonghoptoitrucDetail') TonghoptoitrucDetail: any;
  private gridApi!: GridApi<Nhatkytoitruc>;
  rowData: Nhatkytoitruc[] = [];
  tonghoptoitrucId!: number;
  entity: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghoptoitrucDetail'].currentValue;
    this.tonghoptoitrucId = this.entity.id;
    if (this.tonghoptoitrucId > 0) {
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
  onGridReady(params: GridReadyEvent<Nhatkytoitruc>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tonghoptoitrucId: this.tonghoptoitrucId,
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
      field: 'tonghoptoitrucId',
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
      .getById('/api/NhatkyTonghoptoitruc/' + this.tonghoptoitrucId)
      .subscribe({
        next: (response) => {
          this.rowData = response;
        },
      });
  }

  showConfirm(): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bán có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Thiết bị: </b>',
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 70}px`,
      },
      nzOnOk: () => this.onDelete(),
    });
  }
  onDelete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .post('/api/NhatkyTonghoptoitruc/DeleteMultipale', selectedRows)
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
      .put('/api/NhatkyTonghoptoitruc/UpdateMultiple', selectedRows)
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
