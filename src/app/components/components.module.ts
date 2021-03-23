import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CollectionComponent } from './collection/collection.component';
import { CollectionsComponent } from './collections/collections.component';
import { PipesModule } from '../pipes/pipes.module';
import { OrderModule } from 'ngx-order-pipe';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';



@NgModule({
  declarations: [ 
    AvatarSelectorComponent, 
    CollectionComponent, 
    CollectionsComponent,
    ForgotPasswordComponent],
  imports: [ 
    CommonModule, 
    FormsModule, 
    IonicModule, 
    PipesModule,
    OrderModule
  ],
  exports: [
    AvatarSelectorComponent, 
    CollectionComponent, 
    CollectionsComponent,
    ForgotPasswordComponent]
})
export class ComponentsModule { }
