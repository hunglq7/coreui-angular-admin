import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhatkymayxucTabComponent } from '../nhatkymayxuc-tab/nhatkymayxuc-tab.component';
import { ThongsomayxucTabComponent } from '../thongsomayxuc-tab/thongsomayxuc-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  RowComponent,
  ColComponent,
  TabDirective,
  FormControlDirective,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
} from '@coreui/angular';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import {
  TongHopMayXuc,
  TonghopMayxucDetail,
} from '../../../core/interface/mayxuc/mayxuc';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
@Component({
  selector: 'app-tonghopmayxuc',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormControlDirective,
    FormSelectDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    RowComponent,
    ColComponent,
    PaginationModule,
    DropdownModule,
    SharedModule,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    NhatkymayxucTabComponent,
    ThongsomayxucTabComponent,
    SelectSearchComponent,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzCascaderModule,
    NzTableModule,
    NzFloatButtonModule,
    NzModalModule,
    NzToolTipModule,
    NzFormModule,
  ],
  templateUrl: './tonghopmayxuc.component.html',
  styleUrl: './tonghopmayxuc.component.scss',
})
export class TonghopmayxucComponent implements OnInit {
  public liveDemoVisible = false;
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  sumSoluong!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  keywordThietbi: number = 0;
  keywordDonvi: number = 0;
  kywordDuphong: boolean = false;
  dataMayxucDetail: TongHopMayXuc[] = [];
  tonghopmayxucDetail: TonghopMayxucDetail = {
    id: 0,
    mayXucId: 0,
    maQuanLy: '',
    loaiThietBiId: 0,
    phongBanId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 0,
    tinhTrang: '',
    ghiChu: '',
  };
  dsMayxuc: any[] = [];
  dsDonvi: any[] = [];
  dsLoai: any[] = [];
  Form!: FormGroup;
  Id: Number = 0;
  public themoi: boolean = false;
  size: NzButtonSize = 'small';
  ngOnInit(): void {
    // Kiểm tra xác thực trước khi load dữ liệu
    this.checkAuthentication();
    
    // Chỉ load danh sách, không gọi create/detail ở init để tránh lỗi 500 không cần thiết
    this.loadTonghopMayxuc();
    this.getDataDonvi();
    this.getLoaiThietBi();
    this.getDataMayxuc();
  }

  private checkAuthentication() {
    const token = this.dataService.authenService.accessToken;
    console.log('Current access token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.warn('No access token found. User may need to login again.');
      this.toastr.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'Warning');
    }
  }

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {
    this.initFormBuilder();
  }
  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl({ value: null, disabled: false }),
      maQuanLy: new FormControl({ value: null, disabled: false }),
      mayXucId: new FormControl({ value: null, disabled: false }),
      phongBanId: new FormControl({ value: null, disabled: false }),
      loaiThietBiId: new FormControl({ value: null, disabled: false }),
      viTriLapDat: new FormControl({ value: null, disabled: false }),
      ngayLap: new FormControl({ value: null, disabled: false }),
      soLuong: new FormControl({ value: null, disabled: false }),
      tinhTrang: new FormControl({ value: null, disabled: false }),
      ghiChu: new FormControl({ value: null, disabled: false }),
    });
  }
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true,
  };

  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.loadTonghopMayxuc();
  }

  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.loadTonghopMayxuc();
  }

  eventDuPhong($event: any) {
    this.kywordDuphong = !!$event;
    this.loadTonghopMayxuc();
  }
  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.loadTonghopMayxuc();
  }
  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.loadTonghopMayxuc();
  }
  getLoaiThietBi() {
    this.dataService.get('/api/Loaithietbi').subscribe({
      next: (data: any) => {
        console.log('Loaded loai thiet bi:', data);
        this.dsLoai = data;
      },
      error: (err) => {
        console.error('Error loading loai thiet bi:', err);
        this.toastr.error('Không tải được danh sách loại thiết bị', 'Error');
        this.dsLoai = [];
      }
    });
  }

  loadTonghopMayxucDetail() {
    if (!this.Id || Number(this.Id) <= 0) {
      console.warn('Cannot load detail: Invalid ID:', this.Id);
      return;
    }

    this.dataService.getById('/api/Tonghopmayxuc/' + this.Id).subscribe({
      next: (data: TonghopMayxucDetail) => {
        console.log('Loaded detail data:', data);
        this.tonghopmayxucDetail = data;
        
        // Normalize date format
        if (data.ngayLap) {
          var myDate = new Date(data.ngayLap);
          var myDateString;
          myDateString =
            myDate.getFullYear() +
            '-' +
            ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + myDate.getDate()).slice(-2);
          this.tonghopmayxucDetail.ngayLap = myDateString;
        }
        
        this.loadFormData(this.tonghopmayxucDetail);
      },
      error: (err) => {
        console.error('Error loading detail:', err);
        this.toastr.error('Không thể tải thông tin chi tiết', 'Error');
      }
    });
  }

  addNewTonghopMayxucDetail() {
    // Create a new empty record instead of calling API with ID 0
    const today = new Date().toISOString().split('T')[0];
    this.tonghopmayxucDetail = {
      id: 0,
      mayXucId: 0,
      maQuanLy: '',
      loaiThietBiId: 0,
      phongBanId: 0,
      viTriLapDat: '',
      ngayLap: today,
      soLuong: 1,
      tinhTrang: '',
      ghiChu: '',
    };
    this.loadFormData(this.tonghopmayxucDetail);
  }

  private loadFormData(mayxuc: TonghopMayxucDetail) {
    this.tonghopmayxucDetail = mayxuc;
    this.Form.setValue({
      id: mayxuc.id,
      maQuanLy: mayxuc.maQuanLy,
      mayXucId: mayxuc.mayXucId,
      phongBanId: mayxuc.phongBanId,
      loaiThietBiId: mayxuc.loaiThietBiId,
      viTriLapDat: mayxuc.viTriLapDat,
      ngayLap: mayxuc.ngayLap,
      soLuong: mayxuc.soLuong,
      tinhTrang: mayxuc.tinhTrang,
      ghiChu: mayxuc.ghiChu,
    });
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        console.log('Loaded don vi:', data);
        this.dsDonvi = data;
      },
      error: (err) => {
        console.error('Error loading don vi:', err);
        this.toastr.error('Không tải được danh sách đơn vị', 'Error');
        this.dsDonvi = [];
      }
    });
  }

  getDataMayxuc() {
    this.dataService.get('/api/Mayxuc').subscribe({
      next: (data: any) => {
        console.log('Loaded may xuc:', data);
        this.dsMayxuc = data;
      },
      error: (err) => {
        console.error('Error loading may xuc:', err);
        this.toastr.error('Không tải được danh sách máy xúc', 'Error');
        this.dsMayxuc = [];
      }
    });
  }

  loadTonghopMayxuc() {
    // Kiểm tra và chuẩn hóa các tham số trước khi gửi request
    const thietbiId = this.keywordThietbi || 0;
    const donviId = this.keywordDonvi || 0;
    const duPhong = this.kywordDuphong;
    const pageIndex = Math.max(1, this.pageIndex);
    const pageSize = Math.max(1, Math.min(100, this.pageSize)); // Giới hạn pageSize từ 1-100
    
    const url = `/api/Tonghopmayxuc/paging?thietbiId=${thietbiId}&donviId=${donviId}&duPhong=${duPhong}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    console.log('Loading data from URL:', url);
    console.log('Request parameters:', { thietbiId, donviId, pageIndex, pageSize });
    
    // Thêm timeout và retry logic
    this.dataService.get(url).subscribe({
      next: (resp: any) => {
        console.log('loadTonghopMayxuc response:', resp);
        
        let items: any[] = [];
        let pageSize = this.pageSize;
        let pageIndex = this.pageIndex;
        let totalRecords = 0;
        let sumRecords = 0;

        if (Array.isArray(resp)) {
          items = resp;
          totalRecords = resp.length;
          console.log('Response is array, items count:', items.length);
        } else if (resp && typeof resp === 'object') {
          if (Array.isArray(resp.items)) {
            items = resp.items;
            pageSize = resp.pageSize ?? pageSize;
            pageIndex = resp.pageIndex ?? pageIndex;
            totalRecords = resp.totalRecords ?? items.length;
            sumRecords = resp.sumRecords ?? 0;
            console.log('Response has items array, count:', items.length);
          } else if (Array.isArray(resp.data)) {
            items = resp.data;
            pageSize = resp.pageSize ?? pageSize;
            pageIndex = resp.pageIndex ?? pageIndex;
            totalRecords = resp.total ?? resp.totalRecords ?? items.length;
            sumRecords = resp.sum ?? resp.sumRecords ?? 0;
            console.log('Response has data array, count:', items.length);
          } else {
            console.warn('Unexpected response structure:', resp);
            items = [];
          }
        } else {
          console.warn('Invalid response type:', typeof resp);
          items = [];
        }

        this.dataMayxucDetail = items;
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
        this.totalRow = totalRecords;
        this.sumSoluong = sumRecords;
        
        console.log('Final data state:', {
          itemsCount: this.dataMayxucDetail.length,
          totalRow: this.totalRow,
          sumSoluong: this.sumSoluong,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        });
        
        // Log cấu trúc dữ liệu nếu có
        if (this.dataMayxucDetail.length > 0) {
          console.log('Sample data item:', this.dataMayxucDetail[0]);
          console.log('Data item properties:', Object.keys(this.dataMayxucDetail[0]));
        }
      },
      error: (err) => {
        console.error('loadTonghopMayxuc error:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url,
          error: err.error
        });
        
        // Khi paging API lỗi, thử fallback sang API không phân trang (nếu backend hỗ trợ)
        if (err.status === 500 || err.status === 404) {
          const fallbackUrl = `/api/Tonghopmayxuc`;
          console.warn('Trying fallback URL:', fallbackUrl);
          this.dataService.get(fallbackUrl).subscribe({
            next: (list: any) => {
              const items: any[] = Array.isArray(list)
                ? list
                : (list && Array.isArray(list.data) ? list.data : []);
              this.dataMayxucDetail = items;
              this.totalRow = items.length;
              this.sumSoluong = items.reduce((acc, cur) => acc + (Number(cur?.soLuong) || 0), 0);
              this.toastr.info('Đã dùng phương án dự phòng để tải dữ liệu', 'Info');
            },
            error: (fallbackErr) => {
              console.error('Fallback load error:', fallbackErr);
              this.toastr.error('Không tải được dữ liệu (fallback)', 'Error');
              this.dataMayxucDetail = [];
              this.totalRow = 0;
              this.sumSoluong = 0;
            }
          });
          return;
        }

        // Hiển thị thông báo thân thiện theo status
        let errorMessage = 'Không tải được dữ liệu';
        if (err.status === 500) {
          errorMessage = 'Lỗi server (500). Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        } else if (err.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (err.status === 403) {
          errorMessage = 'Không có quyền truy cập dữ liệu này.';
        } else if (err.status === 404) {
          errorMessage = 'API endpoint không tồn tại.';
        } else if (err.status === 0) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        }
        this.toastr.error(errorMessage, 'Error');
        this.dataMayxucDetail = [];
        this.totalRow = 0;
        this.sumSoluong = 0;
      }
    });
  }

  public pageChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopMayxuc();
  }

  onThemmoi() {
    this.title = 'Thêm máy xúc';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopMayxucDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopMayxucDetail();
    this.title = 'Sửa máy xúc';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  showConfirm(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bạn có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Thiết bị: </b>' + item.tenMayXuc,
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.onDelete(item.id),
    });
  }
  onDelete(id: number) {
    console.log('Deleting item with Id:', id);
    this.dataService.delete('/api/Tonghopmayxuc/' + id).subscribe({
      next: () => {
        this.loadTonghopMayxuc();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

  save() {
    const raw = this.Form.getRawValue();
    console.log('Raw form data:', raw);
    
    // Chuẩn hóa và validate payload trước khi gửi
    const payload = this.buildPayload(raw);
    if (!payload) {
      this.toastr.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường bắt buộc.', 'Error');
      return;
    }

    console.log('Validated payload:', payload);

    if (this.themoi) {
      console.log('Creating new record with payload:', payload);
      this.dataService.post('/api/Tonghopmayxuc', payload).subscribe({
        next: (response) => {
          console.log('Create success response:', response);
          this.loadTonghopMayxuc();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: (err) => {
          console.error('Create Tonghopmayxuc failed:', { 
            error: err, 
            payload: payload,
            status: err.status,
            statusText: err.statusText,
            message: err.error?.message || err.message
          });
          
          let errorMessage = 'Lưu dữ liệu thất bại';
          if (err.status === 500) {
            errorMessage = 'Lỗi server (500). Vui lòng kiểm tra dữ liệu và thử lại.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          
          this.toastr.error(errorMessage, 'Error');
        },
      });
    } else {
      console.log('Updating record with payload:', payload);
      this.dataService
        .put('/api/Tonghopmayxuc/update', payload)
        .subscribe({
          next: (response) => {
            console.log('Update success response:', response);
            this.loadTonghopMayxuc();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.liveDemoVisible = !this.liveDemoVisible;
            this.Form.reset();
          },
          error: (err) => {
            console.error('Update Tonghopmayxuc failed:', { 
              error: err, 
              payload: payload,
              status: err.status,
              statusText: err.statusText,
              message: err.error?.message || err.message
            });
            
            let errorMessage = 'Lưu dữ liệu thất bại';
            if (err.status === 500) {
              errorMessage = 'Lỗi server (500). Vui lòng kiểm tra dữ liệu và thử lại.';
            } else if (err.error?.message) {
              errorMessage = err.error.message;
            }
            
            this.toastr.error(errorMessage, 'Error');
          },
        });
    }
  }

  private buildPayload(formValue: any): any | null {
    try {
      console.log('Building payload from form value:', formValue);
      
      const toNumber = (v: any) => {
        const num = v === null || v === '' || isNaN(+v) ? 0 : +v;
        console.log(`Converting ${v} to number: ${num}`);
        return num;
      };
      const toTrim = (v: any) => {
        const trimmed = (v ?? '').toString().trim();
        console.log(`Converting ${v} to trimmed string: "${trimmed}"`);
        return trimmed;
      };

      // Chuẩn hóa ngày yyyy-MM-dd
      const normalizeDate = (v: any): string => {
        console.log('Normalizing date:', v);
        if (!v) {
          console.log('Date is empty, returning empty string');
          return '';
        }
        // Hỗ trợ cả DD/MM/YYYY và YYYY-MM-DD
        if (typeof v === 'string') {
          const s = v.trim();
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
            const [dd, mm, yyyy] = s.split('/');
            const result = `${yyyy}-${mm}-${dd}`;
            console.log(`Converted DD/MM/YYYY ${s} to ${result}`);
            return result;
          }
          if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
            console.log(`Date already in YYYY-MM-DD format: ${s}`);
            return s;
          }
        }
        const d = new Date(v);
        if (isNaN(d.getTime())) {
          console.log('Invalid date object, returning empty string');
          return '';
        }
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const result = `${yyyy}-${mm}-${dd}`;
        console.log(`Converted date object ${v} to ${result}`);
        return result;
      };

      const payload = {
        id: toNumber(formValue.id),
        mayXucId: toNumber(formValue.mayXucId),
        maQuanLy: toTrim(formValue.maQuanLy),
        loaiThietBiId: toNumber(formValue.loaiThietBiId),
        phongBanId: toNumber(formValue.phongBanId),
        viTriLapDat: toTrim(formValue.viTriLapDat),
        ngayLap: normalizeDate(formValue.ngayLap),
        soLuong: toNumber(formValue.soLuong),
        tinhTrang: toTrim(formValue.tinhTrang),
        ghiChu: toTrim(formValue.ghiChu),
      } as TonghopMayxucDetail;

      console.log('Built payload:', payload);

      // Validate các trường bắt buộc tối thiểu
      if (!payload.mayXucId || payload.mayXucId <= 0) {
        console.error('Validation failed: mayXucId is required and must be > 0');
        return null;
      }
      if (!payload.loaiThietBiId || payload.loaiThietBiId <= 0) {
        console.error('Validation failed: loaiThietBiId is required and must be > 0');
        return null;
      }
      if (!payload.phongBanId || payload.phongBanId <= 0) {
        console.error('Validation failed: phongBanId is required and must be > 0');
        return null;
      }
      if (!payload.ngayLap) {
        console.error('Validation failed: ngayLap is required');
        return null;
      }

      console.log('Payload validation passed');
      return payload;
    } catch (e) {
      console.error('buildPayload error:', e, formValue);
      return null;
    }
  }

  onReset() {
    this.Form.reset();
  }

  public panes = [
    { name: 'Home 01', id: 'tab-01', icon: 'cilHome' },
    { name: 'Profile 02', id: 'tab-02', icon: 'cilUser' },
    { name: 'Contact 03', id: 'tab-03', icon: 'cilCode' },
  ];

  readonly activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataMayxucDetail);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopmayxuc.xlsx');
  }

  // Phương thức debug để kiểm tra dữ liệu
  debugData() {
    console.log('=== DEBUG DATA ===');
    console.log('dataMayxucDetail:', this.dataMayxucDetail);
    console.log('dsMayxuc:', this.dsMayxuc);
    console.log('dsDonvi:', this.dsDonvi);
    console.log('dsLoai:', this.dsLoai);
    console.log('Current page info:', {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      totalRow: this.totalRow,
      sumSoluong: this.sumSoluong
    });
    console.log('Search filters:', {
      keywordThietbi: this.keywordThietbi,
      keywordDonvi: this.keywordDonvi
    });
    console.log('==================');
  }

  // Phương thức test kết nối API
  testApiConnection() {
    console.log('=== TESTING API CONNECTION ===');
    
    // Test 1: Kiểm tra base URL
    console.log('Base URL:', this.dataService.baseUrl);
    
    // Test 2: Kiểm tra token
    const token = this.dataService.authenService.accessToken;
    console.log('Access Token:', token ? 'Present' : 'Missing');
    
    // Test 3: Test endpoint đơn giản
    this.dataService.get('/api/Phongban').subscribe({
      next: (data) => {
        console.log('✅ Phongban API works:', data);
        this.toastr.success('Kết nối API thành công', 'Success');
      },
      error: (err) => {
        console.error('❌ Phongban API failed:', err);
        this.toastr.error(`Test API failed: ${err.status}`, 'Error');
      }
    });
    
    // Test 4: Test endpoint chính với tham số tối thiểu
    const testUrl = `/api/Tonghopmayxuc/paging?thietbiId=0&donviId=0&PageIndex=1&PageSize=5`;
    console.log('Testing main endpoint:', testUrl);
    
    this.dataService.get(testUrl).subscribe({
      next: (data) => {
        console.log('✅ Main API works:', data);
        this.toastr.success('API chính hoạt động bình thường', 'Success');
      },
      error: (err) => {
        console.error('❌ Main API failed:', err);
        this.toastr.error(`API chính lỗi: ${err.status} - ${err.statusText}`, 'Error');
      }
    });
  }

  // Phương thức thử load dữ liệu với các tham số khác nhau
  tryDifferentParameters() {
    console.log('=== TRYING DIFFERENT PARAMETERS ===');
    
    const testCases = [
      { name: 'Basic', params: 'thietbiId=0&donviId=0&PageIndex=1&PageSize=10' },
      { name: 'No params', params: '' },
      { name: 'Small page', params: 'PageIndex=1&PageSize=1' },
      { name: 'Large page', params: 'PageIndex=1&PageSize=50' },
      { name: 'With filters', params: 'thietbiId=1&donviId=1&PageIndex=1&PageSize=10' }
    ];
    
    testCases.forEach((testCase, index) => {
      setTimeout(() => {
        const url = `/api/Tonghopmayxuc/paging${testCase.params ? '?' + testCase.params : ''}`;
        console.log(`Testing ${testCase.name}:`, url);
        
        this.dataService.get(url).subscribe({
          next: (data) => {
            console.log(`✅ ${testCase.name} works:`, data);
          },
          error: (err) => {
            console.error(`❌ ${testCase.name} failed:`, err.status, err.statusText);
          }
        });
      }, index * 1000); // Delay 1 second between tests
    });
  }

  // Phương thức load dữ liệu với tham số tối thiểu
  loadDataWithMinimalParams() {
    console.log('=== LOADING WITH MINIMAL PARAMS ===');
    
    // Reset các tham số tìm kiếm về 0
    this.keywordThietbi = 0;
    this.keywordDonvi = 0;
    this.pageIndex = 1;
    this.pageSize = 10;
    
    // Load lại dữ liệu
    this.loadTonghopMayxuc();
  }

  // Phương thức kiểm tra cấu trúc dữ liệu
  checkDataStructure() {
    console.log('=== CHECKING DATA STRUCTURE ===');
    
    if (this.dataMayxucDetail && this.dataMayxucDetail.length > 0) {
      const firstItem = this.dataMayxucDetail[0];
      console.log('First item structure:', firstItem);
      console.log('Available properties:', Object.keys(firstItem));
      
      // Kiểm tra từng trường
      console.log('maQuanLy:', firstItem.maQuanLy, typeof firstItem.maQuanLy);
      console.log('tenMayXuc:', firstItem.tenMayXuc, typeof firstItem.tenMayXuc);
      console.log('tenPhongBan:', firstItem.tenPhongBan, typeof firstItem.tenPhongBan);
      console.log('viTriLapDat:', firstItem.viTriLapDat, typeof firstItem.viTriLapDat);
      console.log('ngayLap:', firstItem.ngayLap, typeof firstItem.ngayLap);
      console.log('soLuong:', firstItem.soLuong, typeof firstItem.soLuong);
    } else {
      console.log('No data available to check structure');
    }
  }
}
