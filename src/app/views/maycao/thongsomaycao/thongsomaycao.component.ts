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
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ThietbiSearchComponent } from '../../../components/nav-thietbi-search/thietbi-search.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  ThongsokythuatMayCao,
  ThongsokythuatMayCaoDetail,
} from '../../../core/interface/maycao/maycao-interface';
@Component({
  selector: 'app-thongsomaycao',
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
  templateUrl: './thongsomaycao.component.html',
  styleUrl: './thongsomaycao.component.scss',
})
export class ThongsomaycaoComponent implements OnInit {
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
  dataSource: ThongsokythuatMayCao[] = [];
  entity: ThongsokythuatMayCaoDetail = {
    id: 0,
    mayCaoId: 0,
    noiDung: '',
    donViTinh: '',
    thongSo: '',
  };
  dsDanhmucMayCao: any[] = [];
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
      mayCaoId: new FormControl(null, Validators.required),
      noiDung: new FormControl(null, Validators.required),
      donViTinh: new FormControl(null, Validators.required),
      thongSo: new FormControl(null, Validators.required),
    });
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadData();
  }
  addNewthongsoMayCao() {
    this.dataService.getById('/api/Thongsokythuatmaycao/' + 0).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  private loadFormData(items: ThongsokythuatMayCaoDetail) {
    this.entity = items;
    this.Form.setValue({
      id: items.id,
      mayCaoId: items.mayCaoId,
      noiDung: items.noiDung,
      donViTinh: items.donViTinh,
      thongSo: items.thongSo,
    });
  }

  getThongsokythuatMayCao() {
    this.dataService.getById('/api/Thongsokythuatmaycao/' + this.Id).subscribe({
      next: (data: any) => {
        this.loadFormData(data);
      },
    });
  }

  getDanhmucMayCao() {
    this.dataService.get('/api/Danhmucmaycao').subscribe({
      next: (data: any) => {
        this.dsDanhmucMayCao = data;
      },
    });
  }

  loadData() {
    this.dataService
      .get(
        '/api/Thongsokythuatmaycao/paging?thietbiId=' +
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
    this.addNewthongsoMayCao();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getThongsokythuatMayCao();
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
    this.dataService.delete('/api/Thongsokythuatmaycao/' + this.Id).subscribe({
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
      this.dataService
        .post('/api/Thongsokythuatmaycao', this.Form.value)
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
        .put('/api/Thongsokythuatmaycao/update', this.Form.value)
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
    this.getDanhmucMayCao();
    if ((this.Id = 0)) {
      this.addNewthongsoMayCao();
    } else {
      this.getThongsokythuatMayCao();
    }
  }
}
