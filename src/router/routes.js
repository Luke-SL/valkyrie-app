const routes = [
  // Rota Pública (Login)
  {
    path: '/login',
    name: 'login',
    component: () => import('/src/pages/LoginPage.vue')
  },

  // Rotas Protegidas (Dentro do sistema)
  {
    path: '/',
    component: () => import('/src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('/src/pages/DashboardPage.vue')
      },
      {
        path: 'rooms',
        name: 'rooms',
        component: () => import('/src/pages/RoomsPage.vue')
      },
      {
        path: 'rooms/:id',
        name: 'room-details',
        component: () => import('/src/pages/RoomDetailsPage.vue')
      },
      {
        path: 'assets',
        name: 'assets',
        component: () => import('/src/pages/AssetsPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('/src/pages/ErrorNotFound.vue')
  }
]

export default routes
