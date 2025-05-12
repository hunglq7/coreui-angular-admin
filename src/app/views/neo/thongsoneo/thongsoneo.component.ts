import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  FormFeedbackComponent,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
} from '@coreui/angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ThietbiSearchComponent } from '../../../components/nav-thietbi-search/thietbi-search.component';
export interface ThongsoNeo {
  id: number;
  tenThietBi: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

export interface ThongsoNeoDetail {
  id: number;
  neoId: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
@Component({
  selector: 'app-thongsoneo',
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
    CardHeaderComponent,
    CardBodyComponent,
    PaginationModule,
    DropdownModule,
    SharedModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzCascaderModule,
    NzTableModule,
    NzToolTipModule,
    NzFormModule,
    ThietbiSearchComponent,
  ],
  templateUrl: './thongsoneo.component.html',
  styleUrl: './thongsoneo.component.scss',
})
export class ThongsoneoComponent implements OnInit {
  public liveDemoVisible = false;
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  keywordThietbi: number = 0;
  dataSource: ThongsoNeo[] = [];
  entity: ThongsoNeoDetail = {
    id: 0,
    neoId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmucNeo: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;
  size: NzButtonSize = 'small';
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {
    this.initFormBuilder();
  }
  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl(null, Validators.required),
      neoId: new FormControl(null, Validators.required),
      noiDung: new FormControl(null, Validators.required),
      donViTinh: new FormControl(null, Validators.required),
      thongSo: new FormControl(null, Validators.required),
    });
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadData();
  }
  addNewthongsoNeo() {
    this.dataService.getById('/api/Thongsoneo/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  private loadFormData(items: ThongsoNeoDetail) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      neoId: items.neoId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }

  getThongsoNeo() {
    this.dataService.getById('/api/Thongsoneo/' + this.Id).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getDanhmucNeo() {
    this.dataService.get('/api/Danhmucneo').subscribe({
      next: (data: any) => {
        this.dsDanhmucNeo = data;
      },
    });
  }

  loadData() {
    this.dataService
      .get(
        '/api/Thongsoneo/paging?thietbiId=' +
          this.keywordThietbi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe({
        next: (data: any) => {
          this.dataSource = data.items;
          this.pageSize = data.pageSize;
          this.pageIndex = data.pageIndex;
          this.totalRow = data.totalRecords;
        },
      });
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

  onThemmoi() {
    this.title = 'Thêm mới thông số kỹ thuật';
    this.themoi = true;
    this.Id = 0;
    this.addNewthongsoNeo();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getThongsoNeo();
    this.title = 'Sửa thông số kỹ thuật';
    this.liveDemoVisible = !this.liveDemoVisible;
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
      nzOnOk: () => this.onDelete(item),
    });
  }
  Delete(item: any) {
    this.Id = item.id;
    this.dataService.delete('/api/Thongsoneo/' + this.Id).subscribe({
      next: () => {
        this.loadData();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  save() {
    if (this.themoi) {
      this.dataService.post('/api/Thongsoneo', this.Form.value).subscribe({
        next: () => {
          this.loadData();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    } else {
      this.dataService
        .put('/api/Thongsoneo/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadData();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.liveDemoVisible = !this.liveDemoVisible;
            this.Form.reset();
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    }
  }

  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadData();
  }

  pageSizeChange(event: any): void {
    this.pageSize = event;
    this.loadData();
  }
  ngOnInit(): void {
    this.loadData();
    this.getDanhmucNeo();
    if ((this.Id = 0)) {
      this.addNewthongsoNeo();
    } else {
      this.getThongsoNeo();
    }
  }
}
