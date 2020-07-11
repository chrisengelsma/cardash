import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-window-display',
  templateUrl: './window-display.component.html',
  styleUrls: [ './window-display.component.scss' ]
})
export class WindowDisplayComponent implements OnInit {

  @Input() relevantKeys: { key: string, default_: any }[];

  showOnlyRelevant: boolean = true;

  constructor() { }

  get printWindow(): string {
    if (this.showOnlyRelevant) {
      const result = {};
      for (const key of this.relevantKeys) { result[key.key] = window[key.key]; }
      return JSON.stringify(result, null, 2);
    } else {
      const cache = [];
      return JSON.stringify(window, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.includes(value)) { return; }
          cache.push(value);
        }
        return value;
      }, 2);
    }
  }

  ngOnInit(): void {
  }

}
