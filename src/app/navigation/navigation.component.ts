import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../common/guards/auth.guard';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  username = "";
  authGuard;

  constructor(authGuard: AuthGuard) { 
    this.authGuard = authGuard;
    this.username = authGuard.username}

  ngOnInit(): void {
    this.username = this.authGuard.username;
  }

}
