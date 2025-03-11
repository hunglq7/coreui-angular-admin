import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
export interface ThongsoBomNuoc {
  id: number;
  tenThietbi: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}


@Component({
  selector: 'app-thongsobomnuoc-tab',
  imports: [],
  templateUrl: './thongsobomnuoc-tab.component.html',
  styleUrl: './thongsobomnuoc-tab.component.scss'
})
export class ThongsobomnuocTabComponent implements OnChanges {

  @Input() TonghopbomnuocDetail: any;

  bomNuocId!: number;
  entity: any;
  items: any;

  constructor(private dataService: DataService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.entity = changes['TonghopbomnuocDetail'].currentValue;
    this.bomNuocId = this.entity.bomNuocId;
    this.getDataDetail();
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsobomnuoc/DetailById/' + this.bomNuocId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
      });
  }

}
