import { Component, OnInit, signal } from '@angular/core';
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
  TongHopCapDienDetail,
  TongHopCapDienList,
} from '../../../core/interface/capdien/capdien-interface';
@Component({
  selector: 'app-tonghopcapdien',
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
  templateUrl: './tonghopcapdien.component.html',
  styleUrl: './tonghopcapdien.component.scss',
})
export class TonghopcapdienComponent implements OnInit {
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
  dataView: TongHopCapDienList[] = [];
  dataDetail: TongHopCapDienDetail = {
    id: 0,
    maquanly: '',
    donviId: 0,
    ngaythang: '',
    capdienId: 0,
    donvitinh: '',
    tondauthang: 0,
    nhaptrongky: 0,
    xuattrongky: 0,
    toncuoithang: 0,
    dangsudung: 0,
    duphong: 0,
    ghichu: '',
  };
  dsCapdien: any[] = [];
  dsDonvi: any[] = [];
  dsLoai: any[] = [];
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
    this.getDanhsachTonghopcapdien();
    this.getDanhmucPhongban();
    this.getDanhmucCapdien();
    this.initFormBuilder();
    if ((this.Id = 0)) {
      this.addNewTonghopcapdienDetail();
    } else {
      this.getTonghopcapdienDetailById();
    }
  }

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: '',
      maquanly: '',
      donviId: ['', Validators.required],
      ngaythang: new Date(),
      capdienId: ['', Validators.required],
      donvitinh: [''],
      tondauthang: [''],
      nhaptrongky: [''],
      xuattrongky: [''],
      toncuoithang: [''],
      dangsudung: [''],
      duphong: [''],
      ghichu: [''],
    });
  }

  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.getDanhsachTonghopcapdien();
  }
  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.getDanhsachTonghopcapdien();
  }
  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.getDanhsachTonghopcapdien();
  }
  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.getDanhsachTonghopcapdien();
  }
  // Lấy danh sách phòng ban
  getDanhmucPhongban() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }
  //Lấy danh sách cáp điện
  getDanhmucCapdien() {
    this.dataService.get('/api/Capdien').subscribe({
      next: (data: any) => {
        console.log("dsCapdien",data);
        this.dsCapdien = data;
      },
    });
  }

  // Lấy danh sách tổng hợp cáp điện
  getDanhsachTonghopcapdien() {
    this.dataService
      .get(
        '/api/Tonghopcapdien/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.dataView = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }
  // Lấy chi tiết tổng hợp cáp điện theo Id
  getTonghopcapdienDetailById() {
    this.dataService.getById('/api/Tonghopcapdien/' + this.Id).subscribe({
      next: (data: TongHopCapDienDetail) => {
        this.dataDetail = data;
        var myDate = new Date(data.ngaythang);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataDetail.ngaythang = myDateString;
      },
    });
  }

  //Thêm mới
  addNewTonghopcapdienDetail() {
    this.dataService.getById('/api/Tonghopcapdien/' + 0).subscribe({
      next: (data) => {
        this.dataDetail = data;
        var myDate = new Date(data.ngaythang);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataDetail.ngaythang = myDateString;
        this.loadFormData(this.dataDetail);
      },
    });
  }

  // Gán dữ liệu cho form khi truyền dữ liệu vào
  private loadFormData(data: TongHopCapDienDetail) {
    this.dataDetail = data;
    this.Form.setValue({
      id: data.id,
      maquanly: data.maquanly,
      donviId: data.donviId,
      ngaythang: data.ngaythang,
      capdienId: data.capdienId,
      donvitinh: data.donvitinh,
      tondauthang: data.tondauthang,
      nhaptrongky: data.nhaptrongky,
      xuattrongky: data.xuattrongky,
      toncuoithang: data.toncuoithang,
      dangsudung: data.dangsudung,
      duphong: data.duphong,
      ghichu: data.ghichu,
    });
  }

  onThemmoi() {
    this.title = 'Thêm cáp điện';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopcapdienDetail();
    this.visible = !this.visible;
  }

  onClode() {
    this.Form.reset();
    this.visible = !this.visible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getTonghopcapdienDetailById();
    this.title = 'Sửa cáp điện';
    this.visible = !this.visible;
  }

  showConfirm(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bán có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Thiết bị: </b>' + item.tenThietBi,
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
    this.dataService.delete('/api/Tonghopcapdien/' + this.Id).subscribe({
      next: () => {
        this.getDanhsachTonghopcapdien();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    if (this.themoi) {
      debugger;
      this.dataService.post('/api/Tonghopcapdien', this.Form.value).subscribe({
        next: () => {
          this.getDanhsachTonghopcapdien();
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
        .put('/api/Tonghopcapdien/update', this.Form.value)
        .subscribe({
          next: () => {
            this.getDanhsachTonghopcapdien();
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
    XLSX.writeFile(wb, 'Tonghopcapdien.xlsx');
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
