import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
} from '@coreui/angular';
import { DataService } from '../../core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
import { ColComponent, RowComponent } from '@coreui/angular';
import { SearchNhanvienDonviComponent } from '../../components/nav-search-nhanvien-donvi/search-nhanvien-donvi.component';
import * as XLSX from 'xlsx';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { TongHopThietBiDetail } from '../../core/interface/maytinh/tong-hop-thiet-bi-detail';
import { TongHopThietBi } from '../../core/interface/maytinh/tong-hop-thiet-bi';
import { NhanVien } from '../../core/interface/nhanvien/nhan-vien';
import { PhongBan } from '../../core/interface/phongban/phong-ban';
import { DonViTinh } from '../../core/interface/donvitinh/don-vi-tinh';
import { LoaiThietBi } from '../../core/interface/loaithietbi/loai-thiet-bi';
import { UploadFileComponent } from '../../components/uploadFile/uploadFile.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { OverlayModule } from '@angular/cdk/overlay';
import { environment } from '../../../environments/environment';
type Gender = 'male' | 'female';

@Component({
  selector: 'app-tonghopmaytinh',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    NzTableModule,
    NzIconModule,
    NzToolTipModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzCheckboxModule,
    SearchNhanvienDonviComponent,
    UploadFileComponent,
    OverlayModule,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
  ],
  templateUrl: './tonghopmaytinh.component.html',
  styleUrl: './tonghopmaytinh.component.scss',
})
export class TonghopmaytinhComponent implements OnInit {
  public baseFolder: string = environment.BASE_API + '/wwwroot';
  title: string = '';
  tooltipValidated = false;
  totalRow!: number;
  sumSoluong!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  keywordNhanvien: number = 0;
  keywordDonvi: number = 0;
  dataMaytinh: TongHopThietBi[] = [];
  dataMaytinhDetail: TongHopThietBiDetail = {
    id: 0,
    maThietBi: '',
    trangThai: true,
    hinhAnh: '',
    tenThietBi: '',
    donViTinhId: 0,
    soLuong: 0,
    loaiThietBiId: '',
    ngaySuDung: '',
    tinhTrangThietBi: '',
    phongBanId: 0,
    nhanVienId: 0,
    ghiChu: '',
  };
  dsNhanVien: NhanVien[] = [];
  dsPhongban: PhongBan[] = [];
  dsDonvitinh: DonViTinh[] = [];
  dsLoaithietbi: LoaiThietBi[] = [];
  validateForm!: FormGroup;
  loading = true;
  size: NzButtonSize = 'small';
  isVisible = false;
  isOkLoading = false;
  pathFile: string = '/api/UploadThietbi';
  switchValue: boolean = true;
  pathHinhAnh: string = '';
  dateFormat = 'dd/MM/yyyy';
  public themoi: boolean = false;
  Id: Number = 0;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {}
  private fb = inject(FormBuilder);
  loadTonghopMaytinh() {
    this.loading = true;
    this.dataService
      .get(
        '/api/Tonghopthietbi/paging?nhanVienId=' +
          this.keywordNhanvien +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.dataMaytinh = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
        this.loading = false;
      });
  }
  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopMaytinh();
  }

  public pageSizeChange(event: any): void {
    this.pageSize = event;
    this.loadTonghopMaytinh();
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsPhongban = data;
      },
    });
  }
  getDataNhanvien() {
    this.dataService.get('/api/Nhanvien').subscribe({
      next: (data: any) => {
        this.dsNhanVien = data;
      },
    });
  }
  getDataDonvitinh() {
    this.dataService.get('/api/Donvitinh').subscribe({
      next: (data: any) => {
        this.dsDonvitinh = data;
      },
    });
  }
  getDataLoaithietbi() {
    this.dataService.get('/api/Loaithietbi').subscribe({
      next: (data: any) => {
        this.dsLoaithietbi = data;
      },
    });
  }
  eventNhanvien($event: number) {
    this.keywordNhanvien = $event;
    this.loadTonghopMaytinh();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopMaytinh();
  }
  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataMaytinh);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghonpmaytinh.xlsx');
  }
  onThemmoi(): void {
    this.title = 'Thêm thiết bị';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopNeoDetail();
    this.isVisible = !this.isVisible;
  }
  addNewTonghopNeoDetail() {
    this.dataService.getById('/api/Tonghopthietbi/' + 0).subscribe({
      next: (data) => {
        if (data) {
          this.dataMaytinhDetail = data;
          var myDate = new Date(data.ngaySuDung);
          var myDateString;
          myDateString =
            myDate.getFullYear() +
            '-' +
            ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + myDate.getDate()).slice(-2);
          this.dataMaytinhDetail.ngaySuDung = myDateString;
          this.loadFormData(this.dataMaytinhDetail);
        }
      },
    });
  }

  private loadFormData(items: TongHopThietBiDetail) {
    this.dataMaytinhDetail = items;
    this.validateForm.setValue({
      id: items.id,
      maThietBi: items.maThietBi,
      trangThai: items.trangThai,
      hinhAnh: items.hinhAnh,
      tenThietBi: items.tenThietBi,
      donViTinhId: items.donViTinhId,
      soLuong: items.soLuong,
      loaiThietBiId: items.loaiThietBiId,
      ngaySuDung: items.ngaySuDung,
      tinhTrangThietBi: items.tinhTrangThietBi,
      phongBanId: items.phongBanId,
      nhanVienId: items.nhanVienId,
      ghiChu: items.ghiChu,
    });
  }
  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopMaytinhDetail();
    this.title = 'Sửa thiết bị';
    this.isVisible = !this.isVisible;
  }

  loadTonghopMaytinhDetail() {
    if (!this.Id) return;

    this.dataService.getById('/api/Tonghopthietbi/' + this.Id).subscribe({
      next: (data: TongHopThietBiDetail) => {
        if (data) {
          this.dataMaytinhDetail = data;
          var myDate = new Date(data.ngaySuDung);
          var myDateString;
          myDateString =
            myDate.getFullYear() +
            '-' +
            ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + myDate.getDate()).slice(-2);
          this.dataMaytinhDetail.ngaySuDung = myDateString;
          this.pathHinhAnh = this.dataMaytinhDetail.hinhAnh;
          console.log(this.pathHinhAnh);
        }
      },
    });
  }
  onDelete(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bán có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Thiết bị: </b>' + item.tenThietBi,
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.Delete(item),
    });
  }
  Delete(item: any) {
    this.Id = item;
    this.dataService.delete('/api/Tonghopthietbi/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopMaytinh();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  initFormBuilder() {
    this.validateForm = this.fb.group({
      id: this.fb.control<number | null>(0),
      maThietBi: this.fb.control<string | null>(null, Validators.required),
      hinhAnh: this.fb.control<string | null>(null),
      tenThietBi: this.fb.control<string | null>(null, Validators.required),
      loaiThietBiId: this.fb.control<string | null>(null, Validators.required),
      ngaySuDung: this.fb.control<Date | null>(null, Validators.required),
      soLuong: this.fb.control<number | null>(null, Validators.required),
      donViTinhId: this.fb.control<string | null>(null, Validators.required),
      phongBanId: this.fb.control<string | null>(null, Validators.required),
      nhanVienId: this.fb.control<string | null>(null, Validators.required),
      ghiChu: this.fb.control<string | null>(null),
      trangThai: this.fb.control<boolean | null>(true),
    });
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      this.save();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  save() {
    if (this.themoi) {
      this.isOkLoading = true;
      this.dataService
        .post('/api/Tonghopthietbi', this.validateForm.value)
        .subscribe({
          next: () => {
            this.loadTonghopMaytinh();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.isVisible = !this.isVisible;
            this.validateForm.reset();
            this.isOkLoading = false;
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    } else {
      this.isOkLoading = true;

      this.dataService
        .put('/api/Tonghopthietbi/update', this.validateForm.value)
        .subscribe({
          next: () => {
            this.loadTonghopMaytinh();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.isVisible = !this.isVisible;
            this.validateForm.reset();
            this.isOkLoading = false;
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    }
  }
  onUploadPath(event: any) {
    if (event && event.dbPath) {
      this.pathHinhAnh = event.dbPath;
    }
  }
  onChangeTrangThai(event: any) {
    console.log(event);
  }
  ngOnInit(): void {
    this.loadTonghopMaytinh();
    this.getDataDonvi();
    this.getDataNhanvien();
    this.getDataDonvitinh();
    this.getDataLoaithietbi();
    this.initFormBuilder();
  }
}
