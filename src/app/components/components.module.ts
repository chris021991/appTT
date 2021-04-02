import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CollectionComponent } from './collection/collection.component';
import { CollectionsComponent } from './collections/collections.component';
import { PipesModule } from '../pipes/pipes.module';
import { OrderModule } from 'ngx-order-pipe';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfoliosComponent } from './portfolios/portfolios.component';



@NgModule({
  declarations: [
    AvatarSelectorComponent,
    CollectionComponent,
    CollectionsComponent,
    PortfolioComponent,
    PortfoliosComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    OrderModule
  ],
  exports: [
    AvatarSelectorComponent,
    CollectionsComponent,
    PortfoliosComponent]
})
export class ComponentsModule { }
