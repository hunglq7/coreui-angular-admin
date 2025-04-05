import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';

export interface Thongsoneo {
  id: number;
  tenThietBi: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsoneo-tab',
  imports: [FormModule, CommonModule],
  templateUrl: './thongsoneo-tab.component.html',
  styleUrl: './thongsoneo-tab.component.scss',
})
export class ThongsoneoTabComponent implements OnChanges {
  @Input() TonghopneoDetail: any;
  neoId!: number;
  entity: any;
  items: any;
  constructor(private dataService: DataService) {}
  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['TonghopneoDetail'].currentValue;
    this.neoId = change.neoId;
    if (this.neoId > 0) {
      this.getDataDetail();
    }
  }
  getDataDetail() {
    this.dataService
      .getById('/api/Thongsoneo/DetailById/' + this.neoId)
      .subscribe((data: any) => {
        this.items = data;
      });
  }
}
