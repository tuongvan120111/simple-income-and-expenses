import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/budget-builder/budget-builder.component').then(
        (m) => m.BudgetBuilderComponent
      ),
  },
];
