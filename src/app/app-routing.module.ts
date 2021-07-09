import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { PatientComponent } from './pages/patient/patient.component';
import { UserComponent } from './pages/user/user.component';
import { PatientDataComponent } from './pages/patient-data/patient-data.component';
import { AppointementComponent } from './pages/appointement/appointement.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdonnanceComponent } from './pages/ordonnance/ordonnance.component';



const routes: Routes = [
  {path:'',component:ConnexionComponent},
  {path:'patient',component:PatientComponent,data: { animation: 'patient' }},
  {path:'folder',component:PatientDataComponent,data: { animation: 'folder' }},
  {path:'home',component:AccueilComponent,data: { animation: 'home' }},
  {path:'ordonnance',component:OrdonnanceComponent,data: { animation: 'ordonnance' }},
  {path:'user',component:UserComponent,data: { animation: 'user' }},
  {path:'appoint',component:AppointementComponent,data: { animation: 'appoint' }},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }