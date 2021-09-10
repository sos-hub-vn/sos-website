import { StorageService } from './../../../core/services/storage.service';
import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
})
export class RequestCardComponent implements OnInit {
  @Input() request?: ISOSRequest;
  @Input() type?: String;
  user: any;
  mapPriority = new Map();
  mapStatus = new Map();
  constructor(private UrgentRequestService: UrgentRequestService, private StorageService: StorageService) {
  }
  mark($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
    this.UrgentRequestService.markRequest(this.request?.id,
      { bookmarker_type: 'user', action: 'bookmark', bookmarker_id: this.user.id })
      .subscribe((res) => {
        console.log(res);
      })
  }
  ngOnInit(): void {
    this.mapPriority.set('high', 'Rất nguy cấp');
    this.mapPriority.set('normal', 'Nguy cấp');
    this.mapPriority.set('', 'Nguy cấp');
    this.mapStatus.set('', 'Đang chờ hỗ trợ');
    this.mapStatus.set('waiting', 'Đang chờ hỗ trợ');
    this.mapStatus.set('supporting', 'Đang được hỗ trợ');
    this.user = this.StorageService.userInfo;
  }
}
