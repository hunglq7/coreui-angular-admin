import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
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
import * as XLSX from 'xlsx';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { GiacotThuyluc } from '../../../core/interface/giacotthuyluc/giacotthuyluc.interface';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

@Component({
  selector: 'app-danhmucgiacotthuyluc',
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    AgGridAngular,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './danhmucgiacotthuyluc.component.html',
  styleUrl: './danhmucgiacotthuyluc.component.scss',
})
export class DanhmucgiacotthuylucComponent implements OnInit {
  private gridApi!: GridApi<GiacotThuyluc>;
  data: GiacotThuyluc[] = [];
  excelData: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {}

  rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };
  defaulColDef = {
    flex: 1,
    minWith: 100,
    minHight: 50,
  };
  onGridReady(params: GridReadyEvent<GiacotThuyluc>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tenThietBi: '',
          loaiThietBi: '',
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
      field: 'ghiChu',
      headerName: 'Ghi chú',
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditorPopup: true,
    },
  ];

  loadData() {
    this.dataService.get('/api/Danhmucgiacotthuyluc').subscribe({
      next: (response: any) => {
        this.data = response;
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }

  ConfirmDelete(): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bạn có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Giá cột thủy lực: </b>',
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.Delete(),
    });
  }

  Delete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .post('/api/Danhmucgiacotthuyluc/DeleteMultiple', selectedRows)
      .subscribe({
        next: (data) => {
          this.loadData();
          this.toastr.success('Xóa thành công ' + data + ' bản ghi', 'Success');
        },
        error: () => {
          this.toastr.error('Xóa bản ghi thất bại ', 'Error');
        },
      });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .put('/api/Danhmucgiacotthuyluc/UpdateMultiple', selectedRows)
      .subscribe({
        next: (data) => {
          this.loadData();
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

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Danhmucgiacotthuyluc.xlsx');
  }
  importexcel(event: any) {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetName = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName[0]]);
      this.dataService
        .put('/api/Danhmucgiacotthuyluc/UpdateMultiple', this.excelData)
        .subscribe({
          next: (data) => {
            this.loadData();
            this.toastr.success(
              'Thêm thành công ' + data + ' bản ghi',
              'Success'
            );
          },
          error: () => {
            this.toastr.warning('Phải chọn danh sách cần lưu ', 'Warning');
          },
        });
    };
  }

  ngOnInit(): void {
    this.loadData();
  }
}
