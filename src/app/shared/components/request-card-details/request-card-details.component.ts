import { NewsService } from 'src/app/core/http/news.service';
import { SupportObjectService } from '../../../core/http/support-object.service';
import { TransFormComponent } from './../trans-form/trans-form.component';
import { SupportTransService } from '../../../core/http/support-trans.service';
import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { FormsModule } from '@angular/forms';
import { SupportTypesService } from '../../../core/http/support-types.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ProposeRequestComponent } from './propose-request/propose-request.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-request-card-details',
  templateUrl: './request-card-details.component.html',
  styleUrls: ['./request-card-details.component.scss'],
})
export class RequestCardDetailsComponent implements OnInit {
  new_status: String = '';
  cur_status?: String = this.request.status;
  isOpen: boolean = false;
  status: string[] = ['verified', 'accepted', 'rejected'];
  supporters: any[];
  lastestComment: { content: string; postTime: string }[];
  mapPriority = new Map();
  mapStatus = new Map();
  news: INew[] = [];
  trans: ITransaction[] = [];
  supportObject: ISupport[] = [];
  defaultComment: INew = {
    subject: 'new_comment',
    content: '',
    target_type: 'sos_request',
    target_id: this.request.id,
  };
  onClose() {
    this.bottomRef.dismiss();
  }
  constructor(
    public bottomRef: MatBottomSheetRef<RequestCardDetailsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public request: ISOSRequest,
    public dialog: MatDialog,
    private SupportTransService: SupportTransService,
    private NewsService: NewsService,
    private SupportObjectService: SupportObjectService,
    private UrgentRequestService: UrgentRequestService
  ) {
    if (this.request.status === 'open') {
      this.isOpen = true;
    }
    this.supportObject = this.SupportObjectService.getSupportObjectByType(
      this.request.support_types!
    );
    this.initalize();
    this.fetchInit();
    this.lastestComment = [
      {
        content: 'Hôm nay đã gửi đến 200 giường bệnh, 1000 khẩu trang.',
        postTime: '10:30 AM . Hôm nay',
      },
      {
        content: 'Đã gửi đến 100 máy thở',
        postTime: '10:30 AM . Hôm nay',
      },
    ];

    this.supporters = [
      {
        contact_info: {
          phone_number: '12345679',
        },
        description: 'test123',
        name: 'Tuan',
        schedule_support_date: '2021-20-11',
        status: 'done',
      },
    ];
  }
  show(data: any) {
    let content = data.target.value;
    if (content)
      this.NewsService.create(
        { ...this.defaultComment, content: content },
        {}
      ).subscribe((res) => (this.news = [res, ...this.news]));
    data.target.value = '';
  }
  fetchInit() {
    this.SupportTransService.getRequestTrans(this.request.id).subscribe(
      (result) => (this.trans = result)
    );
    this.NewsService.getRequestNews(this.request.id).subscribe(
      (res) => (this.news = res)
    );
  }
  initalize() {
    this.mapPriority.set('high', 'Rất nguy cấp');
    this.mapPriority.set('normal', 'Nguy cấp');
    this.mapPriority.set('', 'Nguy cấp');
    this.mapStatus.set('', 'Đang chờ hỗ trợ');
    this.mapStatus.set('waiting', 'Đang chờ hỗ trợ');
    this.mapStatus.set('supporting', 'Đang được hỗ trợ');
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(JoinRequestComponent, {
      data: { request_id: this.request.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openProposeDialog(): void {
    const dialogRef = this.dialog.open(ProposeRequestComponent, {
      data: { request_id: this.request.id },
    });
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { request_id: this.request.id, status: this.request.status },
    });
  }
  setStatus(status: string): void {
    this.new_status = status;
  }
  confirmStatus(): void {
    this.UrgentRequestService.verifyRequest(this.request.id, {
      status: this.new_status,
    }).subscribe();
    this.cur_status = this.new_status;
    this.isOpen = false;
  }
  openTransDialog(): void {
    const dialogRef = this.dialog.open(TransFormComponent, {
      data: {
        supportObject: this.supportObject,
        request_id: this.request.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) this.trans.push(result);
    });
  }

  length = 0;
  pageSize = 1;

  // MatPaginator Output
  pageEvent: PageEvent = new PageEvent();

  ngOnInit(): void {
    this.length = this.request?.medias?.length!;
    this.pageEvent!.pageIndex = 0;
  }
}
@Component({
  selector: 'join',
  templateUrl: './joinForm.html',
  providers: [MatFormFieldModule, FormsModule],
})
export class JoinRequestComponent {
  supportTypes: ISupportType[] = [];
  joinRequest: IJoinRequest = {
    type: 'user',
    supporter_id: '',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JoinRequestComponent>,
    private SupportTypesService: SupportTypesService,
    private UrgentRequestService: UrgentRequestService,
    private storageService: StorageService
  ) {
    this.SupportTypesService.findAll().subscribe(
      (result) => (this.supportTypes = result)
    );
  }
  async onSubmit(data: any) {
    console.log(data);
    this.joinRequest.description = data.description;
    this.joinRequest.support_date = data.support_date;
    // this.joinRequest.supporter_id = this.storageService.userInfo.id;
    console.log(this.joinRequest);
    // this.UrgentRequestService.join(
    //   this.data.request_id,
    //   this.joinRequest
    // ).subscribe();
    // this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
