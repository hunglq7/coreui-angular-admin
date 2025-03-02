import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';

export interface Thongsokythuatmayxuc {
  id: number;
  tenMayXuc: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsomayxuc-tab',
  imports: [FormModule, CommonModule],
  templateUrl: './thongsomayxuc-tab.component.html',
  styleUrl: './thongsomayxuc-tab.component.scss',
})
export class ThongsomayxucTabComponent implements OnChanges {
  @Input() TonghopmayxucDetail: any;
  mayxucId!: number;
  entity: any;
  items: any;
  constructor(private dataService: DataService) {}
  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['TonghopmayxucDetail'].currentValue;
    this.mayxucId = change.mayXucId;
    if (this.mayxucId > 0) {
      this.getDataDetail();
    }
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsokythuatmayxuc/DetailById/' + this.mayxucId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
      });
  }
}
