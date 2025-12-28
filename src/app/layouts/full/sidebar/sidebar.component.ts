import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  isAdmin: boolean = false;
  tokenPayload: any;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.tokenPayload = jwtDecode(token);
        this.isAdmin = this.tokenPayload.role === 'admin';
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

