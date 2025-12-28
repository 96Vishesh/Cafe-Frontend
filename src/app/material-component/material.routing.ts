import { Routes } from '@angular/router';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageBillComponent } from './manage-bill/manage-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

export const MaterialRoutes: Routes = [
    {
        path: 'category',
        component: ManageCategoryComponent
    },
    {
        path: 'product',
        component: ManageProductComponent
    },
    {
        path: 'order',
        component: ManageOrderComponent
    },
    {
        path: 'bill',
        component: ManageBillComponent
    },
    {
        path: 'user',
        component: ManageUserComponent
    }
];
