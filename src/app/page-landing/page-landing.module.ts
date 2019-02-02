import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLandingRoutingModule } from './page-landing-routing.module';
import { PageLandingComponent } from './page-landing.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    PageLandingRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [PageLandingComponent]
})
export class PageLandingModule { }
