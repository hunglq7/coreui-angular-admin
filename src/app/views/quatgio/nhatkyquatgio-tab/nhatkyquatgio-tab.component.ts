import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectionModule,
  RowSelectionOptions,
} from 'ag-grid-community';
import { DataService } from '../../../core/services/data.service';
import { AgGridAngular } from 'ag-grid-angular';
import { RowComponent, ColComponent } from '@coreui/angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);
export interface NhatkyquatgioDetail {
  id: number;
  tonghopquatgioId: number;
  ngayLap: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
}
@Component({
  selector: 'app-nhatkymayxuc-tab',
  imports: [],
  templateUrl: './nhatkymayxuc-tab.component.html',
  styleUrl: './nhatkymayxuc-tab.component.scss',
})
export class NhatkyquatgioTabComponent {}
