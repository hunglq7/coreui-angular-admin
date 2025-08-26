import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
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
  FormControlDirective,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
} from '@coreui/angular';

import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { ThietbiSearchComponent } from '../../../components/nav-thietbi-search/thietbi-search.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  ThongsoAptomatKhoidongtu,
  ThongsoAptomatKhoidongtuDetail,
} from '../../../core/interface/aptomatkhoidongtu/thongso-aptomat-khoidongtu';

@Component({
  selector: 'app-thongsoaptomatkhoidongtu',
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
    NzFormModule,
    NzButtonModule,
    NzTableModule,
    NzToolTipModule,
    NzIconModule,
    ThietbiSearchComponent,
  ],
  templateUrl: './thongsoaptomatkhoidongtu.component.html',
  styleUrl: './thongsoaptomatkhoidongtu.component.scss',
})
export class ThongsoaptomatkhoidongtuComponent implements OnInit {
  public liveDemoVisible = false;
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  pageIndex = 1;
  pageSize = 20;
  pageDisplay = 10;
  keywordThietbi: number = 0;
  dataSource: ThongsoAptomatKhoidongtu[] = [];
  entity: ThongsoAptomatKhoidongtuDetail = {
    id: 0,
    danhmucaptomatkhoidongtuId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmucAptomatKhoidongtu: any[] = [];
  Form!: FormGroup;
  Id: Number = 0;
  themoi: boolean = false;
  size: NzButtonSize = 'small';

  ngOnInit(): void {
    this.loadData();
    this.getDanhmucAptomatKhoidongtu();
    if (this.Id == 0) {
      this.addThongsoAptomatKhoidongtuDetail();
    } else {
      this.getThongsoAptomatKhoidongtuDetail();
    }
  }

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.initFormBuilder();
  }

  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl({ value: null, disabled: false }),
      danhmucaptomatkhoidongtuId: new FormControl({
        value: null,
        disabled: false,
      }),
      noiDung: new FormControl({ value: null, disabled: false }),
      donViTinh: new FormControl({ value: null, disabled: false }),
      thongSo: new FormControl({ value: null, disabled: false }),
    });
  }

  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadData();
  }

  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadData();
  }

  pageSizeChange(event: any): void {
    this.pageSize = event;
    this.loadData();
  }

  save() {
    if (this.themoi) {
      this.dataService
        .post('/api/ThongsoAptomatKhoidongtu', this.Form.value)
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
    } else {
      this.dataService
        .put('/api/ThongsoAptomatKhoidongtu/update', this.Form.value)
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

  onThemmoi() {
    this.title = 'Thêm mới thông số aptomat khởi động từ';
    this.themoi = true;
    this.Id = 0;
    this.addThongsoAptomatKhoidongtuDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getThongsoAptomatKhoidongtuDetail();
    this.title = 'Sửa thông số aptomat khởi động từ';
    this.liveDemoVisible = !this.liveDemoVisible;
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
        this.dataService
          .delete('/api/ThongsoAptomatKhoidongtu/' + this.Id)
          .subscribe({
            next: () => {
              this.loadData();
              this.toastr.success('Xóa dữ liệu thành công', 'Success');
            },
            error: () => {
              this.toastr.error('Xóa dữ liệu thất bại', 'Error');
            },
          });
      }
    });
  }

  private loadFormData(items: ThongsoAptomatKhoidongtuDetail) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      danhmucaptomatkhoidongtuId: items.danhmucaptomatkhoidongtuId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }

  getThongsoAptomatKhoidongtuDetail() {
    this.dataService
      .getById('/api/ThongsoAptomatKhoidongtu/' + this.Id)
      .subscribe({
        next: (data: any) => {
          this.loadFormData(data);
        },
        error: () => {
          this.toastr.error('Lấy dữ liệu thất bại', 'Error');
        },
      });
  }

  addThongsoAptomatKhoidongtuDetail() {
    this.dataService.getById('/api/ThongsoAptomatKhoidongtu/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getDanhmucAptomatKhoidongtu() {
    this.dataService.get('/api/DanhmucAptomatKhoidongtu').subscribe({
      next: (data: any) => {
        this.dsDanhmucAptomatKhoidongtu = data;
      },
    });
  }

  loadData() {
    this.dataService
      .get(
        '/api/ThongsoAptomatKhoidongtu/paging?thietbiId=' +
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
}
