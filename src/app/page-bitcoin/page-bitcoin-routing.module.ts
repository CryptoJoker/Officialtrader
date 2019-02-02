import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageBitcoinComponent } from './page-bitcoin.component';

const routes: Routes = [
  {
    path: '',
    component: PageBitcoinComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageBitcoinRoutingModule { }
