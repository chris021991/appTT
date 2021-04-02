import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss'],
})
export class PortfoliosComponent implements OnInit {

  @Input() users: User[] = [];

  constructor() { }

  ngOnInit() {
    console.log('Users portfolios ->', this.users);
  }

}
