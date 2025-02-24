import { Component } from '@angular/core';
import { CardThietbiComponent } from '../../components/card-thietbi/card-thietbi.component';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [CardThietbiComponent],
})
export class DashboardComponent {}
