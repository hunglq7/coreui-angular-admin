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

export interface Thongsokythuatmayxuc {
  id: number;
  tenMayXuc: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

export interface ThongsokythuatmayxucEdit {
  id: number;
  mayXucId: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsomayxuc',
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
  templateUrl: './thongsomayxuc.component.html',
  styleUrl: './thongsomayxuc.component.scss',
})
export class ThongsomayxucComponent implements OnInit {
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
  dataSource: Thongsokythuatmayxuc[] = [];
  entity: ThongsokythuatmayxucEdit = {
    id: 0,
    mayXucId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmucMayxuc: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.initFormBuilder();
  }
  ngOnInit(): void {
    this.loadData();
    this.getDanhmucMayxuc();
    if ((this.Id = 0)) {
      this.addNewthongsoMayxuc();
    } else {
      this.getThongsokythuatMayxuc();
    }
  }

  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl({ value: null, disabled: false }),
      mayXucId: new FormControl({ value: null, disabled: false }),
      noiDung: new FormControl({ value: null, disabled: false }),
      donViTinh: new FormControl({ value: null, disabled: false }),
      thongSo: new FormControl({ value: null, disabled: false }),
    });
  }

  private loadFormData(items: ThongsokythuatmayxucEdit) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      mayXucId: items.mayXucId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }

  addNewthongsoMayxuc() {
    this.dataService.getById('/api/Thongsokythuatmayxuc/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getThongsokythuatMayxuc() {
    this.dataService.getById('/api/Thongsokythuatmayxuc/' + this.Id).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getDanhmucMayxuc() {
    this.dataService.get('/api/MayXuc').subscribe({
      next: (data: any) => {
        this.dsDanhmucMayxuc = data;
      },
    });
  }

  loadData() {
    this.dataService
      .get(
        '/api/Thongsokythuatmayxuc/paging?thietbiId=' +
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
    this.addNewthongsoMayxuc();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getThongsokythuatMayxuc();
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
          .delete('/api/Thongsokythuatmayxuc/' + this.Id)
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
        .post('/api/Thongsokythuatmayxuc', this.Form.value)
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
        .put('/api/Thongsokythuatmayxuc/update', this.Form.value)
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
