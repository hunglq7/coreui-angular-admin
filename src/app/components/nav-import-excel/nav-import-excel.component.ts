import {
  Component,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-nav-import-excel',
  imports: [],

  template: `<input
    type="file"
    class="form-control"
    placeholder="Chọn file"
    #importExcel
    (change)="importexcel($event)"
  /> `,
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
