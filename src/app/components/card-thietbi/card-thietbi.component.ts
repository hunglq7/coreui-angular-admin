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
  sumTonghopquatgio!: number;
  sumTonghopbomnuoc!: number;
  sumTonghopkhoan!: number;
  sumTonghopbalang!: number;
  sumTonghopmaycao!: number;
  sumTonghopneo!: number;
  sumTonghopcapdien!: number;
  sumTonghopgiacotthuyluc!: number;
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.GetSumTonghopmayxuc();
    this.GetSumTonghoptoitruc();
    this.GetSumTonghopquatgio();
    this.GetSumTonghopbomnuoc();
    this.GetSumTonghopbalang();
    this.GetSumTonghopkhoan();
    this.GetSumTonghopmaycao();
    this.GetSumTonghopneo();
    this.GetSumTonghopcapdien();
    this.GetSumTonghopgiacotthuyluc();
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

  GetSumTonghopquatgio() {
    this.dataService.get('/api/Tonghopquatgio/sumTonghopquatgio').subscribe({
      next: (data: any) => {
        this.sumTonghopquatgio = data;
      },
    });
  }

  GetSumTonghopbomnuoc() {
    this.dataService.get('/api/Tonghopbomnuoc/sum').subscribe({
      next: (data: any) => {
        this.sumTonghopbomnuoc = data;
      },
    });
  }
  GetSumTonghopbalang() {
    this.dataService.get('/api/Tonghopbalang/sum').subscribe({
      next: (data: any) => {
        this.sumTonghopbalang = data;
      },
    });
  }
  GetSumTonghopkhoan() {
    this.dataService.get('/api/Tonghopkhoan/sum').subscribe({
      next: (data: any) => {
        this.sumTonghopkhoan = data;
      },
    });
  }
  GetSumTonghopmaycao() {
    this.dataService.get('/api/Tonghopmaycao/sum').subscribe({
      next: (data: any) => {
        this.sumTonghopmaycao = data;
      },
    });
  }
  GetSumTonghopneo() {
    this.dataService.get('/api/Tonghopneo/sum').subscribe({
      next: (data: any) => {
        this.sumTonghopneo = data;
      },
    });
  }
  GetSumTonghopcapdien() {
    this.dataService.get('/api/Tonghopcapdien/sum').subscribe({
      next: (data: any) => {
        this.sumTonghopcapdien = data;
      },
    });
  }
  GetSumTonghopgiacotthuyluc() {
    this.dataService.get('/api/Tonghopgiacotthuyluc/sum').subscribe({
      next: (data: any) => {
        this.sumTonghopgiacotthuyluc = data;
      },
    });
  }
}
