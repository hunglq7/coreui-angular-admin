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
    if (changes['TonghopbangtaiDetail'] && changes['TonghopbangtaiDetail'].currentValue) {
      const change = changes['TonghopbangtaiDetail'].currentValue;
      
      // Try different possible property names for the ID
      this.bangtaiId = change.bangTaiId || change.id || change.bangtaiId;
      
      console.log('Entity:', change);
      console.log('BangtaiId:', this.bangtaiId);
      
      // Only call API if we have a valid ID
      if (this.bangtaiId && this.bangtaiId > 0) {
        this.getDataDetail();
      } else {
        console.warn('Invalid bangtaiId:', this.bangtaiId);
        this.items = [];
      }
    }
  }

  getDataDetail() {
    this.dataService
      .getById('/api/Thongsokythuatbangtai/DetailById/' + this.bangtaiId)
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
