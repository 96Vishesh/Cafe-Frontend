import { Component, OnInit } from '@angular/core';
import { DashoboardService } from '../services/dashoboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { jwtDecode } from 'jwt-decode';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	responseMessage: string = '';
	data: any;
	isAdmin: boolean = false;

	constructor(
		private dashboardService: DashoboardService,
		private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService
	) { }

	ngOnInit(): void {
		this.checkRole();
		this.getDashboardData();
	}

	checkRole() {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const tokenPayload: any = jwtDecode(token);
				this.isAdmin = tokenPayload.role === 'admin';
			} catch (error) {
				console.error('Error decoding token:', error);
			}
		}
	}

	getDashboardData() {
		this.ngxService.start();
		this.dashboardService.getDetails().subscribe(
			(response: any) => {
				this.ngxService.stop();
				this.data = response;
			},
			(error: any) => {
				this.ngxService.stop();
				console.log(error);
				if (error.error?.message) {
					this.responseMessage = error.error?.message;
				} else {
					this.responseMessage = GlobalConstants.genericError;
				}
				this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
			}
		);
	}
}
