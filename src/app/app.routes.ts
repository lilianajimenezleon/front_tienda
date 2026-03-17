import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { SystemAdminGuard } from './core/guards/system-admin.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { AdminLayoutComponent } from './shared/admin-layout/admin-layout.component';
import { ProductosComponent } from './features/productos/productos.component';
import { ProductFormComponent } from './features/inventory/product-form/product-form.component';
import { VentasComponent } from './features/ventas/ventas.component';
import { VentaFormComponent } from './features/ventas/venta-form.component';
import { ComprasComponent } from './features/compras/compras.component';
import { CompraFormComponent } from './features/compras/compra-form.component';
import { ReportesComponent } from './features/reportes/reportes.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminUsersComponent } from './features/admin/admin-users.component';
import { AdminUserFormComponent } from './features/admin/admin-user-form.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [SystemAdminGuard],
        children: [
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'usuarios', component: AdminUsersComponent },
            { path: 'usuarios/nuevo', component: AdminUserFormComponent },
            { path: 'usuarios/:id', component: AdminUserFormComponent },
            { path: 'tiendas', loadComponent: () => import('./features/admin/admin-tiendas.component').then(m => m.AdminTiendasComponent) },
            { path: 'tiendas/nueva', loadComponent: () => import('./features/admin/admin-tienda-form.component').then(m => m.AdminTiendaFormComponent) },
            { path: 'tiendas/:id', loadComponent: () => import('./features/admin/admin-tienda-form.component').then(m => m.AdminTiendaFormComponent) },
            { path: 'productos', loadComponent: () => import('./features/admin/admin-productos.component').then(m => m.AdminProductosComponent) },
            { path: 'reportes', loadComponent: () => import('./features/admin/admin-reportes.component').then(m => m.AdminReportesComponent) },
            { path: 'categorias', loadComponent: () => import('./features/admin/admin-categorias.component').then(m => m.AdminCategoriasComponent) },
            { path: 'proveedores', loadComponent: () => import('./features/admin/admin-proveedores.component').then(m => m.AdminProveedoresComponent) },
            { path: 'ventas', loadComponent: () => import('./features/admin/admin-ventas.component').then(m => m.AdminVentasComponent) },
            { path: 'compras', loadComponent: () => import('./features/admin/admin-compras.component').then(m => m.AdminComprasComponent) },
            { path: 'mermas', loadComponent: () => import('./features/admin/admin-mermas.component').then(m => m.AdminMermasComponent) },
            { path: 'cambiar-password', component: ChangePasswordComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'reportes', component: ReportesComponent },
            { path: 'productos', component: ProductosComponent },
            { path: 'productos/nuevo', component: ProductFormComponent },
            { path: 'productos/:id', component: ProductFormComponent },
            { path: 'ventas', component: VentasComponent },
            { path: 'ventas/nueva', component: VentaFormComponent },
            { path: 'ventas/:id', component: VentaFormComponent },
            { path: 'compras', component: ComprasComponent },
            { path: 'compras/nueva', component: CompraFormComponent },
            { path: 'compras/:id', component: CompraFormComponent },
            { path: 'cambiar-password', component: ChangePasswordComponent },
            { path: '', redirectTo: 'reportes', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];
