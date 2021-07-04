import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public authenticated: boolean;
  public username: string;
  public roles;

  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    this.authenticated = await this.keycloak.isLoggedIn();

    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    } 

    await this.keycloak.loadUserProfile()

    this.username = await this.keycloak.getUsername();
    this.roles = await this.keycloak.getUserRoles();
    
    return this.authenticated;
  }

  async logout(){
    console.log("Run")
    this.keycloak.logout(
      window.location.origin
    );
  }
}
