import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractViewPageRoutingModule } from './contract-view-routing.module';

import { ContractViewPage } from './contract-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractViewPageRoutingModule
  ],
  declarations: [ContractViewPage]
})
export class ContractViewPageModule {}
