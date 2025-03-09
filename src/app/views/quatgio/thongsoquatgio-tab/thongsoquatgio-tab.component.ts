import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
export interface ThongsoQuatgio {
  id: number;
  tenThietbi: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}

@Component({
  selector: 'app-thongsoquatgio-tab',
  imports: [],
  templateUrl: './thongsoquatgio-tab.component.html',
  styleUrl: './thongsoquatgio-tab.component.scss',
})
export class ThongsoquatgioTabComponent implements OnChanges {
  @Input() TonghopquatgioDetail: any;

  quatgioId!: number;
  entity: any;
  items: any;

  constructor(private dataService: DataService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghopquatgioDetail'].currentValue;
    this.quatgioId = this.entity.quatGioId;
    this.getDataDetail();
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsoquatgio/DetailById/' + this.quatgioId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
      });
  }
}
