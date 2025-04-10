import { Component, OnInit } from '@angular/core';
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
  TableDirective,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  FormFeedbackComponent,
  FormSelectDirective,
  InputGroupComponent,
  DropdownModule,
  SharedModule,
} from '@coreui/angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
export interface ThongsoQuatgio {
  id: number;
  tenThietBi: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
export interface ThongsoQuatgioDetail {
  id: number;
  quatgioId: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
@Component({
  selector: 'app-thongsoquatgio',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormFeedbackComponent,
    InputGroupComponent,
    FormSelectDirective,
    ButtonDirective,
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
    TableDirective,
    SharedModule,
  ],
  templateUrl: './thongsoquatgio.component.html',
  styleUrl: './thongsoquatgio.component.scss',
})
export class ThongsoquatgioComponent implements OnInit {
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
  dataSource: ThongsoQuatgio[] = [];
  entity!: ThongsoQuatgioDetail;
  dsDanhmucQuatgio: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

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
    this.Form = new FormGroup({
      id: new FormControl({ value: null, disabled: false }),
      quatgioId: new FormControl({ value: null, disabled: false }),
      noiDung: new FormControl({ value: null, disabled: false }),
      donViTinh: new FormControl({ value: null, disabled: false }),
      thongSo: new FormControl({ value: null, disabled: false }),
    });
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadData();
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
        console.log(data);
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
    this.liveDemoVisible = event;
  }

  onThemmoi() {
    this.title = 'Thêm mới thông số';
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
    this.getThongsoById();
    this.title = 'Sửa thông số quạt gió';
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
          this.liveDemoVisible = !this.liveDemoVisible;
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
            this.liveDemoVisible = !this.liveDemoVisible;
            this.Form.reset();
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    }
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
}
