import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContainerComponent} from './container/container.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
    {
        path: '', component: ContainerComponent, children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: HomeComponent},
        ]
    },
    {path: 'btcrevolution', loadChildren: './page-bitcoin/page-bitcoin.module#PageBitcoinModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
