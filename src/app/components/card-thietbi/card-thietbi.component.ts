import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import {
  CardModule,
  RowComponent,
  ColComponent,
  CardComponent,
  GutterDirective,
  ButtonModule,
} from '@coreui/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-card-thietbi',
  imports: [
    CardModule,
    RowComponent,
    ColComponent,
    CardComponent,
    GutterDirective,
    ButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './card-thietbi.component.html',
  styleUrl: './card-thietbi.component.scss',
})
export class CardThietbiComponent implements OnInit {
  sumTonghopmayxuc!: number;
  sumTonghoptoitruc!: number;
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.GetSumTonghopmayxuc();
    this.GetSumTonghoptoitruc();
  }
  GetSumTonghopmayxuc() {
    this.dataService.get('/api/Tonghopmayxuc/sumTonghopmayxuc').subscribe({
      next: (data: any) => {
        this.sumTonghopmayxuc = data;
      },
    });
  }

  GetSumTonghoptoitruc() {
    this.dataService.get('/api/Tonghoptoitruc/sumTonghoptoitruc').subscribe({
      next: (data: any) => {
        this.sumTonghoptoitruc = data;
      },
    });
  }
}
