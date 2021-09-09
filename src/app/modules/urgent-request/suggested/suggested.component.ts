import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'suggested-request',
  templateUrl: './suggested.component.html',
  styleUrls: ['./suggested.component.scss']
})
export class SuggestedComponent implements OnInit {
  groupSuggested: ISOSRequest[] = [];
  @Input() groups: any[] = []
  constructor(private UrgentRequestService: UrgentRequestService) { }

  ngOnInit(): void {
    this.fetchInit();
    console.log("Init");
  }
  fetchInit() {

    this.groups.forEach((group: any) => {
      this.UrgentRequestService.getJoinedRequests(group.id).subscribe((result) => {
        this.groupSuggested = [...this.groupSuggested, ...result]
        console.log(result);
      });
    });
  }

}
