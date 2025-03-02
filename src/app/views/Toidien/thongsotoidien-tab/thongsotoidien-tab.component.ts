import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';

export interface Thongsokythuattoitruc {
  id: number;
  tenToiTruc: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsotoidien-tab',
  imports: [FormModule, CommonModule],
  templateUrl: './thongsotoidien-tab.component.html',
  styleUrl: './thongsotoidien-tab.component.scss',
})
export class ThongsotoidienTabComponent implements OnChanges {
  @Input() TonghoptoitrucDetail: any;
  thietbiId!: number;
  entity: any;
  items: any;
  constructor(private dataService: DataService) {}
  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['TonghoptoitrucDetail'].currentValue;
    this.entity = change;
    this.getDataDetail();
  }

  getDataDetail() {
    this.thietbiId = this.entity.thietbiId;
    this.dataService
      .getById('/api/Thongsokythuattoitruc/DetailById/' + this.thietbiId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
      });
  }
}
