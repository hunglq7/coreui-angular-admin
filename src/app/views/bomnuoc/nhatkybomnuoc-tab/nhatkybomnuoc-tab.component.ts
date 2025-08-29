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
import { NhatKyBomNuocDetail } from '../../../core/interface/bomnuoc/bomnuoc-interface';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

@Component({
  selector: 'app-nhatkybomnuoc-tab',
  imports: [RowComponent, ColComponent, ButtonDirective, AgGridAngular],
  templateUrl: './nhatkybomnuoc-tab.component.html',
  styleUrl: './nhatkybomnuoc-tab.component.scss',
})
export class NhatkybomnuocTabComponent implements OnChanges {
  @Input() TonghopbomnuocDetail: any;
  private gridApi!: GridApi<NhatKyBomNuocDetail>;
  rowData: NhatKyBomNuocDetail[] = [];
  tonghopbomnuocId!: number;
  entity: any;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['TonghopbomnuocDetail'] && changes['TonghopbomnuocDetail'].currentValue) {
      this.entity = changes['TonghopbomnuocDetail'].currentValue;
      this.tonghopbomnuocId = this.entity.id;
      
      // Only call API if we have a valid ID
      if (this.tonghopbomnuocId && this.tonghopbomnuocId > 0) {
        this.getDataDetailById();
      } else {
        console.warn('Invalid tonghopbomnuocId:', this.tonghopbomnuocId);
        this.rowData = [];
      }
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
  onGridReady(params: GridReadyEvent<NhatKyBomNuocDetail>) {
    this.gridApi = params.api;
  }

  onAddRow() {
    // Validate ID before adding row
    if (!this.tonghopbomnuocId || this.tonghopbomnuocId <= 0) {
      this.toastr.warning('Vui lòng lưu thiết bị trước khi thêm nhật ký', 'Warning');
      return;
    }

    this.gridApi.applyTransaction({
      add: [
        {
          id: 0,
          tonghopbomnuocId: this.tonghopbomnuocId,
          ngayLap: new Date().toISOString().split('T')[0], // Default to today
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
      field: 'tonghopbomnuocId',
      hide: true,
    },
    {
      field: 'ngayLap',
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
    // Validate ID before making API call
    if (!this.tonghopbomnuocId || this.tonghopbomnuocId <= 0) {
      console.warn('Cannot fetch data: Invalid ID:', this.tonghopbomnuocId);
      this.rowData = [];
      return;
    }

    const url = `/api/Nhatkybomnuoc/DetailById/${this.tonghopbomnuocId}`;
    console.log('Fetching nhatky data for ID:', this.tonghopbomnuocId, 'URL:', url);
    
    this.dataService.getById(url).subscribe({
      next: (response) => {
        console.log('Nhatky data received:', response);
        this.rowData = Array.isArray(response) ? response : [];
      },
      error: (error) => {
        console.error('Error fetching nhatky data:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: url,
          id: this.tonghopbomnuocId
        });
        
        if (error.status === 404) {
          this.toastr.warning('Không tìm thấy dữ liệu nhật ký cho thiết bị này', 'Warning');
        } else {
          this.toastr.error('Không thể tải dữ liệu nhật ký', 'Lỗi');
        }
        this.rowData = [];
      }
    });
  }
  onDelete() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.toastr.warning('Vui lòng chọn dòng cần xóa', 'Warning');
      return;
    }

    this.dataService.post('/api/Nhatkybomnuoc/DeleteMultipale', selectedRows).subscribe({
      next: () => {
        this.getDataDetailById();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }
  save() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.toastr.warning('Vui lòng chọn dòng cần lưu', 'Warning');
      return;
    }

    // Validate data before saving
    const validRows = selectedRows.filter(row => {
      return row.tonghopbomnuocId && row.tonghopbomnuocId > 0;
    });

    if (validRows.length === 0) {
      this.toastr.error('Dữ liệu không hợp lệ', 'Error');
      return;
    }

    this.dataService.put('/api/Nhatkybomnuoc/UpdateMultiple', validRows).subscribe({
      next: (data: any) => {
        this.getDataDetailById();
        this.toastr.success('Lưu thành công ' + data + ' bản ghi', 'Success');
      },
      error: (err) => {
        console.error('Save error:', err);
        this.toastr.error('Lưu dữ liệu thất bại', 'Error');
      },
    });
  }
}
