import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {LeadFormComponent} from './lead-form/lead-form.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [HeaderComponent, FooterComponent, LeadFormComponent],
    exports: [HeaderComponent, FooterComponent, LeadFormComponent]
})
export class SharedModule {
}
