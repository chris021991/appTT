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
import { PhotoComponent } from './photo/photo.component';
import { NewPackageComponent } from './package/new-package/new-package.component';
import { EditPackageComponent } from './package/edit-package/edit-package.component';
import { OpenPackageComponent } from './package/open-package/open-package.component';



@NgModule({
  declarations: [
    AvatarSelectorComponent,
    CollectionComponent,
    CollectionsComponent,
    AccountComponent,
    AccountsComponent,
    PhotoPortfolioComponent,
    PhotoCoverpageComponent,
    PhotoProfileComponent,
    PhotoComponent,
    NewPackageComponent,
    EditPackageComponent,
    OpenPackageComponent],
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
    NewPackageComponent,
    EditPackageComponent,
    OpenPackageComponent]
})
export class ComponentsModule { }
