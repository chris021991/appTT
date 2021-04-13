import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CollectionComponent } from './collection/collection.component';
import { CollectionsComponent } from './collections/collections.component';
import { PipesModule } from '../pipes/pipes.module';
import { OrderModule } from 'ngx-order-pipe';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountComponent } from './account/account.component';
import { PhotoPortfolioComponent } from './photo-portfolio/photo-portfolio.component';
import { PhotoCoverpageComponent } from './photo-coverpage/photo-coverpage.component';
import { PhotoProfileComponent } from './photo-profile/photo-profile.component';



@NgModule({
  declarations: [
    AvatarSelectorComponent,
    CollectionComponent,
    CollectionsComponent,
    AccountComponent,
    AccountsComponent,
    PhotoPortfolioComponent,
    PhotoCoverpageComponent,
    PhotoProfileComponent],
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
    AccountsComponent]
})
export class ComponentsModule { }
