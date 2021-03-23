import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { PipesModule } from './pipes/pipes.module';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
                  AppComponent
                ],
  entryComponents: [],
  imports: [
            BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFireAuthModule,
            AngularFirestoreModule,
            PipesModule,
            OrderModule
           ],
  providers: [
              { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
             ],
  bootstrap: [AppComponent],
})
export class AppModule {}
