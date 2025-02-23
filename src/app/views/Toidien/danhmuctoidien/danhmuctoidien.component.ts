import { Component,OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  ButtonCloseDirective,
  ButtonDirective, 
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,  
  ThemeDirective,

} from '@coreui/angular';

import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective } from '@coreui/angular';
import {  FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, } from '@coreui/angular';
@Component({
  selector: 'app-danhmuctoidien',
  imports: [
         ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective,
          FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective,
           FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, 
           ButtonDirective,
    ReactiveFormsModule,FormsModule,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, 
    ModalBodyComponent, ModalFooterComponent, ButtonDirective,NgTemplateOutlet,
    RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent,
     TableDirective],
  templateUrl: './danhmuctoidien.component.html',
  styleUrl: './danhmuctoidien.component.scss'
})
export class DanhmuctoidienComponent implements OnInit {
  public liveDemoVisible = false;
  title: string = 'Thêm danh mục';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;

ngOnInit() {}
  toggleLiveDemo() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }
  onSubmit1() {
    this.customStylesValidated = true;
    alert('Thêm thành công');
    console.log('Submit... 1');
  }

  onReset1() {
    this.customStylesValidated = false;
    console.log('Reset... 1');
  }

  onSubmit2() {
    this.browserDefaultsValidated = true;
    console.log('Submit... 2');
  }

  onReset2() {
    this.browserDefaultsValidated = false;
    console.log('Reset... 3');
  }

  onSubmit3() {
    this.tooltipValidated = true;
    console.log('Submit... 3');
  }

  onReset3() {
    this.tooltipValidated = false;
    console.log('Reset... 3');
  }


  
}
