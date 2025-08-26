import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';

import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectionModule,
  RowSelectionOptions,
  ICellEditorComp,
  ICellEditorParams,
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['TonghopquatgioDetail'] &&
      changes['TonghopquatgioDetail'].currentValue
    ) {
      this.entity = changes['TonghopquatgioDetail'].currentValue;
      console.log('Entity received:', this.entity);

      if (this.entity && this.entity.id) {
        this.tonghopquatgioId = this.entity.id;
        console.log('TonghopquatgioId set to:', this.tonghopquatgioId);
        this.getDataDetailById();
      } else {
        console.warn('Entity or entity.id is null/undefined');
        this.tonghopquatgioId = 0;
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
  onGridReady(params: GridReadyEvent<NhatkyquatgioDetail>) {
    this.gridApi = params.api;

    // Thêm event listener để theo dõi thay đổi trong grid
    this.gridApi.addEventListener('cellValueChanged', (event: any) => {
      if (event.data) {
        event.data.isModified = true;
        console.log('Row modified:', event.data);
        
        // Validate ngày tháng nếu trường thay đổi là ngayThang
        if (event.colDef.field === 'ngaythang') {
          this.validateDateField(event.data, event.newValue);
        }
      }
    });

    // Thêm event listener để xử lý double click vào cell ngày tháng
    this.gridApi.addEventListener('cellDoubleClicked', (event: any) => {
      if (event.colDef.field === 'ngaythang') {
        this.openDatePicker(event);
      }
    });
  }

  // Method để validate ngày tháng khi người dùng nhập
  private validateDateField(rowData: any, newValue: any): void {
    if (!newValue || newValue.trim() === '') {
      return; // Cho phép để trống
    }

    // Kiểm tra format dd/mm/yyyy
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = newValue.match(dateRegex);

    if (!match) {
      this.toastr.warning(
        'Vui lòng nhập ngày theo định dạng dd/mm/yyyy',
        'Định dạng không hợp lệ'
      );
      return;
    }

    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);

    // Kiểm tra ngày tháng hợp lệ
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      this.toastr.warning(
        'Ngày tháng không hợp lệ. Vui lòng kiểm tra lại.',
        'Ngày tháng không hợp lệ'
      );
      return;
    }

    // Kiểm tra ngày có tồn tại không (ví dụ: 31/02/2024)
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      this.toastr.warning(
        'Ngày tháng không tồn tại. Vui lòng kiểm tra lại.',
        'Ngày tháng không tồn tại'
      );
      return;
    }

    console.log('Date validation passed:', newValue);
  }

  // Method để mở date picker khi click vào cell ngày tháng
  private openDatePicker(event: any): void {
    // Tạo input type="date" ẩn
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.style.position = 'absolute';
    dateInput.style.left = '-9999px';
    dateInput.style.top = '-9999px';
    
    // Set giá trị hiện tại nếu có
    if (event.value) {
      const parts = event.value.split('/');
      if (parts.length === 3) {
        dateInput.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    // Thêm vào DOM
    document.body.appendChild(dateInput);
    
    // Focus vào input để mở date picker
    dateInput.focus();
    
    // Xử lý sự kiện khi người dùng chọn ngày
    dateInput.addEventListener('change', (e: any) => {
      const selectedDate = e.target.value;
      if (selectedDate) {
        // Convert yyyy-mm-dd to dd/mm/yyyy
        const parts = selectedDate.split('-');
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        
        // Cập nhật giá trị trong grid
        event.data.ngaythang = formattedDate;
        event.data.isModified = true;
        
        // Refresh cell để hiển thị giá trị mới
        this.gridApi.refreshCells({
          rowNodes: [event.node],
          columns: ['ngaythang']
        });
        
        console.log('Date selected:', formattedDate);
      }
      
      // Xóa input khỏi DOM
      document.body.removeChild(dateInput);
    });
    
    // Xử lý sự kiện khi người dùng click ra ngoài
    dateInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (document.body.contains(dateInput)) {
          document.body.removeChild(dateInput);
        }
      }, 100);
    });
  }

  // Method để tự động format ngày tháng khi người dùng nhập
  private autoFormatDate(input: string): string {
    // Loại bỏ tất cả ký tự không phải số
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    
    // Nếu quá 8 số, chỉ lấy 8 số đầu
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
  onAddRow() {
    if (!this.tonghopquatgioId || this.tonghopquatgioId === 0) {
      this.toastr.warning(
        'Vui lòng chọn một bản ghi tổng hợp trước khi thêm nhật ký',
        'Warning'
      );
      return;
    }

    if (!this.gridApi) {
      console.warn('Grid API is not ready');
      return;
    }

    const newRow: NhatkyquatgioDetail = {
      id: 0,
      tonghopquatgioId: this.tonghopquatgioId,
      ngaythang: '', // Để trống để người dùng nhập
      donVi: '',
      viTri: '',
      trangThai: '',
      ghiChu: '',
      isModified: true,
    };

    console.log('Adding new row:', newRow);
    this.gridApi.applyTransaction({
      add: [newRow],
      addIndex: 0,
    });

    // Hiển thị thông báo hướng dẫn
    this.toastr.info(
      'Vui lòng điền đầy đủ thông tin bắt buộc trước khi lưu',
      'Hướng dẫn'
    );
  }

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
      valueGetter: (params: any) => {
        return params.data ? (params.data as any).ngaythang : params.value;
      },
      valueSetter: (params: any) => {
        const newVal = ((params.newValue ?? '') + '').trim();
        (params.data as any).ngaythang = newVal;
        params.data.isModified = true;
        return true;
      },
      valueFormatter: (params: any) => {
        const val = params.value ?? ((params.data as any)?.ngaythang);
        return val && (val + '').trim() !== '' ? val : 'Chưa có ngày';
      },
      // Đảm bảo cell có đủ width để hiển thị ngày
      width: 120,
      minWidth: 120,
      // Thêm tooltip hướng dẫn
      tooltipValueGetter: (params: any) => {
        return 'Nhập ngày theo định dạng dd/mm/yyyy hoặc click để chọn ngày';
      }
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
    if (!this.tonghopquatgioId || this.tonghopquatgioId === 0) {
      console.warn('TonghopquatgioId is not valid:', this.tonghopquatgioId);
      this.rowData = [];
      return;
    }

    console.log('Fetching data for tonghopquatgioId:', this.tonghopquatgioId);

    // Thử nhiều endpoint khác nhau để tìm endpoint đúng
    const endpoints = [
      `/api/Nhatkyquatgio/DetailById/${this.tonghopquatgioId}`,
      `/api/Nhatkyquatgio/GetByTonghopId/${this.tonghopquatgioId}`,
      `/api/Nhatkyquatgio/GetByParentId/${this.tonghopquatgioId}`,
      `/api/Nhatkyquatgio/GetByTonghopquatgioId/${this.tonghopquatgioId}`,
      `/api/Nhatkyquatgio?tonghopquatgioId=${this.tonghopquatgioId}`,
      `/api/Nhatkyquatgio?parentId=${this.tonghopquatgioId}`,
    ];

    this.tryEndpoints(endpoints, 0);
  }

  private tryEndpoints(endpoints: string[], index: number) {
    if (index >= endpoints.length) {
      // Tất cả endpoints đều thất bại
      console.error(
        'All endpoints failed. Please check backend API configuration.'
      );
      this.toastr.error(
        'Không thể kết nối đến API. Vui lòng kiểm tra cấu hình backend.',
        'Lỗi kết nối'
      );
      this.rowData = [];
      return;
    }

    const endpoint = endpoints[index];
    console.log(`Trying endpoint ${index + 1}/${endpoints.length}:`, endpoint);

    this.dataService.getById(endpoint).subscribe({
      next: (response) => {
        console.log('Success with endpoint:', endpoint, 'Response:', response);
        let data: any[] = [];

        if (response && Array.isArray(response)) {
          data = response;
        } else if (
          response &&
          response.items &&
          Array.isArray(response.items)
        ) {
          data = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          data = response.data;
        } else {
          console.warn('Response format not recognized:', response);
          this.rowData = [];
          return;
        }

        // Format dữ liệu ngày tháng trước khi gán vào rowData
        this.rowData = data.map((item: any) => {
          console.log('Processing item:', item);

          // Tìm trường ngày tháng từ nhiều tên có thể có
          let dateValue = '';
          if (item.ngaythang) {
            // Nếu là string, sử dụng trực tiếp
            if (typeof item.ngaythang === 'string') {
              dateValue = item.ngaythang;
            } else {
              // Nếu không phải string, format
              dateValue = this.formatDateForDisplayFromAPI(item.ngaythang);
            }
          } else if (item.ngaythang) {
            if (typeof item.ngaythang  === 'string') {
              dateValue = item.ngaythang;
            } else {
              dateValue = this.formatDateForDisplayFromAPI(item.ngaythang);
            }
          } else if (item.ngaythang) {
            if (typeof item.ngaythang === 'string') {
              dateValue = item.ngaythang;
            } else {
              dateValue = this.formatDateForDisplayFromAPI(item.ngaythang);
            }
          } else if (item.ngaythang) {
            if (typeof item.ngaythang === 'string') {
              dateValue = item.ngaythang;
            } else {
              dateValue = this.formatDateForDisplayFromAPI(item.ngaythang);
            }
          }

          console.log('Date value found:', dateValue, 'for item:', item);

          return {
            ...item,
            ngaythang: dateValue || '',
            isModified: false, // Reset trạng thái modified
          };
        });

        console.log('Row data updated, count:', this.rowData.length);
        console.log('Formatted row data:', this.rowData);
        
        // Force refresh grid để hiển thị dữ liệu mới
        if (this.gridApi) {
          setTimeout(() => {
            this.gridApi.refreshCells();
            console.log('Grid refreshed');
            
            // Debug dữ liệu ngày tháng
            this.debugDateData();
            
            // Test hiển thị dữ liệu string
            this.testStringDisplay();
            
            // Kiểm tra và sửa lỗi hiển thị
            this.checkAndFixDisplay();
            
            // Debug grid data
            this.debugGridData();
            
            // Kiểm tra và sửa lỗi field mapping
            this.checkAndFixFieldMapping();
            
            // Force update dữ liệu ngày tháng nếu cần
            this.forceUpdateDateDisplay();
          }, 100);
        }
      },
      error: (error) => {
        console.error(`Endpoint ${endpoint} failed:`, error);

        if (error.status === 404) {
          console.log(`Endpoint ${endpoint} not found, trying next...`);
          // Thử endpoint tiếp theo
          setTimeout(() => {
            this.tryEndpoints(endpoints, index + 1);
          }, 100);
        } else {
          // Lỗi khác 404, dừng thử
          console.error(
            'Non-404 error encountered, stopping endpoint attempts'
          );
          this.toastr.error(
            'Lỗi khi tải dữ liệu: ' + (error.message || error),
            'Lỗi'
          );
          this.rowData = [];
        }
      },
    });
  }

  onDelete() {
    if (!this.gridApi) {
      console.warn('Grid API is not ready');
      return;
    }

    const selectedRows = this.gridApi.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      this.toastr.warning('Vui lòng chọn ít nhất một dòng để xóa', 'Warning');
      return;
    }

    console.log('Deleting rows:', selectedRows);

    // Thử nhiều endpoint khác nhau cho việc xóa
    const deleteEndpoints = [
      '/api/Nhatkyquatgio/DeleteMultipale',
      '/api/Nhatkyquatgio/DeleteMultiple',
      '/api/Nhatkyquatgio/DeleteMultiple',
      '/api/Nhatkyquatgio/delete-multiple',
      '/api/Nhatkyquatgio/deleteMultiple',
    ];

    this.tryDeleteEndpoints(selectedRows, deleteEndpoints, 0);
  }

  private tryDeleteEndpoints(
    selectedRows: any[],
    endpoints: string[],
    index: number
  ) {
    if (index >= endpoints.length) {
      // Tất cả endpoints đều thất bại
      console.error(
        'All delete endpoints failed. Please check backend API configuration.'
      );
      this.toastr.error(
        'Không thể xóa dữ liệu. Vui lòng kiểm tra cấu hình backend.',
        'Lỗi kết nối'
      );
      return;
    }

    const endpoint = endpoints[index];
    console.log(
      `Trying delete endpoint ${index + 1}/${endpoints.length}:`,
      endpoint
    );

    this.dataService.post(endpoint, selectedRows).subscribe({
      next: () => {
        console.log('Delete successful with endpoint:', endpoint);
        this.getDataDetailById();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: (error) => {
        console.error(`Delete endpoint ${endpoint} failed:`, error);

        if (error.status === 404) {
          console.log(`Delete endpoint ${endpoint} not found, trying next...`);
          // Thử endpoint tiếp theo
          setTimeout(() => {
            this.tryDeleteEndpoints(selectedRows, endpoints, index + 1);
          }, 100);
        } else {
          // Lỗi khác 404, dừng thử
          console.error(
            'Non-404 error encountered during delete, stopping endpoint attempts'
          );
          this.toastr.error(
            'Xóa dữ liệu thất bại: ' + (error.message || error),
            'Error'
          );
        }
      },
    });
  }

  save() {
    if (!this.gridApi) {
      console.warn('Grid API is not ready');
      this.toastr.error('Grid chưa sẵn sàng', 'Error');
      return;
    }

    // Lấy tất cả dữ liệu từ grid
    const allRows = this.gridApi
      .getRenderedNodes()
      .map((node) => node.data)
      .filter(Boolean);

    if (allRows.length === 0) {
      this.toastr.info('Không có dữ liệu để lưu', 'Info');
      return;
    }

    // Kiểm tra xem có thay đổi nào không
    const hasChanges = this.checkForChanges(allRows);
    if (!hasChanges) {
      this.toastr.info('Không có thay đổi nào để lưu', 'Info');
      return;
    }

    console.log('All rows from grid:', allRows);

    // Chuẩn bị dữ liệu để gửi (làm sạch payload theo model backend)
    const dataToSave = allRows.map((row: any) => {
      const formattedDate = this.formatDateForAPI(row.ngaythang);
      return {
        id: row.id || 0,
        tonghopquatgioId: this.tonghopquatgioId,
        ngayThang: formattedDate,
        donVi: (row.donVi || '').trim(),
        viTri: (row.viTri || '').trim(),
        trangThai: (row.trangThai || '').trim(),
        ghiChu: (row.ghiChu || '').trim(),
      };
    });

    console.log('Data to save:', dataToSave);

    // Sử dụng UpdateMultiple API từ backend
    this.saveWithUpdateMultiple(dataToSave);
  }

  private checkForChanges(rows: any[]): boolean {
    // Kiểm tra xem có row nào được modified không
    const hasModifiedRows = rows.some((row) => row.isModified);

    if (hasModifiedRows) {
      return true;
    }

    // Kiểm tra xem có row mới (id = 0) không
    const hasNewRows = rows.some((row) => row.id === 0);

    return hasNewRows;
  }

  private saveWithUpdateMultiple(dataToSave: any[]) {
    console.log(
      'Saving with UpdateMultiple API:',
      dataToSave.length,
      'records'
    );

    // Validate dữ liệu trước khi gửi
    const validData = this.validateDataBeforeSave(dataToSave);
    if (!validData.isValid) {
      this.toastr.error(validData.message, 'Validation Error');
      return;
    }

    // Gọi UpdateMultiple API
    this.dataService
      .post('/api/Nhatkyquatgio/UpdateMultiple', dataToSave)
      .subscribe({
        next: (response) => {
          console.log('UpdateMultiple successful:', response);
          this.toastr.success(
            `Lưu thành công ${dataToSave.length} bản ghi`,
            'Success'
          );

          // Refresh data sau khi lưu thành công
          this.getDataDetailById();

          // Reset grid về trạng thái ban đầu
          this.resetGridModifiedState();
        },
        error: (error) => {
          console.error('UpdateMultiple failed:', error);
          this.handleUpdateMultipleError(error, dataToSave);
        },
      });
  }

  private validateDataBeforeSave(data: any[]): {
    isValid: boolean;
    message: string;
  } {
    if (!data || data.length === 0) {
      return { isValid: false, message: 'Không có dữ liệu để lưu' };
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Kiểm tra các trường bắt buộc
      if (!row.ngaythang || row.ngaythang.trim() === '') {
        return {
          isValid: false,
          message: `Dòng ${i + 1}: Ngày sử dụng là bắt buộc`,
        };
      }

      // Kiểm tra ngày tháng hợp lệ
      const formattedDate = this.formatDateForAPI(row.ngaythang);
      if (!formattedDate) {
        return {
          isValid: false,
          message: `Dòng ${i + 1}: Ngày sử dụng không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy`,
        };
      }

      if (!row.donVi || row.donVi.trim() === '') {
        return { isValid: false, message: `Dòng ${i + 1}: Đơn vị là bắt buộc` };
      }

      if (!row.viTri || row.viTri.trim() === '') {
        return { isValid: false, message: `Dòng ${i + 1}: Vị trí là bắt buộc` };
      }

      if (!row.trangThai || row.trangThai.trim() === '') {
        return {
          isValid: false,
          message: `Dòng ${i + 1}: Tình trạng là bắt buộc`,
        };
      }
    }

    return { isValid: true, message: '' };
  }

  private handleUpdateMultipleError(error: any, dataToSave: any[]) {
    let errorMessage = 'Lưu dữ liệu thất bại';

    if (error.status === 400) {
      errorMessage =
        'Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin nhập vào.';
    } else if (error.status === 404) {
      errorMessage =
        'API endpoint không tìm thấy. Vui lòng kiểm tra cấu hình backend.';
    } else if (error.status === 500) {
      errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
    } else if (error.error && error.error.message) {
      errorMessage = `Lỗi: ${error.error.message}`;
    }

    this.toastr.error(errorMessage, 'Error');

    // Log chi tiết lỗi để debug
    console.error('UpdateMultiple error details:', {
      status: error.status,
      message: error.message,
      error: error.error,
      data: dataToSave,
    });
  }

  private resetGridModifiedState() {
    if (this.gridApi) {
      // Reset trạng thái modified của tất cả rows
      this.gridApi.forEachNode((node) => {
        if (node.data) {
          node.data.isModified = false;
        }
      });

      // Refresh grid để hiển thị trạng thái mới
      this.gridApi.refreshCells();
    }
  }

  private saveMixedData(dataToSave: any[]) {
    const newRecords = dataToSave.filter((row) => row.id === 0);
    const existingRecords = dataToSave.filter((row) => row.id > 0);

    console.log(
      'Saving mixed data - New:',
      newRecords.length,
      'Existing:',
      existingRecords.length
    );

    // Thử sử dụng UpdateMultiple trước nếu có cả record mới và cũ
    this.tryUpdateMultiple(dataToSave);

    // Nếu UpdateMultiple thất bại, fallback về cách cũ
    // Lưu record mới trước
    if (newRecords.length > 0) {
      this.saveNewRecords(newRecords);
    }

    // Sau đó lưu record cũ
    if (existingRecords.length > 0) {
      setTimeout(() => {
        this.saveExistingRecords(existingRecords);
      }, 1000); // Delay 1 giây để đảm bảo record mới đã được lưu
    }
  }

  private tryUpdateMultiple(dataToSave: any[]) {
    console.log(
      'Trying UpdateMultiple for mixed data:',
      dataToSave.length,
      'records'
    );

    const updateMultipleEndpoints = [
      '/api/Nhatkyquatgio/UpdateMultiple',
      '/api/Nhatkyquatgio/updateMultiple',
      '/api/Nhatkyquatgio/UpdateMultiple',
      '/api/Nhatkyquatgio/update-multiple',
    ];

    this.trySaveEndpoints(
      dataToSave,
      updateMultipleEndpoints,
      0,
      'UpdateMultiple'
    );
  }

  private saveNewRecords(newRecords: any[]) {
    console.log('Saving new records:', newRecords);

    // Thử nhiều endpoint khác nhau cho việc tạo mới
    const createEndpoints = [
      '/api/Nhatkyquatgio',
      '/api/Nhatkyquatgio/create',
      '/api/Nhatkyquatgio/Create',
      '/api/Nhatkyquatgio/Add',
    ];

    this.trySaveEndpoints(newRecords, createEndpoints, 0, 'create');
  }

  private trySaveEndpoints(
    records: any[],
    endpoints: string[],
    index: number,
    action: 'create' | 'update' | 'UpdateMultiple'
  ) {
    if (index >= endpoints.length) {
      // Tất cả endpoints đều thất bại
      console.error(
        `All ${action} endpoints failed. Please check backend API configuration.`
      );

      let actionText = 'cập nhật';
      if (action === 'create') actionText = 'tạo mới';
      else if (action === 'UpdateMultiple') actionText = 'cập nhật hàng loạt';

      this.toastr.error(
        `Không thể ${actionText} dữ liệu. Vui lòng kiểm tra cấu hình backend.`,
        'Lỗi kết nối'
      );
      return;
    }

    const endpoint = endpoints[index];
    console.log(
      `Trying ${action} endpoint ${index + 1}/${endpoints.length}:`,
      endpoint
    );

    if (action === 'create') {
      this.saveRecordsWithEndpoint(records, endpoint, 'post');
    } else if (action === 'UpdateMultiple') {
      // Sử dụng POST cho UpdateMultiple endpoint
      this.saveRecordsWithEndpoint(records, endpoint, 'post');
    } else {
      this.saveRecordsWithEndpoint(records, endpoint, 'put');
    }
  }

  private saveRecordsWithEndpoint(
    records: any[],
    endpoint: string,
    method: 'post' | 'put'
  ) {
    let savedCount = 0;
    let errorCount = 0;

    records.forEach((record, index) => {
      const request =
        method === 'post'
          ? this.dataService.post(endpoint, record)
          : this.dataService.put(endpoint, record);

      request.subscribe({
        next: (response) => {
          console.log(
            `Record ${index + 1} ${
              method === 'post' ? 'saved' : 'updated'
            } successfully:`,
            response
          );
          savedCount++;

          if (savedCount === records.length) {
            this.getDataDetailById();
            this.toastr.success(
              `${
                method === 'post' ? 'Lưu' : 'Cập nhật'
              } thành công ${savedCount} bản ghi`,
              'Success'
            );
          }
        },
        error: (error) => {
          console.error(
            `Error ${method === 'post' ? 'saving' : 'updating'} record ${
              index + 1
            }:`,
            error
          );
          errorCount++;

          if (errorCount === records.length) {
            // Thử endpoint tiếp theo nếu tất cả đều thất bại
            if (method === 'post') {
              this.trySaveEndpoints(
                records,
                [
                  '/api/Nhatkyquatgio',
                  '/api/Nhatkyquatgio/create',
                  '/api/Nhatkyquatgio/Create',
                  '/api/Nhatkyquatgio/Add',
                ],
                1,
                'create'
              );
            } else {
              this.trySaveEndpoints(
                records,
                [
                  '/api/Nhatkyquatgio/update',
                  '/api/Nhatkyquatgio/Update',
                  '/api/Nhatkyquatgio/Edit',
                ],
                1,
                'update'
              );
            }
          }
        },
      });
    });
  }

  private saveExistingRecords(existingRecords: any[]) {
    console.log('Saving existing records:', existingRecords);

    // Thử nhiều endpoint khác nhau cho việc cập nhật
    const updateEndpoints = [
      '/api/Nhatkyquatgio/update',
      '/api/Nhatkyquatgio/Update',
      '/api/Nhatkyquatgio/Edit',
      '/api/Nhatkyquatgio/edit',
    ];

    this.trySaveEndpoints(existingRecords, updateEndpoints, 0, 'update');
  }

  private hasChanges(row: any): boolean {
    // Kiểm tra xem row có thay đổi không
    if (row.isModified) {
      return true;
    }

    // Kiểm tra các trường bắt buộc
    if (!row.ngaythang || !row.donVi || !row.viTri || !row.trangThai) {
      return false; // Không lưu nếu thiếu thông tin bắt buộc
    }

    return false; // Mặc định không có thay đổi
  }

  // Method để kiểm tra trạng thái kết nối API
  checkApiConnection() {
    console.log('Checking API connection status...');
    console.log('Current tonghopquatgioId:', this.tonghopquatgioId);
    console.log('Current entity:', this.entity);
    console.log('Current rowData count:', this.rowData.length);

    // Debug dữ liệu ngày tháng
    if (this.rowData.length > 0) {
      console.log('Sample row data for date debugging:');
      this.rowData.slice(0, 3).forEach((row, index) => {
        console.log(`Row ${index + 1}:`, {
          id: row.id,
          ngaythang: row.ngaythang,
          ngaythangType: typeof row.ngaythang,
          formattedDate: this.formatDateForAPI(row.ngaythang),
          // Kiểm tra các trường ngày khác có thể có
          ngayLap: (row as any).ngayLap,
          ngaySuDung: (row as any).ngaySuDung,
          ngay: (row as any).ngay,
          // Kiểm tra toàn bộ object để tìm trường ngày
          allFields: Object.keys(row).filter((key) =>
            key.toLowerCase().includes('ngay')
          ),
        });
      });
    }

    // Thử gọi một endpoint đơn giản để kiểm tra kết nối
    this.dataService.get('/api/Nhatkyquatgio').subscribe({
      next: (response) => {
        console.log(
          'API connection successful. Available endpoints:',
          response
        );
        this.toastr.success('Kết nối API thành công', 'Success');
      },
      error: (error) => {
        console.error('API connection failed:', error);
        this.toastr.error(
          'Không thể kết nối đến API: ' + (error.message || error),
          'Lỗi kết nối'
        );
      },
    });
  }

  // Method để reset và thử lại kết nối
  retryConnection() {
    console.log('Retrying connection...');
    this.rowData = [];
    this.getDataDetailById();
  }

  // Method để test và validate dữ liệu ngày tháng
  testDateValidation() {
    console.log('Testing date validation...');

    const testDates = [
      '2024-01-15',
      '15/01/2024',
      '01/15/2024',
      '2024-01-15T00:00:00',
      '2024-01-15T00:00:00.000Z',
      '1705276800000', // timestamp
      'invalid-date',
      '',
      null,
      undefined,
    ];

    testDates.forEach((testDate, index) => {
      const result = this.formatDateForAPI(testDate);
      console.log(`Test ${index + 1}:`, {
        input: testDate,
        inputType: typeof testDate,
        output: result,
        isValid: result !== '',
      });
    });
  }

  // Method để debug dữ liệu ngày tháng trong grid
  debugDateData() {
    console.log('=== Debug Date Data ===');
    console.log('Current rowData:', this.rowData);
    
    if (this.rowData && this.rowData.length > 0) {
      this.rowData.forEach((row, index) => {
        console.log(`Row ${index + 1}:`, {
          id: row.id,
          ngaythang: row.ngaythang,
          ngaythangType: typeof row.ngaythang,
          formattedDate: this.formatDateForDisplayFromAPI(row.ngaythang),
          // Kiểm tra các trường ngày khác có thể có
          ngayLap: (row as any).ngayLap,
          ngaySuDung: (row as any).ngaySuDung,
          ngay: (row as any).ngay,
          // Kiểm tra toàn bộ object để tìm trường ngày
          allFields: Object.keys(row).filter((key) =>
            key.toLowerCase().includes('ngay')
          ),
        });
      });
    } else {
      console.log('No row data available');
    }
  }

  // Method để test hiển thị ngày tháng
  testDateDisplay() {
    console.log('=== Test Date Display ===');
    
    // Test với dữ liệu mẫu
    const testData = [
      { ngaythang: '2024-01-15' },
      { ngaythang: '15/01/2024' },
      { ngaythang: '2024-01-15T00:00:00' },
      { ngaythang: '' },
      { ngayThang: null },
    ];

    testData.forEach((item, index) => {
      const formatted = this.formatDateForDisplayFromAPI(item.ngaythang);
      console.log(`Test ${index + 1}:`, {
        original: item.ngaythang,
        formatted: formatted,
        isValid: formatted !== '',
      });
    });

    // Test cell renderer
    if (this.rowData && this.rowData.length > 0) {
      const firstRow = this.rowData[0];
        console.log('First row ngaythang:', firstRow.ngaythang);
      
      // Simulate cell renderer
      const mockParams = { value: firstRow.ngaythang,
        column: {
          colId: 'ngaythang'
        }
      };
      console.log('Mock cell renderer params:', mockParams);
    }
  }

  // Method để force update dữ liệu ngày tháng trong grid
  forceUpdateDateDisplay() {
    console.log('=== Force Update Date Display ===');
    
    if (!this.gridApi || !this.rowData || this.rowData.length === 0) {
      console.log('Grid not ready or no data');
      return;
    }

    // Cập nhật lại dữ liệu ngày tháng
    this.rowData.forEach((row, index) => {
      if (row.ngaythang) {
        const formattedDate = this.formatDateForDisplayFromAPI(row.ngaythang);
        if (formattedDate && formattedDate !== row.ngaythang) {
          console.log(`Updating row ${index + 1}:`, {
            old: row.ngaythang,
            new: formattedDate
          });
          row.ngaythang = formattedDate;
        }
      }
    });

    // Refresh grid
    this.gridApi.refreshCells();
    console.log('Grid refreshed with updated dates');
  }

  // Method để test hiển thị dữ liệu string
  testStringDisplay() {
    console.log('=== Test String Display ===');
    
    // Test với dữ liệu mẫu string
    const testData = [
      { ngaythang: '15/01/2024' },
      { ngaythang: '2024-01-15' },
      { ngaythang: '01/15/2024' },
      { ngaythang: 'Ngày test' },
      { ngaythang: '' },
      { ngaythang: null },
    ];

    console.log('Test data:', testData);

    // Test cell renderer với dữ liệu mẫu
    testData.forEach((item, index) => {
      const mockParams = { value: item.ngaythang };
      console.log(`Test ${index + 1}:`, {
        input: item.ngaythang,
        inputType: typeof item.ngaythang,
        mockParams: mockParams
      });
    });

    // Test với dữ liệu thực tế từ grid
    if (this.rowData && this.rowData.length > 0) {
      console.log('Real data from grid:');
      this.rowData.forEach((row, index) => {
        console.log(`Row ${index + 1}:`, {
          id: row.id,
          ngaythang: row.ngaythang,
          ngaythangType: typeof row.ngaythang,
          hasNgaythang: !!row.ngaythang,
          ngaythangLength: row.ngaythang ? row.ngaythang.length : 0
        });
      });
    }
  }

  // Method để force set dữ liệu test vào grid
  forceSetTestData() {
    console.log('=== Force Set Test Data ===');
    
    if (!this.gridApi) {
      console.log('Grid not ready');
      return;
    }

    // Tạo dữ liệu test
    const testData = [
      {
        id: 1,
        tonghopquatgioId: this.tonghopquatgioId,
        ngaythang: '15/01/2024',
        donVi: 'Đơn vị test 1',
        viTri: 'Vị trí test 1',
        trangThai: 'Tình trạng test 1',
        ghiChu: 'Ghi chú test 1',
        isModified: false
      },
      {
        id: 2,
        tonghopquatgioId: this.tonghopquatgioId,
        ngaythang: '2024-01-16',
        donVi: 'Đơn vị test 2',
        viTri: 'Vị trí test 2',
        trangThai: 'Tình trạng test 2',
        ghiChu: 'Ghi chú test 2',
        isModified: false
      },
      {
        id: 3,
        tonghopquatgioId: this.tonghopquatgioId,
        ngaythang: 'Ngày test string',
        donVi: 'Đơn vị test 3',
        viTri: 'Vị trí test 3',
        trangThai: 'Tình trạng test 3',
        ghiChu: 'Ghi chú test 3',
        isModified: false
      }
    ];

    console.log('Setting test data:', testData);
    
    // Set dữ liệu test
    this.rowData = testData;
    
    // Refresh grid
    this.gridApi.refreshCells();
    console.log('Test data set to grid');
  }

  // Method để kiểm tra và sửa lỗi hiển thị ngay lập tức
  checkAndFixDisplay() {
    console.log('=== Check and Fix Display ===');
    
    if (!this.gridApi || !this.rowData || this.rowData.length === 0) {
      console.log('Grid not ready or no data');
      return;
    }

    // Kiểm tra từng row
    this.rowData.forEach((row, index) => {
      console.log(`Checking row ${index + 1}:`, {
        id: row.id,
        ngaythang: row.ngaythang,
        ngaythangType: typeof row.ngaythang,
        hasNgaythang: !!row.ngaythang,
        ngaythangLength: row.ngaythang ? row.ngaythang.length : 0,
        isString: typeof row.ngaythang === 'string',
        isEmpty: row.ngaythang === '',
        isNull: row.ngaythang === null,
        isUndefined: row.ngaythang === undefined
      });

      // Nếu ngayThang là null hoặc undefined, set thành chuỗi rỗng
      if (row.ngaythang === null || row.ngaythang === undefined) {
        console.log(`Fixing row ${index + 1}: setting null/undefined to empty string`);
        row.ngaythang = '';
      }
    });

    // Refresh grid
    this.gridApi.refreshCells();
    console.log('Grid refreshed after fixing');
  }

  // Method để debug grid data và columns
  debugGridData() {
    console.log('=== Debug Grid Data ===');
    
    if (!this.gridApi) {
      console.log('Grid API not ready');
      return;
    }

    // Debug columns
    const columns = this.gridApi.getColumns();
    console.log('Grid columns:', columns);
    
    // Debug column definitions
    console.log('Column definitions:', this.colDefs);
    
    // Debug row data
    const allRows = this.gridApi.getRenderedNodes();
    console.log('All rendered nodes:', allRows.length);
    
    allRows.forEach((node, index) => {
      console.log(`Node ${index + 1}:`, {
        data: node.data,
        id: node.data?.id,
          ngaythang: node.data?.ngaythang,
        ngaythangType: typeof node.data?.ngaythang,
        hasNgaythang: !!node.data?.ngaythang
      });
    });

    // Debug current rowData
    console.log('Current rowData:', this.rowData);
    console.log('rowData length:', this.rowData?.length);
  }

  // Method để kiểm tra và sửa lỗi field mapping
  checkAndFixFieldMapping() {
    console.log('=== Check and Fix Field Mapping ===');
    
    if (!this.rowData || this.rowData.length === 0) {
      console.log('No row data to check');
      return;
    }

    // Kiểm tra field mapping trong từng row
    this.rowData.forEach((row, index) => {
      const rowAny = row as any;
      console.log(`Checking row ${index + 1} field mapping:`, {
        id: row.id,
        allFields: Object.keys(row),
        hasNgaythang: 'ngaythang' in row,
          ngaythangValue: row.ngaythang,
        ngaythangType: typeof row.ngaythang,
        // Kiểm tra các field ngày khác có thể có
        hasNgayLap: 'ngayLap' in row,
        hasNgaySuDung: 'ngaySuDung' in row,
        hasNgay: 'ngay' in row,
        ngayLapValue: rowAny.ngayLap,
        ngaySuDungValue: rowAny.ngaySuDung,
        ngayValue: rowAny.ngay
      });

      // Nếu không có field ngayThang nhưng có field ngày khác, copy giá trị
                  if (!('ngaythang' in row)) {
        if (rowAny.ngayLap) {
          console.log(`Row ${index + 1}: Copying ngayLap to ngaythang`);
          rowAny.ngaythang = rowAny.ngayLap;
        } else if (rowAny.ngaySuDung) {
          console.log(`Row ${index + 1}: Copying ngaySuDung to ngaythang`);
          rowAny.ngaythang = rowAny.ngaySuDung;
        } else if (rowAny.ngay) {
          console.log(`Row ${index + 1}: Copying ngay to ngaythang`);
          rowAny.ngaythang = rowAny.ngay;
        } else {
          console.log(`Row ${index + 1}: Setting empty ngaythang`);
          rowAny.ngaythang = '';
        }
      }
    });

    // Refresh grid nếu có thay đổi
    if (this.gridApi) {
      this.gridApi.refreshCells();
      console.log('Grid refreshed after field mapping fix');
    }
  }

  // Method để force refresh grid và đảm bảo dữ liệu được hiển thị
  forceRefreshGrid() {
    console.log('=== Force Refresh Grid ===');
    
    if (!this.gridApi) {
      console.log('Grid API not ready');
      return;
    }

    // Force refresh toàn bộ grid
    this.gridApi.refreshCells();
    
    // Force redraw
    this.gridApi.redrawRows();
    
    // Force size columns to fit
    this.gridApi.sizeColumnsToFit();
    
    console.log('Grid force refreshed');
    
    // Debug sau khi refresh
    setTimeout(() => {
      this.debugGridData();
    }, 100);
  }

  // Method để format ngày hiển thị
  private formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  // Method để format ngày từ API về hiển thị cho người dùng
  private formatDateForDisplayFromAPI(dateInput: any): string {
    if (!dateInput) return '';

    console.log('formatDateForDisplayFromAPI input:', dateInput, 'type:', typeof dateInput);

    try {
      // Nếu đã là format dd/mm/yyyy, trả về trực tiếp
      if (typeof dateInput === 'string' && dateInput.includes('/')) {
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        if (dateRegex.test(dateInput)) {
          console.log('Already in dd/mm/yyyy format:', dateInput);
          return dateInput;
        }
      }

      let date: Date;

      if (typeof dateInput === 'string') {
        // Nếu là format yyyy-mm-dd từ API
        if (dateInput.includes('-') && dateInput.length === 10) {
          const parts = dateInput.split('-');
          if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const day = parseInt(parts[2]);
            date = new Date(year, month - 1, day);
            console.log('Parsed yyyy-mm-dd:', { year, month, day, date });
          } else {
            date = new Date(dateInput);
          }
        } else if (dateInput.includes('T')) {
          // ISO date format (yyyy-mm-ddTHH:mm:ss)
          date = new Date(dateInput);
        } else {
          // Thử parse các format khác
          date = new Date(dateInput);
        }
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        // Timestamp hoặc format khác
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) {
        console.warn('Invalid date input:', dateInput);
        return '';
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      const result = `${day}/${month}/${year}`;
      console.log('Formatted date result:', result);
      return result;
    } catch (error) {
      console.error('Error formatting date for display:', error, 'Input:', dateInput);
      return '';
    }
  }

  // Method để format ngày cho API
  private formatDateForAPI(dateInput: any): string {
    if (!dateInput) return '';

    try {
      let date: Date;

      if (typeof dateInput === 'string') {
        // Xử lý các format string khác nhau
        if (dateInput.includes('/')) {
          // Format dd/mm/yyyy hoặc mm/dd/yyyy
          const parts = dateInput.split('/');
          if (parts.length === 3) {
            // Giả sử format là dd/mm/yyyy
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            
            // Validate ngày tháng
            if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
              date = new Date(year, month - 1, day);
            } else {
              console.warn('Invalid date parts:', { day, month, year });
              return '';
            }
          } else {
            date = new Date(dateInput);
          }
        } else if (dateInput.includes('-')) {
          // Format yyyy-mm-dd hoặc dd-mm-yyyy
          date = new Date(dateInput);
        } else {
          // Format khác, thử parse trực tiếp
          date = new Date(dateInput);
        }
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        // Timestamp hoặc format khác
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) {
        console.warn('Invalid date input:', dateInput);
        return '';
      }

      // Kiểm tra ngày hợp lệ (không quá xa trong quá khứ hoặc tương lai)
      const currentYear = new Date().getFullYear();
      if (date.getFullYear() < 1900 || date.getFullYear() > currentYear + 10) {
        console.warn('Date out of reasonable range:', date);
        return '';
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      console.log('Formatted date:', dateInput, '->', formattedDate);

      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', dateInput);
      return '';
    }
  }
}


