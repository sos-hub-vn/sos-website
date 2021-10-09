import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/core/http/group.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';
import { ConstantsService } from 'src/app/shared/constant/constants.service';
import { LocationService } from 'src/app/shared/subjects/location.service';

@Component({
  selector: 'app-clinic-container',
  templateUrl: './clinic-container.component.html',
  styleUrls: ['./clinic-container.component.scss']
})
export class ClinicContainerComponent implements OnInit, OnDestroy {

  @Input() clinics?: IGroup[];
  @Input() set locationPicked(latlg: google.maps.LatLng | undefined) {
    if (latlg) {
      this.setLocation({ lat: latlg.lat(), lng: latlg.lng() });
      this.search();
    }
  };
  @Output() clinicsChange = new EventEmitter<IGroup[]>();
  @Output() isMapPicked = new EventEmitter<boolean>();
  _isPicked = false;
  isLoading = false;
  session: string;
  statuses: IRequestStatus[] = [];
  distanceOpt: number[] = [1, 2, 5, 10, 20, 50, 100];
  LIMIT = 20;
  filterObject: IRequestFilter = {
    lat_position: 0,
    long_position: 0,
    distance: 10,
    priority_type: [],
    keyword: '',
    object_status: [],
    status: [],
    support_types: [],
    verify_status: ''
  };
  queryObject: any = {};
  subscription: Subscription | undefined
  subscriptionLocation: Subscription | undefined
  constructor(public dialog: MatDialog,
    private groupService: GroupService,
    private storageService: StorageService,
    private notification: NotificationService,
    private constantsService: ConstantsService,
    private locationService: LocationService,
  ) {
    this.statuses = this.constantsService.STATUS_LIST
    this.session = this.constantsService.SESSION.DEFAULT
    this.fetchInit();
  }

  params: IQueryPrams = {}
  paramsInit() {
    this.params = { limit: this.LIMIT, offset: 0 }
  }
  updateParams(returnNumber: number) {
    if (returnNumber < this.LIMIT) this.params.limit = 0; else
      this.params.offset! += this.LIMIT;
  }
  selectPriority(type: string, $event: any) {
    this.select($event);
    const index: number = this.filterObject.priority_type?.indexOf(type)!;

    if (index != -1 && index != undefined)
      this.filterObject.priority_type?.splice(index, 1);
    else this.filterObject.priority_type?.push(type);
    console.log(this.filterObject.priority_type!);
    this.search();
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
    this.search();
  }
  selectStatus(type: string, $event: any) {
    this.select($event);
    const index: number = this.filterObject.status?.indexOf(type)!;

    if (index != -1 && index != undefined)
      this.filterObject.status?.splice(index, 1);
    else this.filterObject.status?.push(type);
    console.log(this.filterObject.status!);
    this.search();
  }
  selectObject(type: string, $event: any) {
    this.select($event);
    const index: number = this.filterObject.object_status?.indexOf(type)!;

    if (index != -1 && index != undefined)
      this.filterObject.object_status?.splice(index, 1);
    else this.filterObject.object_status?.push(type);
    console.log(this.filterObject.object_status!);
    this.search();
  }
  selectDistance(dis: number) {
    this.filterObject.distance = dis;
    this.search();
  }
  clearKey() {
    this.filterObject.keyword = ""
  }
  setKey($event: any) {
    console.log($event.target.value);
    this.filterObject.keyword = $event.target.value;
    this.search();
  }
  search(isReload?: boolean) {

    this.clinics = [];

    if (this.filterObject.status?.find(e => e === 'verified')) {
      this.filterObject.status = this.filterObject.status.filter(e => e != 'verified')
      this.filterObject = { ...this.filterObject, verify_status: 'verified' }
    }


    this.queryObject = {
      ...this.filterObject,
      status: this.filterObject.status?.toString(),
      object_status: this.filterObject.object_status?.toString(),
      support_types: this.filterObject.support_types?.toString(),
      priority_type: this.filterObject.priority_type?.toString(),
    };
    this.paramsInit();

    this.load(isReload);
  }
  load(isReload?: boolean) {
    if (this.params.limit != 0)
      this.groupService.search(this.queryObject, this.params).subscribe((result) => {
        if (this.params.offset != 0 && !isReload) this.clinics = [...this.clinics!, ...result.groups];
        else this.clinics = result.groups;
        this.clinicsChange.emit(this.clinics);
        console.log(this.params.offset)
        this.updateParams(result.total);
        console.log(this.clinics)
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
  }

  // openCreateForm(): void {
  //   const dialogRef = this.dialog.open(RequestFormComponent, {
  //     width: 'auto',
  //     data: {},
  //     disableClose: true,
  //     maxWidth: '100vw'
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (!result) {
  //       return
  //     }
  //     this.requests = this.requests ? [result, ...this.requests] : [result]
  //   });
  // }
  setLocation(data: any) {
    this.filterObject.lat_position = data.lat?.toString();
    this.filterObject.long_position = data.lng?.toString();
  }
  ngOnInit(): void {
    console.log("INITTT")
    this.setLocation(this.storageService.location)
    this.search(true);
    // this.locationService.updateLocation();
    console.log(this.storageService.location)
    this.subscription = this.storageService.locationSubject.subscribe({
      next: (location: ILocation) => {
        console.log("location change")
        this.setLocation(location); console.log("location", location); this.search(true)
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionLocation?.unsubscribe();
  }

  selectLocation() {
    this._isPicked = !this._isPicked
    if (this._isPicked) {
      this.notification.info("Hãy kéo biểu tượng đánh dấu tới nơi bạn muốn tìm kiếm")
    }
    this.isMapPicked.emit(this._isPicked)
  }
}
