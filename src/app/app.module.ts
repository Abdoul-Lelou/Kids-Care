
import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule,MatRippleModule,MatTooltipModule,MatDatepickerModule,MatNativeDateModule,MatIconModule,MatCardModule,MatTableModule, MatSortModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxChartsModule }from '@swimlane/ngx-charts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { JwtModule } from "@auth0/angular-jwt";
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { FormConnexionComponent } from './components/form-connexion/form-connexion.component';
import { JwtInterceptor } from './helpers/jwt-interceptor.service';
import { UserComponent } from './pages/user/user.component';
import { AppointementComponent } from './pages/appointement/appointement.component';
import { PatientComponent } from './pages/patient/patient.component';
import { PatientDataComponent } from './pages/patient-data/patient-data.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { HeaderComponent } from './pages/header/header.component';
import { OrdonnanceComponent } from './pages/ordonnance/ordonnance.component';
import { FileUploadModule } from 'ng2-file-upload';
// import { AuthServiceGuard } from "./services/auth.service.guard";
// import { AuthentificationService } from "./services/authentification.service";
// import { AuthServiceGuard } from "./app-routing.module/AuthServiceGuard";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TimeAppointComponent } from './components/time-appoint/time-appoint.component';
// import { TableBasicExampleComponent } from './patient/table/table-basic-example/table-basic-example.component';



// import {  } from "./services/";



@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    FormConnexionComponent,
    UserComponent,
    AppointementComponent,
    PatientComponent,
    PatientDataComponent,
    AccueilComponent,
    HeaderComponent,
    OrdonnanceComponent,
    TimeAppointComponent,
    // TableBasicExampleComponent,
  
  
   
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    BrowserAnimationsModule,
    MatSliderModule,
    Ng2SearchPipeModule,
    FormsModule,
    NgxPaginationModule,
    MatIconModule,
    MatDatepickerModule,       
    MatNativeDateModule, 
    NgxMaterialTimepickerModule,
    NgxChartsModule,
    RouterModule ,
    FileUploadModule,
    MatTableModule,
    MatSortModule
    

  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }