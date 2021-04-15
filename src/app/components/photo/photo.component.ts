import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-photo-component',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit {

  @Input() image: string;

  constructor() { }

  ngOnInit() {}

  onClick() {}

}
