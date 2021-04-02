import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {

  @Input() user: User = {};

  img1 = '/assets/perro-1.jpg';
  img2 = '/assets/perro-2.jpg';
  img3 = '/assets/perro-3.jpg';

  constructor() { }

  ngOnInit() {}

}
