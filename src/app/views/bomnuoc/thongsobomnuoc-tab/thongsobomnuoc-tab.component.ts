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
    if (changes['TonghopbomnuocDetail'] && changes['TonghopbomnuocDetail'].currentValue) {
      this.entity = changes['TonghopbomnuocDetail'].currentValue;
      
      // Try different possible property names for the ID
      this.bomNuocId = this.entity.bomNuocId || this.entity.id || this.entity.bomnuocId;
      
      console.log('Entity:', this.entity);
      console.log('BomNuocId:', this.bomNuocId);
      
      // Only call API if we have a valid ID
      if (this.bomNuocId && this.bomNuocId > 0) {
        this.getDataDetail();
      } else {
        console.warn('Invalid bomNuocId:', this.bomNuocId);
        this.items = [];
      }
    }
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsobomnuoc/DetailById/' + this.bomNuocId)
      .subscribe({
        next: (response) => {
          this.items = response;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.items = [];
        }
      });
  }

}
