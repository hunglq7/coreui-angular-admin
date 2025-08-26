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
  styleUrl: './thongsoaptomatkhoidongtu-tab.component.scss',
})
export class ThongsoaptomatkhoidongtuTabComponent implements OnChanges {
  @Input() TonghopaptomatkhoidongtuDetail: any;

  aptomatKhoiDongTuId!: number;
  entity: any;
  items: any;

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['TonghopaptomatkhoidongtuDetail'] &&
      changes['TonghopaptomatkhoidongtuDetail'].currentValue
    ) {
      this.entity = changes['TonghopaptomatkhoidongtuDetail'].currentValue;

      // Try different possible property names for the ID

      this.aptomatKhoiDongTuId = this.entity.aptomatkhoidongtuId;

      // Only call API if we have a valid ID
      if (this.aptomatKhoiDongTuId && this.aptomatKhoiDongTuId > 0) {
        this.getDataDetail();
      } else {
        console.warn('Invalid aptomatKhoiDongTuId:', this.aptomatKhoiDongTuId);
        this.items = [];
      }
    }
  }

  getDataDetail() {
    this.dataService
      .getById(
        '/api/Thongsoaptomatkhoidongtu/DetailById/' + this.aptomatKhoiDongTuId
      )
      .subscribe({
        next: (response) => {
          this.items = response;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.items = [];
        },
      });
  }
}
