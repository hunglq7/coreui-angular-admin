import { Component } from '@angular/core';
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
export class CardThietbiComponent {}
