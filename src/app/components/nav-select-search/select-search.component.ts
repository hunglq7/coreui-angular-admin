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
  selector: 'app-select-search',
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
  template: ` <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
      <nz-select
        nzPlaceHolder="Chọn thiết bị"
        [(ngModel)]="keywordThietbi"
        style="width: 50%"
      >
        <nz-option [nzLabel]="'Chọn hết...'" [nzValue]="''"></nz-option>
        @for (item of dsThietbi ; track $index) {
        <nz-option [nzLabel]="item.tenThietBi" [nzValue]="item.id"></nz-option>
        }
      </nz-select>
      <nz-select
        nzPlaceHolder="Chọn đơn vị"
        [(ngModel)]="keywordDonvi"
        style="width: 50%"
      >
        <nz-option [nzLabel]="'Chọn hết...'" [nzValue]="''"></nz-option>
        @for (item of dsDonvi ; track $index) {
        <nz-option [nzLabel]="item.tenPhong" [nzValue]="item.id"></nz-option>
        }
      </nz-select>
    </nz-input-group>

    <ng-template #suffixIconButton>
      <button (click)="search()" nz-button nzType="primary" nzSearch>
        <nz-icon nzType="search" />
      </button>
    </ng-template>`,

  styles: [
    `
      [nz-button] {
        margin-right: 8px;
        margin-bottom: 8px;
      }

      nz-input-group {
        width: 400px;
      }
    `,
  ],
})
export class SelectSearchComponent {
  @Input() dsThietbi: any[] = [];
  @Input() dsDonvi: any[] = [];
  @Output() eventSearchThietbi = new EventEmitter<any>();
  @Output() eventSearchDonvi = new EventEmitter<any>();
  keywordThietbi: number = 0;
  keywordDonvi: number = 0;
  search() {
    this.eventSearchThietbi.emit(this.keywordThietbi);
    this.eventSearchDonvi.emit(this.keywordDonvi);
  }
}
