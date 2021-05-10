import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: 'app',
    component: DashboardPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home-container/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'portfolio',
            loadChildren: () => import('../home-container/portfolio/portfolio.module').then(m => m.PortfolioPageModule)
          },
          {
            path: 'photo',
            loadChildren: () => import('../home-container/photo/photo.module').then(m => m.PhotoPageModule)
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
          }
        ]
      },
      {
        path: 'gallery',
        children: [
          {
            path: '',
            loadChildren: () => import('../gallery/gallery.module').then(m => m.GalleryPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
          },
          {
            path: 'profile',
            loadChildren: () => import('../profile-container/profile/profile.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'genres',
            children: [
              {
                path: '',
                loadChildren: () => import('../profile-container/genres/genres.module').then(m => m.GenresPageModule)
              },
              {
                path: 'packages',
                loadChildren: () => import('../profile-container/packages/packages.module').then(m => m.PackagesPageModule)
              }
            ]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
