import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import "bootstrap";
import "popper.js";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { ContainerComponent } from './container/container.component';
import {SharedModule} from './shared/shared.module';
import {HomeComponent} from './home/home.component';

@NgModule({
  declarations: [
      AppComponent,
      ContainerComponent,
      HomeComponent
  ],
  imports: [
      FormsModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      SharedModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {}
