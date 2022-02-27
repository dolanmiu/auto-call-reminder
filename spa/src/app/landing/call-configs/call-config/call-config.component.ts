import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-call-config',
  templateUrl: './call-config.component.html',
  styleUrls: ['./call-config.component.scss'],
})
export class CallConfigComponent {
  constructor(route: ActivatedRoute) {
    const callConfigUid = route.parent?.snapshot.paramMap.get(
      'callConfigUid'
    ) as string;
    console.log(callConfigUid);
  }
}
