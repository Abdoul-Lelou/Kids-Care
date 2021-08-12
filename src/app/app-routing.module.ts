import { TimeAppointComponent } from './components/time-appoint/time-appoint.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { PatientComponent } from './pages/patient/patient.component';
import { UserComponent } from './pages/user/user.component';
import { PatientDataComponent } from './pages/patient-data/patient-data.component';
import { AppointementComponent } from './pages/appointement/appointement.component';
import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OrdonnanceComponent } from './pages/ordonnance/ordonnance.component';
 
import { Observable } from 'rxjs';
import { AuthentificationService } from './services/authentification.service';


@Injectable({
  providedIn: 'root'
})


export class AuthServiceGuard implements CanActivate {

  private constructor(private auth: AuthentificationService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

   
    if (this.auth.getLoggedIn()) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

}

const routes: Routes = [

  {path:'',component:ConnexionComponent},
  {path:'patient',component:PatientComponent,data: { animation: 'patient' }, canActivate:[AuthServiceGuard]},
  {path:'folder',component:PatientDataComponent,data: { animation: 'folder' }, canActivate:[AuthServiceGuard]},
  {path:'home',component:AccueilComponent,data: { animation: 'home' }, canActivate:[AuthServiceGuard]},
  {path:'ordonnance',component:OrdonnanceComponent,data: { animation: 'ordonnance' }, canActivate:[AuthServiceGuard]},
  {path:'user',component:UserComponent,data: { animation: 'user' }, canActivate:[AuthServiceGuard]},
  {path:'appoint',component:AppointementComponent,data: { animation: 'appoint' }, canActivate:[AuthServiceGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }