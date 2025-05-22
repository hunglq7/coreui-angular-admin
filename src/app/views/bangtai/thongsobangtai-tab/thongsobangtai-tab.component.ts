import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ThongSoKyThuatBangTai } from '../../../core/interface/bangtai/ThongSoKyThuatBangTai';

@Component({
  selector: 'app-thongsobangtai-tab',
  imports: [FormModule, CommonModule],
  templateUrl: './thongsobangtai-tab.component.html',
  styleUrl: './thongsobangtai-tab.component.scss',
})
export class ThongsobangtaiTabComponent implements OnChanges {
  @Input() TonghopbangtaiDetail: any;
  bangtaiId!: number;
  entity: any;
  items: any;

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['TonghopbangtaiDetail'].currentValue;
    this.bangtaiId = change.bangTaiId;
    if (this.bangtaiId > 0) {
      this.getDataDetail();
    }
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsokythuatbangtai/DetailById/' + this.bangtaiId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
      });
  }
}
