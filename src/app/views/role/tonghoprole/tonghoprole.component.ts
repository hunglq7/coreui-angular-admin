import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
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
  FormControlDirective,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
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
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
import {
  TonghoproleDetail,
  TonghoproleList,
} from '../../../core/interface/Role/tonghoprole-interface';
@Component({
  selector: 'app-tonghoprole',
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
    NzSwitchModule,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
  ],
  templateUrl: './tonghoprole.component.html',
  styleUrl: './tonghoprole.component.scss',
})
export class TonghoproleComponent implements OnInit {
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
  keywordThietbi: boolean = false;
  keywordDonvi: number = 0;
  dataView: TonghoproleList[] = [];
  dataDetail: TonghoproleDetail = {
    id: 0,
    roleId: 0,
    phongBanId: 0,
    viTriLapDat: '',
    ngayLap: new Date(),
    soLuong: 0,
    tinhTrangThietBi: '',
    duPhong: false,
    lamViec: false,
    ghiChu: '',
  };
  dsRole: any[] = [];
  dsPhongBan: any[] = [];
  Form!: FormGroup;
  Id: Number = 0;
  public themoi: boolean = false;
  size: NzButtonSize = 'small';
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.getDanhsachTonghoprole();
    this.getDanhmucPhongBan();
    this.getDanhmucRole();
    this.initFormBuilder();
    if ((this.Id = 0)) {
      this.addNewTonghoproleDetail();
    } else {
      this.getTonghoproleDetailById();
    }
  }

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: '',
      roleId: ['', Validators.required],
      phongBanId: ['', Validators.required],
      viTriLapDat: [''],
      ngayLap: new Date(),
      soLuong: [''],
      tinhTrangThietBi: [''],
      duPhong: [false],
      lamViec: [false],
      ghiChu: [''],
    });
  }

  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.getDanhsachTonghoprole();
  }
  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.getDanhsachTonghoprole();
  }
  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.getDanhsachTonghoprole();
  }
  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.getDanhsachTonghoprole();
  }
  // Lấy danh sách phòng ban
  getDanhmucPhongBan() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsPhongBan = data;
      },
    });
  }
  //Lấy danh sách role
  getDanhmucRole() {
    this.dataService.get('/api/DanhmucRole').subscribe({
      next: (data: any) => {
        this.dsRole = data;
      },
    });
  }

  // Lấy danh sách tổng hợp role
  getDanhsachTonghoprole() {
    this.dataService
      .get(
        '/api/TonghopRole/paging?duPhong=' +
          this.keywordThietbi +
          '&donViId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        console.log(data.items);
        this.dataView = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }
  // Lấy chi tiết tổng hợp role theo Id
  getTonghoproleDetailById() {
    this.dataService.getById('/api/TonghopRole/' + this.Id).subscribe({
      next: (data: TonghoproleDetail) => {
        this.dataDetail = data;
        this.dataDetail.ngayLap = new Date(data.ngayLap);
      },
    });
  }

  //Thêm mới
  addNewTonghoproleDetail() {
    this.dataService.getById('/api/TonghopRole/' + 0).subscribe({
      next: (data) => {
        this.dataDetail = data;
        this.dataDetail.ngayLap = new Date(data.ngayLap);
        this.loadFormData(this.dataDetail);
      },
    });
  }

  // Gán dữ liệu cho form khi truyền dữ liệu vào
  private loadFormData(data: TonghoproleDetail) {
    this.dataDetail = data;
    this.Form.setValue({
      id: data.id,
      roleId: data.roleId,
      phongBanId: data.phongBanId,
      viTriLapDat: data.viTriLapDat,
      ngayLap: data.ngayLap,
      soLuong: data.soLuong,
      tinhTrangThietBi: data.tinhTrangThietBi,
      duPhong: data.duPhong,
      lamViec: data.lamViec,
      ghiChu: data.ghiChu,
    });
  }

  onThemmoi() {
    this.title = 'Thêm role';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghoproleDetail();
    this.visible = !this.visible;
  }

  onClode() {
    this.Form.reset();
    this.visible = !this.visible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getTonghoproleDetailById();
    this.title = 'Sửa role';
    this.visible = !this.visible;
  }

  showConfirm(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bạn có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Role: </b>' + item.tenThietBi,
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.onDelete(item),
    });
  }

  onDelete(id: number) {
    this.Id = id;
    this.dataService.delete('/api/TonghopRole/' + this.Id).subscribe({
      next: () => {
        this.getDanhsachTonghoprole();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    if (this.themoi) {
      this.dataService.post('/api/TonghopRole', this.Form.value).subscribe({
        next: () => {
          this.getDanhsachTonghoprole();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.visible = !this.visible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    } else {
      this.dataService
        .put('/api/TonghopRole/update', this.Form.value)
        .subscribe({
          next: () => {
            this.getDanhsachTonghoprole();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.visible = !this.visible;
            this.Form.reset();
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    }
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataView);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghoprole.xlsx');
  }

  public visible = false;

  toggle() {
    this.visible = !this.visible;
  }

  handleChange(event: any) {
    this.visible = event;
  }
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
}
