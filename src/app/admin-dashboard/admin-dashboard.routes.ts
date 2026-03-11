import { defaultUrlMatcher, Routes } from "@angular/router";
import { AdminLayout } from "./layouts/admin-layout/admin-layout";
import { ProductAdminPage } from "./pages/product-admin-page/product-admin-page";
import { ProductsAdminPage } from "./pages/products-admin-page/products-admin-page";
import { IsAdminGuard } from "../auth/guards/is-admin.guard";



export const adminDashboardRoutes: Routes =[
    {
        path: '', 
        component: AdminLayout,
        canMatch:[
            IsAdminGuard
        ],
        children:[
            {
                path: 'products', 
                component: ProductsAdminPage, 
            }, 
            {
                path: 'products/:id',
                component: ProductAdminPage
            },
            {
                path:'**',
                redirectTo: 'products'
            }
        ]
    }
]

export default  adminDashboardRoutes; 