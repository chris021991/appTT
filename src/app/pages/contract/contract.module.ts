import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractPageRoutingModule } from './contract-routing.module';

import { ContractPage } from './contract.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractPageRoutingModule
  ],
  declarations: [ContractPage]
})
export class ContractPageModule {}
