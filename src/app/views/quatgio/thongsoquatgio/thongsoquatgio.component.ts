import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  ICellRendererParams,
  ValueGetterParams,
} from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="buttonClicked()">Push Me!</button>`,
})
export class CustomButtonComponent implements ICellRendererAngularComp {
  agInit(params: ICellRendererParams): void {}
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    alert('Thông báo');
  }
}

@Component({
  selector: 'app-thongsoquatgio',
  imports: [AgGridAngular],
  templateUrl: './thongsoquatgio.component.html',
  styleUrl: './thongsoquatgio.component.scss',
})
export class ThongsoquatgioComponent {
  public thongbao() {
    alert('Thông báo');
  }
  public rowData: any[] | null = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
    { make: 'Fiat', model: '500', price: 15774, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
  ];
  public columnDefs: ColDef[] = [
    {
      headerName: 'Make & Model',
      valueGetter: (p: ValueGetterParams) => p.data.make + ' ' + p.data.model,
      flex: 2,
    },
    {
      field: 'price',
      valueFormatter: (p) => '£' + Math.floor(p.value).toLocaleString(),
      flex: 1,
    },
    { field: 'electric', flex: 1 },
    { field: 'button', cellRenderer: CustomButtonComponent, flex: 1 },
  ];
}
