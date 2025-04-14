import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  RowComponent,
  ColComponent,
  DropdownModule,
  SharedModule,
} from '@coreui/angular';
import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
} from '@coreui/angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { ThietbiSearchComponent } from '../../../components/nav-thietbi-search/thietbi-search.component';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ThongsoQuatgio } from '../../../core/interface/quatgio/thongso-quatgio';
import { ThongsoQuatgioDetail } from '../../../core/interface/quatgio/thongso-quatgio-detail';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-thongsoquatgio',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RowComponent,
    ColComponent,
    PaginationModule,
    DropdownModule,
    SharedModule,
    ThietbiSearchComponent,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
  ],
  templateUrl: './thongsoquatgio.component.html',
  styleUrl: './thongsoquatgio.component.scss',
})
export class ThongsoquatgioComponent implements OnInit {
  isVisible = false;
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  keywordThietbi: number = 0;
  dataSource: ThongsoQuatgio[] = [];
  entity: ThongsoQuatgioDetail = {
    id: 0,
    quatgioId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmucQuatgio: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;
  size: NzButtonSize = 'small';
  isOkLoading = false;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  private fb = inject(FormBuilder);
  ngOnInit(): void {
    this.initFormBuilder();
    this.loadData();
    this.getDanhmucQuatgio();
    if ((this.Id = 0)) {
      this.addNew();
    } else {
      this.getThongsoById();
    }
  }

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: [null],
      quatgioId: [null, Validators.required],
      noiDung: [null],
      donViTinh: [null],
      thongSo: [null],
    });
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  submitForm(): void {
    if (this.Form.valid) {
      this.save();
    } else {
      Object.values(this.Form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private loadFormData(items: ThongsoQuatgioDetail) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      quatgioId: items.quatgioId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadData();
  }
  addNew() {
    this.dataService.getById('/api/Thongsoquatgio/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getThongsoById() {
    this.dataService.getById('/api/Thongsoquatgio/' + this.Id).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getDanhmucQuatgio() {
    this.dataService.get('/api/Danhmucquatgio').subscribe({
      next: (data: any) => {
        this.dsDanhmucQuatgio = data;
      },
    });
  }

  loadData() {
    this.dataService
      .get(
        '/api/Thongsoquatgio/paging?thietbiId=' +
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
    this.isVisible = event;
  }

  onThemmoi() {
    this.title = 'Thêm mới';
    this.themoi = true;
    this.Id = 0;
    this.addNew();
    this.isVisible = !this.isVisible;
  }

  onClode() {
    this.Form.reset();
    this.isVisible = !this.isVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getThongsoById();
    this.title = 'Sửa thông số quạt gió';
    this.isVisible = !this.isVisible;
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
        this.dataService.delete('/api/Thongsoquatgio/' + this.Id).subscribe({
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
      this.dataService.post('/api/Thongsoquatgio', this.Form.value).subscribe({
        next: () => {
          this.loadData();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.isVisible = !this.isVisible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    } else {
      this.dataService
        .put('/api/Thongsoquatgio/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadData();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.isVisible = !this.isVisible;
            this.Form.reset();
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    }
  }

  public pageIndexChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  pageSizeChange(event: any): void {
    this.pageSize = event;
    this.loadData();
  }
}
