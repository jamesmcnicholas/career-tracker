import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private readonly keycloak: KeycloakService) { }
  
  logOut(){
    this.keycloak.logout();
  }
  
  ngOnInit(): void {
  }

}
