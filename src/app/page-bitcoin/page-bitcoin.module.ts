import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBitcoinRoutingModule } from './page-bitcoin-routing.module';
import { PageBitcoinComponent } from './page-bitcoin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PageBitcoinRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [PageBitcoinComponent]
})
export class PageBitcoinModule { }
