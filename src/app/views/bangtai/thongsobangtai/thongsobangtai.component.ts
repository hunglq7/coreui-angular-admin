import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
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
import { BangtaiSearchComponent } from '../../../components/nav-bangtai-search/bangtai-search.component';
import { ThongSoKyThuatBangTai } from '../../../core/interface/bangtai/ThongSoKyThuatBangTai';

@Component({
  selector: 'app-thongsobangtai',
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
    BangtaiSearchComponent,
    NzIconModule,
    NzButtonModule,
    NzToolTipModule,
    NzTableModule,
    NzFormModule,
  ],
  templateUrl: './thongsobangtai.component.html',
  styleUrl: './thongsobangtai.component.scss',
})
export class ThongsobangtaiComponent implements OnInit {
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
  dataSource: ThongSoKyThuatBangTai[] = [];
  entity: ThongSoKyThuatBangTai = {
    id: 0,
    bangTaiId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmucBangtai: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;
  size: NzButtonSize = 'small';

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.initFormBuilder();
  }

  ngOnInit(): void {
    this.loadData();
    this.getDanhmucBangtai();
    if ((this.Id = 0)) {
      this.addNewthongsoBangtai();
    } else {
      this.getThongsokythuatBangtai();
    }
  }

  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl({ value: null, disabled: false }),
      bangTaiId: new FormControl({ value: null, disabled: false }),
      noiDung: new FormControl({ value: null, disabled: false }),
      donViTinh: new FormControl({ value: null, disabled: false }),
      thongSo: new FormControl({ value: null, disabled: false }),
    });
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadData();
  }
  pageIndexChanged(event: any) {
    this.pageIndex = event;
    this.loadData();
  }

  pageSizeChange(event: any) {
    this.pageSize = event;
    this.loadData();
  }

  private loadFormData(items: ThongSoKyThuatBangTai) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      bangTaiId: items.bangTaiId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }

  addNewthongsoBangtai() {
    this.dataService.getById('/api/Thongsokythuatbangtai/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getThongsokythuatBangtai() {
    this.dataService
      .getById('/api/Thongsokythuatbangtai/' + this.Id)
      .subscribe({
        next: (data: any) => {
          this.loadFormData(data);
        },
      });
  }

  getDanhmucBangtai() {
    this.dataService.get('/api/Danhmucbangtai').subscribe({
      next: (data: any) => {
        this.dsDanhmucBangtai = data;
      },
    });
  }

  loadData() {
    this.dataService
      .get(
        '/api/Thongsokythuatbangtai/paging?thietbiId=' +
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

  onThemmoi() {
    this.title = 'Thêm mới thông số';
    this.themoi = true;
    this.Id = 0;
    this.addNewthongsoBangtai();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getThongsokythuatBangtai();
    this.title = 'Sửa thông số';
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
          .delete('/api/Thongsokythuatbangtai/' + this.Id)
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

  save() {
    if (this.themoi) {
      this.dataService
        .post('/api/Thongsokythuatbangtai', this.Form.value)
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
        .put('/api/Thongsokythuatbangtai/update', this.Form.value)
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
}
