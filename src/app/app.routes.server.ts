import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//   {
//     path: '**',
//     renderMode: RenderMode.Prerender
//   }
// ];

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'gender/:gender',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { gender: 'men' },
        { gender: 'women' },
        { gender: 'kids' },
      ];
    },
  },
  {
    path: 'admin/products/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];