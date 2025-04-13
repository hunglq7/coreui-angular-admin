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
  ButtonDirective,
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
import { NzButtonComponent, NzButtonSize } from 'ng-zorro-antd/button';
import { ThietbiSearchComponent } from '../../../components/nav-thietbi-search/thietbi-search.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
export interface Thongsokythuattoitruc {
  id: number;
  tenToiTruc: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
export interface ThongsokythuattoitrucDetail {
  id: number;
  danhmuctoitrucId: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsokythuattoidien',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormFeedbackComponent,
    FormSelectDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    PaginationModule,
    DropdownModule,
    SharedModule,

    // Tab
    CardBodyComponent,
    CardComponent,
    RowComponent,
    NzButtonComponent,
    NzTableModule,
    NzToolTipModule,
    NzIconModule,
    ThietbiSearchComponent,
  ],
  templateUrl: './thongsokythuattoidien.component.html',
  styleUrl: './thongsokythuattoidien.component.scss',
})
export class ThongsokythuattoidienComponent implements OnInit {
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
  dataSource: Thongsokythuattoitruc[] = [];
  entity: ThongsokythuattoitrucDetail = {
    id: 0,
    danhmuctoitrucId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmucToidien: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;
  size: NzButtonSize = 'small';
  ngOnInit(): void {
    this.loadData();
    this.getDanhmuctoitruc();
    if ((this.Id = 0)) {
      this.addThongsokythuattoitrucDetail();
    } else {
      this.getThongsokythuattoitrucDetail();
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
      danhmuctoitrucId: new FormControl({ value: null, disabled: false }),
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
        .post('/api/Thongsokythuattoitruc', this.Form.value)
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
        .put('/api/Thongsokythuattoitruc/update', this.Form.value)
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
    this.title = 'Thêm mới thông số';
    this.themoi = true;
    this.Id = 0;
    this.addThongsokythuattoitrucDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getThongsokythuattoitrucDetail();
    this.title = 'Sửa tời điện';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onDelete(id: number) {
    this.Id = id;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: 'Bán có muốn xóa bản ghi này?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService
          .delete('/api/Thongsokythuattoitruc/' + this.Id)
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

  private loadFormData(items: ThongsokythuattoitrucDetail) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      danhmuctoitrucId: items.danhmuctoitrucId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }

  getThongsokythuattoitrucDetail() {
    this.dataService
      .getById('/api/Thongsokythuattoitruc/' + this.Id)
      .subscribe({
        next: (data: any) => {
          this.loadFormData(data);
        },
        error: () => {
          this.toastr.error('Lấy dữ liệu thất bại', 'Error');
        },
      });
  }

  addThongsokythuattoitrucDetail() {
    this.dataService.getById('/api/Thongsokythuattoitruc/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }
  getDanhmuctoitruc() {
    this.dataService.get('/api/Danhmuctoitruc').subscribe({
      next: (data: any) => {
        this.dsDanhmucToidien = data;
      },
    });
  }
  loadData() {
    this.dataService
      .get(
        '/api/Thongsokythuattoitruc/paging?thietbiId=' +
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
