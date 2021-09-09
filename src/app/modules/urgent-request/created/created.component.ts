import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'created-request',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.scss']
})
export class CreatedComponent implements OnInit {
  userCreatedRequests: ISOSRequest[] = [];
  @Input() user_id: string = ''
  constructor(private UrgentRequestService: UrgentRequestService) { }

  ngOnInit(): void {
    this.fetchInit();
  }
  fetchInit() {
    this.UrgentRequestService.getByRequesterId(this.user_id).subscribe((result) => {
      this.userCreatedRequests = result;
      console.log(result);
    });
  }
}
