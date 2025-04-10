import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';

export interface Thongsokythuatmaycao {
  id: number;
  tenThietBi: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsomaycao-tab',
  imports: [FormModule, CommonModule],
  templateUrl: './thongsomaycao-tab.component.html',
  styleUrl: './thongsomaycao-tab.component.scss',
})
export class ThongsomaycaoTabComponent implements OnChanges {
  @Input() TonghopmaycaoDetail: any;
  mayCaoId!: number;
  entity: any;
  items: any;
  constructor(private dataService: DataService) {}
  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['TonghopmayxucDetail'].currentValue;
    this.mayCaoId = change.mayXucId;
    if (this.mayCaoId > 0) {
      this.getDataDetail();
    }
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsokythuatmaycao/DetailById/' + this.mayCaoId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
      });
  }
}
