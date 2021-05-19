import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {

  @Input() users: User[] = [];
  @Input() page = '';
  @Input() textSearch = '';

  constructor() { }

  ngOnInit() {}

}
