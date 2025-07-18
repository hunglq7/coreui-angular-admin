import { Component, OnInit } from '@angular/core';
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
import * as XLSX from 'xlsx';
import { RowComponent, ColComponent } from '@coreui/angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { DanhMucCamera } from '../../../core/interface/camera/camera-interface';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

@Component({
  selector: 'app-danhmuccamera',
  imports: [
    RowComponent,
    ColComponent,
    AgGridAngular,
    NzModalModule,
    NzButtonModule,
  ],
  templateUrl: './danhmuccamera.component.html',
  styleUrl: './danhmuccamera.component.scss',
})
export class DanhmuccameraComponent implements OnInit {
  private gridApi!: GridApi<DanhMucCamera>;
  dsDanhmucCamera: DanhMucCamera[] = [];
  excelData: any;
  data: DanhMucCamera[] = [];
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {}
  ngOnInit() {
    this.loadData();
  }
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
      width: 200,
      hide: true,
    },
    {
      field: 'tenThietBI',
      headerName: 'Tên thiết bị',
      width: 200,
    },
    {
      field: 'thongSoKyThuat',
      headerName: 'Thông số kỹ thuật',
      width: 200,
    },
    {
      field: 'nuocSanXuat',
      headerName: 'Nước sản xuất',
      width: 200,
    },
    {
      field: 'hangSanXuat',
      headerName: 'Hãng sản xuất',
      width: 200,
    },
    {
      field: 'namSanXuat',
      headerName: 'Năm sản xuất',
      width: 200,
    },
    {
      field: 'ghiChu',
      headerName: 'Ghi chú',
      width: 200,
    },
  ];

  onGridReady(params: GridReadyEvent<DanhMucCamera>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tenThietBI: '',
          thongSoKyThuat: '',
          nuocSanXuat: '',
          hangSanXuat: '',
          namSanXuat: '',
          ghiChu: '',
        },
      ],
      addIndex: 0,
    });
  }

  loadData() {
    this.dataService.get('/api/Camera').subscribe({
      next: (response: any) => {
        this.data = response;
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService.put('/api/Camera/UpdateMultiple', selectedRows).subscribe({
      next: (data) => {
        this.loadData();
        this.toastr.success('Thêm thành công ' + data + ' bản ghi', 'Success');
      },
      error: () => {
        this.toastr.warning('Phải chọn danh sách cần lưu ', 'Warning');
      },
    });
  }

  ConfirmDelete(): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bán có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Ba lăng: </b>',
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
      .post('/api/Camera/DeleteMultipale', selectedRows)
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

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Danhmuccamera.xlsx');
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
        .put('/api/Camera/UpdateMultiple', this.excelData)
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
}
