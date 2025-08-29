import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhatkybomnuocTabComponent } from '../../bomnuoc/nhatkybomnuoc-tab/nhatkybomnuoc-tab.component';
import { ThongsobomnuocTabComponent } from '../../bomnuoc/thongsobomnuoc-tab/thongsobomnuoc-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  ButtonCloseDirective,
  ColComponent,
  DropdownModule,
  FormControlDirective,
  FormSelectDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  SharedModule,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  ThemeDirective,
} from '@coreui/angular';
import {
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
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
  TongHopBomNuoc,
  TongHopBomNuocDetail,
} from '../../../core/interface/bomnuoc/bomnuoc-interface';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
@Component({
  selector: 'app-tonghopbomnuoc',
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
    NhatkybomnuocTabComponent,
    ThongsobomnuocTabComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
  ],
  templateUrl: './tonghopbomnuoc.component.html',
  styleUrl: './tonghopbomnuoc.component.scss',
})
export class TonghopbomnuocComponent implements OnInit {
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
  keywordDuPhong: boolean = false;
  data: TongHopBomNuoc[] = [];
  dataDetail: TongHopBomNuocDetail = {
    id: 0,
    maQuanLy: '',
    bomNuocId: 0,
    donViId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 1,
    tinhTrangThietBi: '',
    duPhong: this.keywordDuPhong,
    ghiChu: '',
  };
  danhSach: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  public themoi: boolean = false;
  size: NzButtonSize = 'small';
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopBomnuoc();
    this.getDataDonvi();
    this.getDataBomnuoc();
    // Remove unnecessary create/detail calls on init to avoid 500 errors
  }
  private initFormBuilder() {
    this.Form = this.fb.group({
      id: [''],
      maQuanLy: [''],
      bomNuocId: [''],
      donViId: [''],
      viTriLapDat: ['', Validators.required],
      ngayLap: new Date(),
      soLuong: 1,
      tinhTrangThietBi: [''],
      duPhong: [''],
      ghiChu: [''],
    });
  }

  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.loadTonghopBomnuoc();
  }

  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.loadTonghopBomnuoc();
  }
  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.loadTonghopBomnuoc();
  }
  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.loadTonghopBomnuoc();
  }
  loadDataDetail() {
    if (!this.Id || Number(this.Id) <= 0) {
      console.warn('Cannot load detail: Invalid ID:', this.Id);
      return;
    }

    this.dataService.getById('/api/Tonghopbomnuoc/' + this.Id).subscribe({
      next: (data: TongHopBomNuocDetail) => {
        console.log('Loaded detail data:', data);
        this.dataDetail = data;
        
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
          this.dataDetail.ngayLap = myDateString;
        }
        
        this.loadFormData(this.dataDetail);
      },
      error: (err) => {
        console.error('Error loading detail:', err);
        this.toastr.error('Không thể tải thông tin chi tiết', 'Error');
      }
    });
  }
  clickSwitch() {
    this.keywordDuPhong = !this.keywordDuPhong;
  }
  addNew() {
    // Create a new empty record instead of calling API with ID 0
    const today = new Date().toISOString().split('T')[0];
    this.dataDetail = {
      id: 0,
      maQuanLy: '',
      bomNuocId: 0,
      donViId: 0,
      viTriLapDat: '',
      ngayLap: today,
      soLuong: 1,
      tinhTrangThietBi: '',
      duPhong: this.keywordDuPhong,
      ghiChu: '',
    };
    this.loadFormData(this.dataDetail);
  }

  private loadFormData(entity: TongHopBomNuocDetail) {
    this.dataDetail = entity;
    this.Form.setValue({
      id: entity.id,
      maQuanLy: entity.maQuanLy,
      bomNuocId: entity.bomNuocId,
      donViId: entity.donViId,
      viTriLapDat: entity.viTriLapDat,
      ngayLap: entity.ngayLap,
      soLuong: entity.soLuong,
      tinhTrangThietBi: entity.tinhTrangThietBi, // Fixed field name
      duPhong: entity.duPhong,
      ghiChu: entity.ghiChu,
    });
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }

  getDataBomnuoc() {
    this.dataService.get('/api/Danhmucbomnuoc').subscribe({
      next: (data: any) => {
        this.danhSach = data;
      },
    });
  }

  loadTonghopBomnuoc() {
    this.dataService
      .get(
        '/api/Tonghopbomnuoc/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.data = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
      });
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadTonghopBomnuoc();
  }
  onThemmoi() {
    this.title = 'Thêm bơm nước';
    this.themoi = true;
    this.Id = 0;
    this.addNew();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadDataDetail();
    this.title = 'Sửa bơm nước';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  showConfirm(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bạn có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Thiết bị: </b>' + item.tenThietBi,
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
    this.dataService.delete('/api/Tonghopbomnuoc/' + id).subscribe({
      next: () => {
        this.loadTonghopBomnuoc();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  handleLiveDemoChange(event: any) {
    this.liveDemoVisible = event;
  }

  save() {
    const raw = this.Form.getRawValue();
    console.log('Raw form data:', raw);
    
    // Build and validate payload
    const payload = this.buildPayload(raw);
    if (!payload) {
      this.toastr.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường bắt buộc.', 'Error');
      return;
    }

    console.log('Validated payload:', payload);

    if (this.themoi) {
      console.log('Creating new record with payload:', payload);
      this.dataService.post('/api/Tonghopbomnuoc', payload).subscribe({
        next: (response) => {
          console.log('Create success response:', response);
          this.loadTonghopBomnuoc();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: (err) => {
          console.error('Create Tonghopbomnuoc failed:', { 
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
      this.dataService.put('/api/Tonghopbomnuoc/update', payload).subscribe({
        next: (response) => {
          console.log('Update success response:', response);
          this.loadTonghopBomnuoc();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: (err) => {
          console.error('Update Tonghopbomnuoc failed:', { 
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
      const toBoolean = (v: any) => {
        const bool = Boolean(v);
        console.log(`Converting ${v} to boolean: ${bool}`);
        return bool;
      };

      // Normalize date to yyyy-MM-dd
      const normalizeDate = (v: any): string => {
        console.log('Normalizing date:', v);
        if (!v) {
          console.log('Date is empty, returning empty string');
          return '';
        }
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
        bomNuocId: toNumber(formValue.bomNuocId),
        maQuanLy: toTrim(formValue.maQuanLy),
        donViId: toNumber(formValue.donViId),
        viTriLapDat: toTrim(formValue.viTriLapDat),
        ngayLap: normalizeDate(formValue.ngayLap),
        soLuong: toNumber(formValue.soLuong),
        tinhTrangThietBi: toTrim(formValue.tinhTrangThietBi),
        duPhong: toBoolean(formValue.duPhong),
        ghiChu: toTrim(formValue.ghiChu),
      } as TongHopBomNuocDetail;

      console.log('Built payload:', payload);

      // Validate required fields
      if (!payload.bomNuocId || payload.bomNuocId <= 0) {
        console.error('Validation failed: bomNuocId is required and must be > 0');
        return null;
      }
      if (!payload.donViId || payload.donViId <= 0) {
        console.error('Validation failed: donViId is required and must be > 0');
        return null;
      }
      if (!payload.viTriLapDat) {
        console.error('Validation failed: viTriLapDat is required');
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopbomnuoc.xlsx');
  }
}
