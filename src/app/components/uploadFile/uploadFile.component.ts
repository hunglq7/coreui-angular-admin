import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadChangeParam,
  NzUploadModule,
  NzUploadFile,
} from 'ng-zorro-antd/upload';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  imports: [NzButtonModule, NzIconModule, NzUploadModule],
  template: `
    <nz-upload
      nzType="drag"
      [nzMultiple]="true"
      nzAction="http://thietbi.thanmongduong.vn:5005/api/UploadThietbi"
      nzListType="picture"
      (nzChange)="handleChange($event)"
    >
      <p class="ant-upload-drag-icon">
        <nz-icon nzType="inbox" />
      </p>
      <p class="ant-upload-text">
        Nhấp hoặc kéo tệp vào khu vực này để tải lên
      </p>
      <p class="ant-upload-hint">Hỗ trợ tải lên một lần hoặc hàng loạt</p>
    </nz-upload>
  `,
})
export class UploadFileComponent {
  @Input() pathFile: string = '';
  @Output() onUploadPath = new EventEmitter<any>();

  baseUrl: string = environment.BASE_API;
  http: HttpClient = inject(HttpClient);
  constructor(private messageService: NzMessageService) {}

  handleChange({ file }: NzUploadChangeParam): void {
    const status = file.status;
    if (status === 'done') {
      let fileToUpload = file;
      const formData = new FormData();
      if (fileToUpload.originFileObj) {
        formData.append('file', fileToUpload.originFileObj, fileToUpload.name);
        this.http
          .post(`${this.baseUrl}${this.pathFile}`, formData, {
            reportProgress: true,
            observe: 'events',
          })
          .subscribe({
            next: (data: any) => {
              this.onUploadPath.emit(data.body);
            },
            error: (err) => {
              console.log(err);
            },
          });
        this.messageService.success(`${file.name} đã tải lên thành công.`);
      } else {
        this.messageService.error(`${file.name} không thể xử lý file.`);
      }
    } else if (status === 'error') {
      this.messageService.error(`${file.name} tải lên thất bại.`);
    }
  }
}
