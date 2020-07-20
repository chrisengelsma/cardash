import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-window-display',
  templateUrl: './window-display.component.html',
  styleUrls: [ './window-display.component.scss' ]
})
export class WindowDisplayComponent implements OnInit {

  @Input() relevantKeys: { key: string, default_: any }[];

  constructor() { }

  get printWindow(): string {
    const result = {};
    for (const key of this.relevantKeys) { result[key.key] = window[key.key]; }
    return JSON.stringify(result, null, 2);
  }

  ngOnInit(): void {
  }

}
