import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import { ThietbiSearchComponent } from '../../../components/nav-thietbi-search/thietbi-search.component';
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
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import {
  ThongSoBomNuoc,
  ThongSoBomNuocDetail,
} from '../../../core/interface/bomnuoc/bomnuoc-interface';
@Component({
  selector: 'app-thongsobomnuoc',
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
    ThietbiSearchComponent,
    SharedModule,
    NzIconModule,
    NzButtonModule,
    NzToolTipModule,
    NzTableModule,
    NzFormModule,
  ],
  templateUrl: './thongsobomnuoc.component.html',
  styleUrl: './thongsobomnuoc.component.scss',
})
export class ThongsobomnuocComponent implements OnInit {
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
  dataSource: ThongSoBomNuoc[] = [];
  entity: ThongSoBomNuocDetail = {
    id: 0,
    bomNuocId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmuc: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;
  size: NzButtonSize = 'small';
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.initFormBuilder();
    this.loadData();
    this.getDanhmuc();
    if ((this.Id = 0)) {
      this.addNew();
    } else {
      this.getThongsoById();
    }
  }

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: [''],
      bomNuocId: ['', Validators.required],
      noiDung: ['', Validators.required],
      donViTinh: [''],
      thongSo: [''],
    });
  }
  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.loadData();
  }
  pageSizeChange(event: number) {
    this.pageSize = event;
    this.loadData();
  }

  pageIndexChanged(event: any) {
    this.pageIndex = event;
    this.loadData();
  }
  private loadFormData(items: ThongSoBomNuocDetail) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      bomNuocId: items.bomNuocId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }

  addNew() {
    this.dataService.getById('/api/Thongsobomnuoc/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getThongsoById() {
    this.dataService.getById('/api/Thongsobomnuoc/' + this.Id).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getDanhmuc() {
    this.dataService.get('/api/Danhmucbomnuoc').subscribe({
      next: (data: any) => {
        this.dsDanhmuc = data;
      },
    });
  }

  loadData() {
    this.dataService
      .get(
        '/api/Thongsobomnuoc/paging?thietbiId=' +
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
        this.dataService.delete('/api/Thongsobomnuoc/' + this.Id).subscribe({
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
      this.dataService.post('/api/Thongsobomnuoc', this.Form.value).subscribe({
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
        .put('/api/Thongsobomnuoc/update', this.Form.value)
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

  eventSearch(id: any) {
    this.keywordThietbi = id;
    this.loadData();
  }

  eventAdd(eventBoolean: boolean) {
    if (eventBoolean) {
      this.onThemmoi();
    }
  }
  datte = new Date().getDate();
  month = new Date().getMonth();
  year = new Date().getFullYear();
  newDate = (this.datte + '-' + this.month + '-' + this.year).toString();
  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Thongsobomnuoc' + this.newDate + '.xlsx');
  }
}
