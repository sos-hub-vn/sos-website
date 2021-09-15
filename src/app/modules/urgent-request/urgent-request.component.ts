import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/core/services/storage.service';
import { RequesterObjectStatusService } from '../../core/http/requester-object-status.service';
import { SupportTypesService } from '../../core/http/support-types.service';
import { RequestCardDetailsComponent } from './../../shared/components/request-card-details/request-card-details.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { VolunteerGroupService } from '../../core/http/volunteer-group.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UsersService } from 'src/app/core/http/users.service';

@Component({
  selector: 'app-urgent-request',
  templateUrl: './urgent-request.component.html',
  styleUrls: ['./urgent-request.component.scss'],
})
export class UrgentRequestComponent implements OnInit,OnDestroy {
  requests: ISOSRequest[] = [];
  user: any;
  mobileScreen: string = "MAP";
  userSubcription:Subscription | undefined
  constructor(
    private StorageService: StorageService,
    private userService: UsersService
  ) {
    console.log("constructor");
  }
  ngOnDestroy(): void {
   this.userSubcription?.unsubscribe();
  }

  toggleMap() {
    if (this.mobileScreen === 'MAP') this.mobileScreen = "REQUESTS"; else this.mobileScreen = 'MAP'
  }
  ngOnInit(): void {
    this.user = this.StorageService.userInfo;
    this.userSubcription=this.userService.userSubject.subscribe(user => this.user = user)
    console.log(this.user);
  }
}
