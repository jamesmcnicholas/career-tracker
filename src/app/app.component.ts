import { Component, OnInit } from '@angular/core';
import { ParticlesConfig } from './progression/particles-config';

declare let particlesJS: any; // Required to be properly interpreted by TypeScript.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean-contactlist-angular2';
}