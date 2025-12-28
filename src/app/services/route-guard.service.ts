import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
    providedIn: 'root'
})
export class RouteGuardService {

    constructor(
        public router: Router,
        private snackbarService: SnackbarService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRoleArray = route.data;
        const token: any = localStorage.getItem('token');
        let expectedRole = '';

        if (!token) {
            this.router.navigate(['/']);
            return false;
        }

        try {
            const tokenPayload: any = jwtDecode(token);
            expectedRole = tokenPayload.role;
        } catch (error) {
            localStorage.clear();
            this.router.navigate(['/']);
            this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
            return false;
        }

        if (expectedRoleArray.expectedRole.indexOf(expectedRole) === -1) {
            this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
            this.router.navigate(['/cafe/dashboard']);
            return false;
        }

        return true;
    }
}
