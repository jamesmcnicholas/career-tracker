import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../common/guards/auth.guard';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  username = "";
  authGuard: AuthGuard;
  scroller;

  constructor(authGuard: AuthGuard, scroller: ViewportScroller) { 
    this.authGuard = authGuard;
    this.username = authGuard.username
    this.scroller = scroller;
  }

  ngOnInit(): void {
    this.username = this.authGuard.username;
  }

  scroll(element){
    this.scroller.scrollToAnchor(element);
  }

  logout(){
    this.authGuard.logout();
  }

  

}
