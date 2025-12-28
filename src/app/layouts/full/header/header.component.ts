import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../../../material-component/dialog/change-password/change-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AppHeaderComponent {

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
