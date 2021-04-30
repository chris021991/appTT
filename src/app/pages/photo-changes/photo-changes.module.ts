import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoChangesPageRoutingModule } from './photo-changes-routing.module';

import { PhotoChangesPage } from './photo-changes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoChangesPageRoutingModule
  ],
  declarations: [PhotoChangesPage]
})
export class PhotoChangesPageModule {}
