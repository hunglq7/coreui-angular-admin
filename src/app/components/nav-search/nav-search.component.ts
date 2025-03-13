import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonDirective,
  RowComponent,
  ColComponent,
  InputGroupComponent,
} from '@coreui/angular';
import { MaterialModule } from '../../shared/material.module';
@Component({
  selector: 'app-nav-search',
  imports: [
    ButtonDirective,
    ColComponent,
    RowComponent,
    InputGroupComponent,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './nav-search.component.html',
  styleUrl: './nav-search.component.scss',
})
export class NavSearchComponent implements OnInit {
  @Input() items: any;
  @Output() eventSearch = new EventEmitter<number>();
  @Output() eventAdd = new EventEmitter<boolean>();
  them: boolean = true;
  keywordThietbi!: number;
  ngOnInit(): void {}

  handClickSearch() {
    this.eventSearch.emit(this.keywordThietbi);
  }

  handClickAdd() {
    this.eventAdd.emit(this.them);
  }
}
