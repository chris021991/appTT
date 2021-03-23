import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'app',
    component: HomePage,
    children: [
      {
        path:'portfolio',
        children: [
          {
            path:'',
            loadChildren: () => import('../portfolio/portfolio.module').then(m => m.PortfolioPageModule)
          }
        ]
      },
      {
        path:'gallery',
        children: [
          {
            path:'',
            loadChildren: () => import('../gallery/gallery.module').then(m => m.GalleryPageModule)
          }
        ]
      },
      {
        path:'profile',
        children: [
          {
            path:'',
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/portfolio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/portfolio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
