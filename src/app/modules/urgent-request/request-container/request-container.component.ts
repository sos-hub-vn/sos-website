import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { RequesterObjectStatusService } from '../../../core/http/requester-object-status.service';
import { RequestStatusService } from '../../../core/http/request-status.service';
import { SupportTypesService } from '../../../core/http/support-types.service';
import { UrgentLevelService } from '../../../core/http/urgent-level.service';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'all-request-container',
  templateUrl: './request-container.component.html',
  styleUrls: ['./request-container.component.scss'],
})
export class RequestContainerComponent implements OnInit {
  @Input() requests?: ISOSRequest[];
  urgentLevels: IPriorityType[] = [];
  statuses: IRequestStatus[] = [];
  supportTypes: ISupportType[] = [];
  requesterObjectStatus: IRequesterObjectStatus[] = [];
  distanceOpt: number[] = [1, 2, 5, 10, 20, 50, 100];
  filterObject: IRequestFilter = {
    lat_position: 0,
    long_position: 0,
    distance: 10,
    priority_type: [],
    keyword: '',
    object_status: [],
    status: [],
    support_types: [],
  };
  constructor(
    private UrgentLevelService: UrgentLevelService,
    private UrgentRequestService: UrgentRequestService,
    private StorageService: StorageService,
    private SupportTypesService: SupportTypesService,
    private RequestStatusService: RequestStatusService,
    private RequesterObjectStatusService: RequesterObjectStatusService
  ) {
    this.statuses = RequestStatusService.getRequestStatus();
    this.urgentLevels = UrgentLevelService.getUrgentLevels();
    this.fetchInit();
  }
  selectPriority(type: string, $event: any) {
    this.select($event);
    const index: number = this.filterObject.priority_type?.indexOf(type)!;

    if (index != -1 && index != undefined)
      this.filterObject.priority_type?.splice(index, 1);
    else this.filterObject.priority_type?.push(type);
    console.log(this.filterObject.priority_type!);
  }
  searchClick(data: any) {
    this.filterObject.keyword = data.value;
    this.search();
  }
  selectSupportType(type: string, $event: any) {
    this.select($event);
    const index: number = this.filterObject.support_types?.indexOf(type)!;

    if (index != -1 && index != undefined)
      this.filterObject.support_types?.splice(index, 1);
    else this.filterObject.support_types?.push(type);
    console.log(this.filterObject.support_types!);
  }
  selectStatus(type: string, $event: any) {
    this.select($event);
    const index: number = this.filterObject.status?.indexOf(type)!;

    if (index != -1 && index != undefined)
      this.filterObject.status?.splice(index, 1);
    else this.filterObject.status?.push(type);
    console.log(this.filterObject.status!);
  }
  selectObject(type: string, $event: any) {
    this.select($event);
    const index: number = this.filterObject.object_status?.indexOf(type)!;

    if (index != -1 && index != undefined)
      this.filterObject.object_status?.splice(index, 1);
    else this.filterObject.object_status?.push(type);
    console.log(this.filterObject.object_status!);
  }
  selectDistance(dis: number) {
    this.filterObject.distance = dis;
  }
  setKey($event: any) {
    console.log($event.target.value);
    this.filterObject.keyword = $event.target.value;
    this.search();
  }
  search() {
    var obj = {
      ...this.filterObject,
      status: this.filterObject.status?.toString(),
      object_status: this.filterObject.object_status?.toString(),
      support_types: this.filterObject.support_types?.toString(),
      priority_type: this.filterObject.priority_type?.toString(),
    };
    this.UrgentRequestService.search(obj).subscribe((result) => {
      this.requests = result;
      console.log(result);
    });
  }

  select($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
    if ($event.target) {
      $event.target.classList.toggle('selected');
    }
  }
  fetchInit() {
    this.SupportTypesService.findAll().subscribe((result) => {
      this.supportTypes = result;
      console.log(result);
    });
    this.RequesterObjectStatusService.findAll().subscribe((result) => {
      this.requesterObjectStatus = result;
      console.log(result);
    });
  }
  color = {
    accent: 'accent',
    primary: 'primary',
    warn: 'warn',
    basic: 'basic',
  };
  icon = {
    home: 'home',
    menu: 'menu',
    favorite: 'favorite',
    sort: 'sort',
    filter: 'filter',
  };
  height = {
    small: '40',
    large: '50',
  };
  text = {
    createRequest: 'Tạo Yêu Cầu',
    filter: 'Bộ lọc',
  };

  ngOnInit(): void {
    console.log(this.requests);
    let data = this.StorageService.setLocation();
    this.filterObject.lat_position = data.lat?.toString();
    this.filterObject.long_position = data.lng?.toString();
  }
}
