import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./session/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./session/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./session/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path:  'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'schedule',
        loadComponent: () =>
          import('./schedule/schedule.page').then((m) => m.SchedulePage),
      },
      {
        path: 'songs',
        loadComponent: () =>
          import('./songs/songs.page').then((m) => m.SongsPage),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('./tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then( m => m.HomePage)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
