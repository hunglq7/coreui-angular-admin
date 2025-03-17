import { Component, OnInit, SimpleChanges } from '@angular/core';
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
import * as XLSX from 'xlsx';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { NavImportExcelComponent } from '../../../components/nav-import-excel/nav-import-excel.component';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

export interface BomNuoc {
  id: number;
  tenThietBi: string;
  loaiThietBi: string;
}
@Component({
  selector: 'app-danhmucbomnuoc',
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    AgGridAngular,
    NavImportExcelComponent,
  ],
  templateUrl: './danhmucbomnuoc.component.html',
  styleUrl: './danhmucbomnuoc.component.scss',
})
export class DanhmucbomnuocComponent implements OnInit {
  private gridApi!: GridApi<BomNuoc>;
  data: BomNuoc[] = [];
  excelData: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
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
  onGridReady(params: GridReadyEvent<BomNuoc>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tenThietBi: '',
          loaiThietBi: '',
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
  ];

  loadData() {
    this.dataService.get('/api/Danhmucbomnuoc').subscribe({
      next: (response: any) => {
        this.data = response;
        console.log(this.data);
      },
      error: () => {
        this.toastr.error('Lấy dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dataService
      .put('/api/Danhmucbomnuoc/UpdateMultiple', selectedRows)
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
          .post('/api/Danhmucbomnuoc/DeleteMultipale', selectedRows)
          .subscribe({
            next: (data) => {
              this.loadData();
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
  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopbomnuoc.xlsx');
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
        .put('/api/Danhmucbomnuoc/UpdateMultiple', this.excelData)
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
