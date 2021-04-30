import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoChangesPage } from './photo-changes.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoChangesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoChangesPageRoutingModule {}
