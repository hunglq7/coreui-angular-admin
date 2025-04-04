import { Component, OnInit, SimpleChanges } from '@angular/core';
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
import { NavImportExcelComponent } from '../../../components/nav-import-excel/nav-import-excel.component';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);
export interface Neo {
  id: number;
  tenThietBi: string;
  loaiThietBi: string;
  ghiChu: string;
}

@Component({
  selector: 'app-danhmucneo',
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    AgGridAngular,
    NavImportExcelComponent,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './danhmucneo.component.html',
  styleUrl: './danhmucneo.component.scss',
})
export class DanhmucneoComponent implements OnInit {
  private gridApi!: GridApi<Neo>;
  data: Neo[] = [];
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
  onGridReady(params: GridReadyEvent<Neo>) {
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
  loadDataNeo() {
    this.dataService.get('/api/Danhmucneo').subscribe({
      next: (response: any) => {
        console.log(response);
        this.data = response; // Nếu bạn có một biến riêng cho dữ liệu Khoan, hãy thay thế `this.data` bằng biến đó.
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu Khoan thất bại', 'Error');
      },
    });
  }
  ConfirmDelete(): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bạn có muốn xóa bản ghi này?</i>',
      nzContent:
        '<b>Thiết bị: </b>' + this.gridApi.getSelectedRows()[0].tenThietBi,
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.Delete(),
    });
  }

  Delete() {
    const selectedRows = this.gridApi.getSelectedRows(); // Lấy các dòng được chọn
    this.dataService
      .post('/api/Danhmucneo/DeleteMultipale', selectedRows) // Gửi yêu cầu xóa đến API
      .subscribe({
        next: (data) => {
          this.loadDataNeo(); // Tải lại dữ liệu sau khi xóa thành công
          this.toastr.success('Xóa thành công ' + data + ' bản ghi', 'Success');
        },
        error: () => {
          this.toastr.error('Xóa bản ghi thất bại', 'Error');
        },
      });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows(); // Lấy các dòng được chọn
    this.dataService
      .put('/api/Danhmucneo/UpdateMultiple', selectedRows) // Gửi yêu cầu cập nhật đến API
      .subscribe({
        next: (data) => {
          this.loadDataNeo(); // Tải lại dữ liệu sau khi lưu thành công
          this.toastr.success('Lưu thành công ' + data + ' bản ghi', 'Success');
        },
        error: () => {
          this.toastr.warning('Phải chọn danh sách cần lưu', 'Warning');
        },
      });
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Danhmucneo.xlsx');
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
        .put('/api/Danhmucneo/UpdateMultiple', this.excelData)
        .subscribe({
          next: (data) => {
            this.loadDataNeo();
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
    this.loadDataNeo();
  }
}
