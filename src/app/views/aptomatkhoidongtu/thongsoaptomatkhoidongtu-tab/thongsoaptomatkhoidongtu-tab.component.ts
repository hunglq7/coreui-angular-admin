import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DataService } from '../../../core/services/data.service';

export interface ThongsoAptomatKhoiDongTu {
  id: number;
  tenThietbi: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsoaptomatkhoidongtu-tab',
  imports: [],
  templateUrl: './thongsoaptomatkhoidongtu-tab.component.html',
  styleUrl: './thongsoaptomatkhoidongtu-tab.component.scss'
})
export class ThongsoaptomatkhoidongtuTabComponent implements OnChanges {

  @Input() TonghopaptomatkhoidongtuDetail: any;

  aptomatKhoiDongTuId!: number;
  entity: any;
  items: any;

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghopaptomatkhoidongtuDetail'].currentValue;
    this.aptomatKhoiDongTuId = this.entity.aptomatKhoiDongTuId;
    this.getDataDetail();
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsoaptomatkhoidongtu/DetailById/' + this.aptomatKhoiDongTuId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
      });
  }

}
