import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'joined-request',
  templateUrl: './joined.component.html',
  styleUrls: ['./joined.component.scss']
})
export class JoinedComponent implements OnInit {
  joinedRequests: ISOSRequest[] = [];
  @Input() user_id: string = ''
  constructor(private UrgentRequestService: UrgentRequestService) { }

  ngOnInit(): void {
    this.fetchInit();
  }
  fetchInit() {

    this.UrgentRequestService.getJoinedRequests(this.user_id).subscribe((result) => {
      this.joinedRequests = result;
      console.log(result);
    });
  }

}
