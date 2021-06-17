import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../common/guards/auth.guard';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  username = "";


  constructor(authGuard: AuthGuard) { this.username = authGuard.username}

  ngOnInit(): void {
  }

}
