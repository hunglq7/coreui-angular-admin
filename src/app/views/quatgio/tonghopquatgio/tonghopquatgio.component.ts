import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import { NhatkyquatgioTabComponent } from '../nhatkyquatgio-tab/nhatkyquatgio-tab.component';
import { ThongsoquatgioTabComponent } from '../thongsoquatgio-tab/thongsoquatgio-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
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
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
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
import {
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
} from '@coreui/angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
export interface Tonghopquatgio {
  id: number;
  maQuanLy: string;
  tenThietBi: number;
  tenDonVi: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  duPhong:boolean;
  ghiChu: string;
}

export interface TonghopquatgioDetail {
  id: number;
  maQuanLy: string;
  quatGioId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  duPhong:boolean;
  ghiChu: string;
}
@Component({
  selector: 'app-tonghopquatgio',
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
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    PaginationModule,
    DropdownModule,
    SharedModule,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    FormsModule,
    NhatkyquatgioTabComponent,
    ThongsoquatgioTabComponent,
    SelectSearchComponent,
    NzIconModule,
    NzButtonModule,
    NzToolTipModule,
    NzTableModule,
    NzFormModule,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
  ],
  templateUrl: './tonghopquatgio.component.html',
  styleUrl: './tonghopquatgio.component.scss',
})
export class TonghopquatgioComponent implements OnInit {
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
  dataQuatgioDetail: Tonghopquatgio[] = [];
  tonghopquatgioDetail: TonghopquatgioDetail = {
    id: 0,
    maQuanLy: '',
    quatGioId: 0,
    donViId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 0,
    tinhTrangThietBi: '',
    duPhong:false,
    ghiChu: '',
  };
  dsQuatgio: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  public themoi: boolean = false;
  size: NzButtonSize = 'small';
  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopQuatgio();
    this.getDataDonvi();
    this.getDataQuatgio();
    if (this.Id === 0) {
      this.addNew();
    } else {
      this.loadTonghopQuatgioDetail();
    }
  }
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadTonghopQuatgio();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopQuatgio();
  }

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: [0],
      maQuanLy: [''],
      quatGioId: [0, [Validators.required, Validators.min(1)]],
      donViId: [0, [Validators.required, Validators.min(1)]],
      viTriLapDat: ['', [Validators.required, Validators.minLength(1)]],
      ngayLap: [new Date(), Validators.required],
      soLuong: [1, [Validators.required, Validators.min(1)]],
      tinhTrangThietBi: [''],
      duPhong:[false],
      ghiChu: [''],
    });
  }

  loadTonghopQuatgioDetail() {
    if (!this.Id || this.Id === 0) {
      console.warn('ID is not valid for loading detail');
      return;
    }

    console.log('Loading detail for ID:', this.Id);
    this.dataService.getById('/api/Tonghopquatgio/' + this.Id).subscribe({
      next: (data: TonghopquatgioDetail) => {
        console.log('Received data:', data);
        if (data) {
          this.tonghopquatgioDetail = data;
          if (data.ngayLap) {
            try {
              var myDate = new Date(data.ngayLap);
              if (!isNaN(myDate.getTime())) {
                var myDateString =
                  myDate.getFullYear() +
                  '-' +
                  ('0' + (myDate.getMonth() + 1)).slice(-2) +
                  '-' +
                  ('0' + myDate.getDate()).slice(-2);
                this.tonghopquatgioDetail.ngayLap = myDateString;
              }
            } catch (dateError) {
              console.error('Error parsing date:', dateError);
            }
          }
          this.loadFormData(this.tonghopquatgioDetail);
        } else {
          console.warn('No data received from API');
          this.toastr.warning('Không có dữ liệu để hiển thị', 'Warning');
        }
      },
      error: (error) => {
        console.error('Error loading detail:', error);
        this.toastr.error(
          'Không thể tải dữ liệu chi tiết: ' + (error.message || error),
          'Error'
        );
      },
    });
  }

  addNew() {
    console.log('Adding new record');

    // Reset form về trạng thái ban đầu
    this.Form.reset();

    // Set default values cho form
    this.Form.patchValue({
      id: 0,
      maQuanLy: '',
      quatGioId: 0,
      donViId: 0,
      viTriLapDat: '',
      ngayLap: new Date().toISOString().split('T')[0],
      soLuong: 1,
      tinhTrangThietBi: '',
      duPhong:false,
      ghiChu: '',
    });

    // Cập nhật tonghopquatgioDetail
    this.tonghopquatgioDetail = {
      id: 0,
      maQuanLy: '',
      quatGioId: 0,
      donViId: 0,
      viTriLapDat: '',
      ngayLap: new Date().toISOString().split('T')[0],
      soLuong: 1,
      tinhTrangThietBi: '',
      duPhong:false,
      ghiChu: '',
    };

    // Mark form as pristine và untouched
    this.Form.markAsPristine();
    this.Form.markAsUntouched();
  }
  private loadFormData(entity: TonghopquatgioDetail) {
    console.log('Loading form data:', entity);
    this.tonghopquatgioDetail = entity;

    try {
      // Đảm bảo dữ liệu có định dạng đúng trước khi set vào form
      const formData = {
        id: entity.id || 0,
        maQuanLy: entity.maQuanLy || '',
        quatGioId: entity.quatGioId || 0,
        donViId: entity.donViId || 0,
        viTriLapDat: entity.viTriLapDat || '',
        ngayLap: this.formatDate(entity.ngayLap),
        soLuong: entity.soLuong || 1,
        tinhTrangThietBi: entity.tinhTrangThietBi || '',
        duPhong:entity.duPhong|| false,
        ghiChu: entity.ghiChu || '',
      };

      this.Form.patchValue(formData);

      // Mark form as pristine và untouched sau khi load data
      this.Form.markAsPristine();
      this.Form.markAsUntouched();

      console.log('Form data loaded successfully');
    } catch (error) {
      console.error('Error setting form values:', error);
      this.toastr.error('Lỗi khi tải dữ liệu vào form', 'Error');
    }
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
      error: (error) => {
        console.error('Error loading donvi data:', error);
        this.toastr.error('Không thể tải dữ liệu đơn vị', 'Error');
      },
    });
  }

  getDataQuatgio() {
    this.dataService.get('/api/Danhmucquatgio').subscribe({
      next: (data: any) => {
        this.dsQuatgio = data;
      },
      error: (error) => {
        console.error('Error loading quatgio data:', error);
        this.toastr.error('Không thể tải dữ liệu quạt gió', 'Error');
      },
    });
  }

  loadTonghopQuatgio() {
    const url =
      '/api/Tonghopquatgio/paging?thietbiId=' +
      this.keywordThietbi +
      '&donviId=' +
      this.keywordDonvi +
      '&PageIndex=' +
      this.pageIndex +
      '&PageSize=' +
      this.pageSize;

    console.log('Loading data from:', url);

    this.dataService.get(url).subscribe({
      next: (data: any) => {
        console.log('Received data:', data);
        this.dataQuatgioDetail = data.items || [];
        this.pageSize = data.pageSize || 10;
        this.pageIndex = data.pageIndex || 1;
        this.totalRow = data.totalRecords || 0;
        this.sumSoluong = data.sumRecords || 0;
        console.log('Data loaded successfully. Total records:', this.totalRow);
      },
      error: (error) => {
        console.error('Error loading tonghop quatgio:', error);
        let errorMessage = 'Không thể tải dữ liệu tổng hợp quạt gió';

        if (error.status === 404) {
          errorMessage =
            'API endpoint không tìm thấy. Vui lòng kiểm tra cấu hình backend.';
        } else if (error.status === 400) {
          errorMessage =
            'Tham số không hợp lệ: ' +
            (error.error?.message || error.message || '');
        } else if (error.status === 500) {
          errorMessage =
            'Lỗi server: ' + (error.error?.message || error.message || '');
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }

        this.toastr.error(errorMessage, 'Error');
        this.dataQuatgioDetail = [];
        this.totalRow = 0;
        this.sumSoluong = 0;
      },
    });
  }

  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopQuatgio();
  }
  pageSizeChange(event: number): void {
    this.pageSize = event;
    this.loadTonghopQuatgio();
  }
  onThemmoi() {
    this.title = 'Thêm quạt gió';
    this.themoi = true;
    this.Id = 0;
    this.liveDemoVisible = !this.liveDemoVisible;

    // Add new after modal is opened
    setTimeout(() => {
      this.addNew();
    }, 100);
  }

  onClode() {
    // Reset form và đóng modal
    this.Form.reset();
    this.Form.markAsPristine();
    this.Form.markAsUntouched();

    // Reset tonghopquatgioDetail về trạng thái ban đầu
    this.tonghopquatgioDetail = {
      id: 0,
      maQuanLy: '',
      quatGioId: 0,
      donViId: 0,
      viTriLapDat: '',
      ngayLap: '',
      soLuong: 0,
      tinhTrangThietBi: '',
      duPhong:false,
      ghiChu: '',
    };

    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.title = 'Sửa bảng quạt gió';
    this.liveDemoVisible = !this.liveDemoVisible;

    // Load detail after modal is opened
    setTimeout(() => {
      this.loadTonghopQuatgioDetail();
    }, 100);
  }

  onDelete(id: number) {
    this.Id = id;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: 'Bạn có muốn xóa bản ghi này?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Deleting record with ID:', this.Id);
        this.dataService.delete('/api/Tonghopquatgio/' + this.Id).subscribe({
          next: (response) => {
            console.log('Delete response:', response);
            this.loadTonghopQuatgio();
            this.toastr.success('Xóa dữ liệu thành công', 'Success');
          },
          error: (error) => {
            console.error('Error deleting record:', error);
            let errorMessage = 'Xóa dữ liệu thất bại';

            if (error.status === 404) {
              errorMessage = 'Bản ghi không tìm thấy hoặc đã bị xóa';
            } else if (error.status === 400) {
              errorMessage =
                'Không thể xóa bản ghi: ' +
                (error.error?.message || error.message || '');
            } else if (error.status === 500) {
              errorMessage =
                'Lỗi server: ' + (error.error?.message || error.message || '');
            } else if (error.message) {
              errorMessage += ': ' + error.message;
            }

            this.toastr.error(errorMessage, 'Error');
          },
        });
      }
    });
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

  save() {
    // Debug: Log form status
    console.log('Form valid:', this.Form.valid);
    console.log('Form invalid:', this.Form.invalid);
    console.log('Form errors:', this.Form.errors);
    console.log('Form value:', this.Form.value);

    // Kiểm tra form validation chi tiết
    if (this.Form.invalid) {
      this.markFormGroupTouched();

      // Log chi tiết các lỗi validation
      Object.keys(this.Form.controls).forEach((key) => {
        const control = this.Form.get(key);
        if (control && control.errors) {
          console.log(`Field ${key} errors:`, control.errors);
        }
      });

      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc', 'Error');
      return;
    }

    // Kiểm tra các trường bắt buộc cụ thể
    const formData = this.Form.value;
    console.log('Form data before validation:', formData);

    if (!formData.viTriLapDat || formData.viTriLapDat.trim() === '') {
      this.toastr.error('Vị trí lắp đặt là bắt buộc', 'Error');
      return;
    }

    if (!formData.quatGioId || formData.quatGioId === 0) {
      this.toastr.error('Vui lòng chọn quạt gió', 'Error');
      return;
    }

    if (!formData.donViId || formData.donViId === 0) {
      this.toastr.error('Vui lòng chọn đơn vị', 'Error');
      return;
    }

    // Chuẩn bị dữ liệu để gửi
    console.log('Form data to save:', formData);

    // Đảm bảo dữ liệu có đầy đủ các trường cần thiết và đúng định dạng
    const dataToSave: TonghopquatgioDetail = {
      id: formData.id || 0,
      maQuanLy: formData.maQuanLy || '',
      quatGioId: Number(formData.quatGioId) || 0,
      donViId: Number(formData.donViId) || 0,
      viTriLapDat: formData.viTriLapDat?.trim() || '',
      ngayLap: this.formatDate(formData.ngayLap),
      soLuong: Number(formData.soLuong) || 1,
      tinhTrangThietBi: formData.tinhTrangThietBi || '',
      duPhong:formData.duPhong|| false,
      ghiChu: formData.ghiChu || '',
    };

    // Validate dữ liệu trước khi gửi
    const validationResult = this.validateDataBeforeSave(dataToSave);
    if (!validationResult.isValid) {
      this.toastr.error(validationResult.message, 'Validation Error');
      return;
    }

    console.log('Data to save:', dataToSave);

    if (this.themoi) {
      // Tạo mới
      console.log('Creating new record...');
      this.dataService
        .post('/api/Tonghopquatgio/create', dataToSave)
        .subscribe({
          next: (response) => {
            console.log('Create response:', response);
            this.loadTonghopQuatgio();
            this.toastr.success('Tạo mới dữ liệu thành công', 'Success');
            this.liveDemoVisible = !this.liveDemoVisible;
            this.Form.reset();
            this.addNew(); // Reset form về trạng thái ban đầu
          },
          error: (error) => {
            console.error('Error creating record:', error);
            this.handleSaveError(error, 'tạo mới');
          },
        });
    } else {
      // Cập nhật
      console.log('Updating existing record...');
      this.dataService.put('/api/Tonghopquatgio/update', dataToSave).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.loadTonghopQuatgio();
          this.toastr.success('Cập nhật dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: (error) => {
          console.error('Error updating record:', error);
          this.handleSaveError(error, 'cập nhật');
        },
      });
    }
  }

  // Hàm hỗ trợ xử lý lỗi khi save
  private handleSaveError(error: any, action: string) {
    let errorMessage = `Lưu dữ liệu thất bại (${action})`;

    if (error.status === 400) {
      // Xử lý lỗi 400 Bad Request
      if (error.error && typeof error.error === 'object') {
        if (error.error.errors) {
          // Validation errors từ server
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = `Dữ liệu không hợp lệ:\n${validationErrors.join(
            '\n'
          )}`;
        } else if (error.error.message) {
          errorMessage = `Dữ liệu không hợp lệ: ${error.error.message}`;
        } else {
          errorMessage = `Dữ liệu không hợp lệ: ${error.error}`;
        }
      } else if (error.error) {
        errorMessage = `Dữ liệu không hợp lệ: ${error.error}`;
      } else {
        errorMessage = 'Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc';
      }
    } else if (error.status === 404) {
      errorMessage =
        'API endpoint không tìm thấy. Vui lòng kiểm tra cấu hình backend.';
    } else if (error.status === 500) {
      errorMessage = `Lỗi server: ${
        error.error?.message || error.message || ''
      }`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    this.toastr.error(errorMessage, 'Error');
  }

  // Hàm format date để đảm bảo định dạng đúng
  private formatDate(date: any): string {
    if (!date) {
      return new Date().toISOString().split('T')[0];
    }

    if (typeof date === 'string') {
      // Nếu là string, kiểm tra xem có phải date hợp lệ không
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
    }

    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }

    // Fallback về ngày hiện tại
    return new Date().toISOString().split('T')[0];
  }

  // Hàm đánh dấu tất cả các trường trong form là đã touched
  private markFormGroupTouched() {
    Object.keys(this.Form.controls).forEach((key) => {
      const control = this.Form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Hàm validate dữ liệu trước khi gửi API
  private validateDataBeforeSave(data: TonghopquatgioDetail): {
    isValid: boolean;
    message: string;
  } {
    if (!data.viTriLapDat || data.viTriLapDat.trim() === '') {
      return { isValid: false, message: 'Vị trí lắp đặt không được để trống' };
    }

    if (!data.quatGioId || data.quatGioId <= 0) {
      return { isValid: false, message: 'Vui lòng chọn thiết bị quạt gió' };
    }

    if (!data.donViId || data.donViId <= 0) {
      return { isValid: false, message: 'Vui lòng chọn đơn vị' };
    }

    if (!data.ngayLap || data.ngayLap === '') {
      return { isValid: false, message: 'Ngày lắp đặt không được để trống' };
    }

    if (!data.soLuong || data.soLuong <= 0) {
      return { isValid: false, message: 'Số lượng phải lớn hơn 0' };
    }

    return { isValid: true, message: '' };
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataQuatgioDetail);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopquatgio.xlsx');
  }
  duan1() {
    console.log('Du an 1');
  }
}
