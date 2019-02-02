import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageLandingComponent } from './page-landing.component';

const routes: Routes = [
  {
    path: '',
    component: PageLandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageLandingRoutingModule { }