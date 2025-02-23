import {
  Component,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
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
  InputGroupComponent,
  InputGroupTextDirective,
  FormSelectDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
export interface Tonghoptoitruc {
  id: number;
  maQuanLy: string;
  tenThietBi: string;
  phongBan: string;
  viTriLapDat: string;
  ngayLap: string;
  mucDichSuDung: string;
  soLuong: number;
  tinhTrangThietBi: string;
}

@Component({
  selector: 'app-capnhattoidien',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormFeedbackComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    FormSelectDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ButtonDirective,
    NgTemplateOutlet,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    IconDirective,
    PaginationModule,
  ],
  templateUrl: './capnhattoidien.component.html',
  styleUrl: './capnhattoidien.component.scss',
})
export class CapnhattoidienComponent implements OnInit {
  public liveDemoVisible = false;
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  filterKeyword = '';
  toidiens: Tonghoptoitruc[] = [];

  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.loadTonghoptoitruc();
  }
  loadTonghoptoitruc() {
    this.dataService
      .get(
        '/api/Tonghoptoitruc/paging?Keyword=' +
          this.filterKeyword +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.toidiens = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
      });
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadTonghoptoitruc();
  }
  toggleLiveDemo() {
    this.title = 'Thêm mới tời điện';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEditLiveDemo() {
    this.title = 'Sửa tời điện';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }
  onSubmit1() {
    this.customStylesValidated = true;
    alert('Thêm thành công');
  }

  onReset1() {
    this.customStylesValidated = false;
  }

  readonly activeItem = signal(0);
  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }
}
