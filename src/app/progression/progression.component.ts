import { Component, Injectable, OnInit } from '@angular/core';
import { AuthGuard } from '../common/guards/auth.guard';
import { ParticlesConfig } from './particles-config';

declare let particlesJS: any; // Required to be properly interpreted by TypeScript.
@Component({
  selector: 'progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.css']
})

@Injectable()
export class ProgressionComponent implements OnInit {

  
  edit: boolean = false;
  username: string
  administrator: boolean;

  constructor(authGuard: AuthGuard) {
      this.username = authGuard.username;
      var roles = authGuard.roles;
      var admin = roles.find(role => role == 'career-tracker-administrator')
      this.administrator = admin ? true : false;
   }

  public ngOnInit(): void {
    this.invokeParticles();
  }

  public invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function() {});
  }

}
