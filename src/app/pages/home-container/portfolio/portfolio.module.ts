import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PortfolioPageRoutingModule } from './portfolio-routing.module';

import { PortfolioPage } from './portfolio.page';
import { PipesModule } from '../../../pipes/pipes.module';
import { GenresPageModule } from '../../profile-container/genres/genres.module';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PortfolioPageRoutingModule,
    PipesModule,
    GenresPageModule,
    OrderModule
  ],
  declarations: [PortfolioPage]
})
export class PortfolioPageModule {}
