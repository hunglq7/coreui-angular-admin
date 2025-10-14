import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TongHopBangTai, TongHopBangTaiDetail } from '../../../core/interface/bangtai/bangtai';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';

@Component({
  selector: 'app-tonghopbangtai',
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
  ],
  standalone: true,
  templateUrl: './tonghopbangtai.component.html',
  styleUrl: './tonghopbangtai.component.scss',
})
export class TonghopbangtaiComponent implements OnInit {
  public liveDemoVisible = false;
  isLoading = false;
  title: string = '';
  totalRow!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  keywordBangtai: number = 0;
  keywordDonvi: number = 0;

  dataBangtai: TongHopBangTai[] = [];
  detail: TongHopBangTaiDetail = {
    id: 0,
    maHieu: '',
    bangTaiId: 0,
    donViId: 0,
    viTriLapDat: '',
    ngayLap: '',
    nMay: '',
    lMay: '',
    khungDau: '',
    khungDuoi: '',
    khungBangRoi: '',
    dayBang: '',
    conLan: '',
    tinhTrangThietbi: '',
    ghiChu: '',
  };

  dsBangtai: any[] = [];
  dsDonvi: any[] = [];

  Form!: FormGroup;
  Id: number = 0;
  public themoi: boolean = false;
  size: NzButtonSize = 'small';

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {
    this.initFormBuilder();
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadBangtai();
    this.getDataDonvi();
    this.getDataBangtai();
    this.getSum();
  }

  private checkAuthentication() {
    const token = this.dataService.authenService.accessToken;
    if (!token) {
      this.toastr.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'Warning');
    }
  }

  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl({ value: null, disabled: false }),
      maHieu: new FormControl({ value: null, disabled: false }),
      bangTaiId: new FormControl({ value: null, disabled: false }),
      donViId: new FormControl({ value: null, disabled: false }),
      viTriLapDat: new FormControl({ value: null, disabled: false }),
      ngayLap: new FormControl({ value: null, disabled: false }),
      nMay: new FormControl({ value: null, disabled: false }),
      lMay: new FormControl({ value: null, disabled: false }),
      khungDau: new FormControl({ value: null, disabled: false }),
      khungDuoi: new FormControl({ value: null, disabled: false }),
      khungBangRoi: new FormControl({ value: null, disabled: false }),
      dayBang: new FormControl({ value: null, disabled: false }),
      conLan: new FormControl({ value: null, disabled: false }),
      tinhTrangThietbi: new FormControl({ value: null, disabled: false }),
      ghiChu: new FormControl({ value: null, disabled: false }),
    });
  }

  eventBangtai($event: any) {
    this.keywordBangtai = $event;
    this.loadBangtai();
  }

  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.loadBangtai();
  }

  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.loadBangtai();
  }

  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.loadBangtai();
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
      error: () => {
        this.toastr.error('Không tải được danh sách đơn vị', 'Error');
        this.dsDonvi = [];
      },
    });
  }

  getDataBangtai() {
    this.dataService.get('/api/Danhmucbangtai').subscribe({
      next: (data: any) => {
        this.dsBangtai = data;    
      },
      error: () => {
        this.toastr.error('Không tải được danh sách băng tải', 'Error');
        this.dsBangtai = [];
      },
    });
  }

  loadBangtai() {
    const bangtaiId = this.keywordBangtai || 0;
    const donviId = this.keywordDonvi || 0;
    const pageIndex = Math.max(1, this.pageIndex);
    const pageSize = Math.max(1, Math.min(100, this.pageSize));
    const url = `/api/Tonghopbangtai/paging?bangtaiId=${bangtaiId}&donviId=${donviId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    this.dataService.get(url).subscribe({
      next: (resp: any) => {
        console.log("Dữ liệu băng tải"+ JSON.stringify(resp));
        let items: any[] = [];
        let pageSize = this.pageSize;
        let pageIndex = this.pageIndex;
        let totalRecords = 0;

        if (Array.isArray(resp)) {
          items = resp;
          totalRecords = resp.length;
        } else if (resp && typeof resp === 'object') {
          if (Array.isArray(resp.items)) {
            items = resp.items;
            pageSize = resp.pageSize ?? pageSize;
            pageIndex = resp.pageIndex ?? pageIndex;
            totalRecords = resp.totalRecords ?? items.length;
          } else if (Array.isArray(resp.data)) {
            items = resp.data;
            pageSize = resp.pageSize ?? pageSize;
            pageIndex = resp.pageIndex ?? pageIndex;
            totalRecords = resp.total ?? resp.totalRecords ?? items.length;
          } else {
            items = [];
          }
        } else {
          items = [];
        }

        this.dataBangtai = items as TongHopBangTai[];
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
        this.totalRow = totalRecords;
      },
      error: (err) => {
        if (err.status === 500 || err.status === 404) {
          const fallbackUrl = `/api/Tonghopbangtai`;
          this.dataService.get(fallbackUrl).subscribe({
            next: (list: any) => {
              const items: any[] = Array.isArray(list)
                ? list
                : (list && Array.isArray(list.data) ? list.data : []);
              this.dataBangtai = items as TongHopBangTai[];
              this.totalRow = items.length;
              this.toastr.info('Đã dùng phương án dự phòng để tải dữ liệu', 'Info');
            },
            error: () => {
              this.toastr.error('Không tải được dữ liệu (fallback)', 'Error');
              this.dataBangtai = [];
              this.totalRow = 0;
            },
          });
          return;
        }

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
        this.dataBangtai = [];
        this.totalRow = 0;
      },
    });
  }

  loadBangtaiDetail() {
    if (!this.Id || Number(this.Id) <= 0) {
      return;
    }
    this.dataService.getById('/api/Tonghopbangtai/detail/' + this.Id).subscribe({
      next: (data: TongHopBangTaiDetail) => {
        this.detail = data;    
        if (data.ngayLap) {
          const d = new Date(data.ngayLap);
          const s = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
          this.detail.ngayLap = s;
        }
   
      },
      error: () => {
        this.toastr.error('Không thể tải thông tin chi tiết', 'Error');
      },
    });
  }

  addNewDetail() {
    const today = new Date().toISOString().split('T')[0];
    this.detail = {
      id: 0,
      maHieu: '',
      bangTaiId: 0,
      donViId: 0,
      viTriLapDat: '',
      ngayLap: today,
      nMay: '',
      lMay: '',
      khungDau: '',
      khungDuoi: '',
      khungBangRoi: '',
      dayBang: '',
      conLan: '',
      tinhTrangThietbi: '',
      ghiChu: '',
    };
    this.loadFormData(this.detail);
  }

  private loadFormData(detail: TongHopBangTaiDetail) {
    this.detail = detail;
    this.Form.setValue({
      id: detail?.id ?? 0,
      maHieu: detail?.maHieu??'',
      bangTaiId: detail?.bangTaiId ?? 0,
      donViId: detail?.donViId ?? 0,
      viTriLapDat: detail?.viTriLapDat ?? '',
      ngayLap: detail?.ngayLap ?? '',
      nMay: detail?.nMay ?? '',
      lMay: detail?.lMay ?? '',
      khungDau: detail?.khungDau ?? '',
      khungDuoi: detail?.khungDuoi ?? '',
      khungBangRoi: detail?.khungBangRoi ?? '',
      dayBang: detail?.dayBang ?? '',
      conLan: detail?.conLan ?? '',
      tinhTrangThietbi: detail?.tinhTrangThietbi ?? '',
      ghiChu: detail?.ghiChu ?? '',
    });
  }

  onThemmoi() {
    this.title = 'Thêm băng tải';
    this.themoi = true;
    this.Id = 0;
    this.addNewDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadBangtaiDetail();
    this.title = 'Sửa băng tải';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  showConfirm(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bạn có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Băng tải: </b>' + (item.tenBangTai || item.maHieu),
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.onDelete(item.id),
    });
  }

  onDelete(id: number) {
    this.dataService.delete('/api/Tonghopbangtai/' + id).subscribe({
      next: () => {
        this.loadBangtai();
        this.getSum();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

  save() {
    // const raw = this.Form.getRawValue();
    // const payload = this.buildPayload(raw);
    // if (!payload) {
    //   this.toastr.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường bắt buộc.', 'Error');
    //   return;
    // }
    this.isLoading = true;
    if (this.themoi) {
      this.dataService.post('/api/Tonghopbangtai', this.Form.value).subscribe({
        next: () => {
          this.loadBangtai();
          this.getSum();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
          this.isLoading = false;
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Lưu dữ liệu thất bại';
          this.toastr.error(errorMessage, 'Error');
        },
      });
    } else {
      this.dataService.put('/api/Tonghopbangtai', this.Form.value).subscribe({
        next: () => {
          this.loadBangtai();
          this.getSum();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
          this.isLoading = false;
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Lưu dữ liệu thất bại';
          this.toastr.error(errorMessage, 'Error');
        },
      });
    }
  }

  private buildPayload(formValue: any): any | null {
    try {
      const toNumber = (v: any) => (v === null || v === '' || isNaN(+v) ? 0 : +v);
      const toTrim = (v: any) => (v ?? '').toString().trim();
      const normalizeDate = (v: any): string => {
        if (!v) return '';
        if (typeof v === 'string') {
          const s = v.trim();
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
            const [dd, mm, yyyy] = s.split('/');
            return `${yyyy}-${mm}-${dd}`;
          }
          if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
            return s;
          }
        }
        const d = new Date(v);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const payload: TongHopBangTaiDetail = {
        id: toNumber(formValue.id),
        maHieu: toTrim(formValue.maHieu),
        bangTaiId: toNumber(formValue.bangTaiId),
        donViId: toNumber(formValue.donViId),
        viTriLapDat: toTrim(formValue.viTriLapDat),
        ngayLap: normalizeDate(formValue.ngayLap),
        nMay: toTrim(formValue.nMay),
        lMay: toTrim(formValue.lMay),
        khungDau: toTrim(formValue.khungDau),
        khungDuoi: toTrim(formValue.khungDuoi),
        khungBangRoi: toTrim(formValue.khungBangRoi),
        dayBang: toTrim(formValue.dayBang),
        conLan: toTrim(formValue.conLan),
        tinhTrangThietbi: toTrim(formValue.tinhTrangThietbi),
        ghiChu: toTrim(formValue.ghiChu),
      };

      if (!payload.bangTaiId || payload.bangTaiId <= 0) return null;
      if (!payload.donViId || payload.donViId <= 0) return null;
      if (!payload.ngayLap) return null;

      return payload;
    } catch {
      return null;
    }
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataBangtai);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopbangtai.xlsx');
  }

  getSum() {
    this.dataService.get('/api/Tonghopbangtai/sum').subscribe({
      next: (sum: any) => {
        // If backend returns number of records, keep it for display if needed
        this.totalRow = typeof sum === 'number' ? sum : (sum?.total ?? this.totalRow);
      },
      error: () => {
        // silent
      },
    });
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
} 