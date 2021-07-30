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
import { PhotoComponent } from './photo/photo.component';
import { PackagesComponent } from './packages/packages.component';
import { PackageComponent } from './package/package.component';
import { NewPackageComponent } from './package/new-package/new-package.component';
import { GenresSelectedComponent } from './genres-selected/genres-selected.component';
import { NewCollectionComponent } from './collection/new-collection/new-collection.component';
import { PhotoSliderComponent } from './photo-slider/photo-slider.component';

@NgModule({
  declarations: [
    AvatarSelectorComponent,
    CollectionComponent,
    CollectionsComponent,
    AccountComponent,
    AccountsComponent,
    PhotoPortfolioComponent,
    PhotoComponent,
    PackageComponent,
    PackagesComponent,
    NewPackageComponent,
    GenresSelectedComponent,
    NewCollectionComponent,
    PhotoSliderComponent],
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
    AccountsComponent,
    PhotoComponent,
    PackagesComponent,
    NewPackageComponent,
    NewCollectionComponent]
})
export class ComponentsModule { }
