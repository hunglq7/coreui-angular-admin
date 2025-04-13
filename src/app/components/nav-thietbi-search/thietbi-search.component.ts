import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-thietbi-search',
  standalone: true,
  imports: [
    FormsModule,
    NzCascaderModule,
    NzDatePickerModule,
    NzGridModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzIconModule,
    NzButtonModule,
  ],
  template: `
    <nz-input-group nzSearch>
      <nz-select
        nzPlaceHolder="Chọn thiết bị"
        [(ngModel)]="keywordThietbi"
        style="width: 400px"
      >
        @for (item of dsThietbi ; track $index) {
        <nz-option [nzLabel]="item.tenThietBi" [nzValue]="item.id"></nz-option>
        }
      </nz-select>
      <button (click)="search()" nz-button nzType="primary" nzSearch>
        <nz-icon nzType="search" />
      </button>
    </nz-input-group>
  `,

  styles: [
    `
      [nz-button] {
        margin-right: 8px;
        margin-bottom: 8px;
      }

      nz-input-group {
        width: 600px;
      }
    `,
  ],
})
export class ThietbiSearchComponent {
  @Input() dsThietbi: any[] = [];

  @Output() eventSearchThietbi = new EventEmitter<any>();
  keywordThietbi: number = 0;
  search() {
    this.eventSearchThietbi.emit(this.keywordThietbi);
  }
}
