import { Component, OnInit, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-packages-component',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent implements OnInit {

  @Input() genre: any;
  @Input() packages: any;

  constructor() { }

  ngOnInit() {}

}
