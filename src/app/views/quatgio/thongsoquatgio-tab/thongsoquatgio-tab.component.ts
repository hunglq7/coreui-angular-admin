import { Component, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-thongsoquatgio-tab',
  imports: [],
  templateUrl: './thongsoquatgio-tab.component.html',
  styleUrl: './thongsoquatgio-tab.component.scss',
})
export class ThongsoquatgioTabComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
