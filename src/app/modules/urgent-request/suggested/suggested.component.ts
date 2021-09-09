import { UrgentRequestService } from 'src/app/core/http/urgent-request.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'suggested-request',
  templateUrl: './suggested.component.html',
  styleUrls: ['./suggested.component.scss']
})
export class SuggestedComponent implements OnInit {
  groupSuggested: ISOSRequest[] = [];
  @Input() groups: any[] = [];

  constructor(private UrgentRequestService: UrgentRequestService) { }

  params: IQueryPrams[] = []
  paramsInit() {
    for (var i = 1; i <= this.groups.length; i++) this.params.push({ limit: 10, offset: 0 })
  }
  updateParams(index: number, returnNumber: number) {
    if (returnNumber < 10) this.params[index].limit = 0; else
      this.params[index].offset! += 10;
  }

  ngOnInit(): void {
    this.paramsInit();
    this.load();
  }
  load() {
    this.groups.forEach((group: any, index) => {
      if (this.params[index].limit != 0)
        this.UrgentRequestService.getGroupSuggested(group.id, this.params[index]).subscribe((result) => {
          this.groupSuggested = [...this.groupSuggested, ...result]
          this.updateParams(index, result.length);
          console.log(result);
        });
    });
  }
}
