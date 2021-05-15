import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProgressionComponent } from './progression/progression.component';
import { LevelsComponent } from './progression/levels/levels.component';
import { StreamsComponent } from './progression/streams/streams.component';
import { TasksComponent } from './progression/tasks/tasks.component';
import { TaskService } from './progression/tasks/task.service';
import { StreamService } from './progression/streams/stream.service';
import { ProgressionService } from './progression/progression.service';
import { UserTasksComponent } from './progression/tasks/user-tasks/user-tasks.component';
import { PdpComponent } from './progression/pdp/pdp.component';
import { LinksComponent } from './progression/links/links.component';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080/auth',
        realm: 'master',
        clientId: 'mean-app-local',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}


@NgModule({
  declarations: [
    AppComponent,
    ProgressionComponent,
    LevelsComponent,
    StreamsComponent,
    TasksComponent,
    UserTasksComponent,
    PdpComponent,
    LinksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    TaskService, StreamService, ProgressionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
