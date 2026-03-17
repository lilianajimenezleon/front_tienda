import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/usuarios/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/tiendas/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'productos/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'ventas/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'compras/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
