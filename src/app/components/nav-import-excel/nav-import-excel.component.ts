import {
  Component,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-nav-import-excel',
  imports: [NzInputModule],

  template: `
    <input
      nz-input
      type="file"
      placeholder="Chọn file excel"
      #importExcel
      (change)="importexcel($event)"
    />
  `,
  styles: [
    `
      [nz-input] {
        width: 500px;
      }
    `,
  ],
})
export class NavImportExcelComponent implements OnChanges {
  @Output() eventImportExcel = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Onchange:' + changes);
  }

  importexcel(event: any) {
    this.eventImportExcel.emit(event);
  }
}
