import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from './../../services/authentification.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NavigationStart,Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations:[
    trigger('slideOut', [
      transition(':enter', [
        style({transform: 'translateY(+100%)'}),
        animate('800ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {

  show_admin: boolean= false; show_medecin: boolean= false; show_secretaire: boolean= false; formConnexion:FormGroup;
  erreur;  showModal: boolean;  registerForm: FormGroup;  submitted = false;  role_admin: boolean = false;
  show_user: boolean;  add_patient: boolean;   patient_data: boolean;   appoint: boolean ;      user; $:any;
  roleUserLogin;
  constructor(private auth: AuthentificationService,private formBuilder: FormBuilder,private router: Router) {
  
        router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          if (event.url === '/add_patient') {
            this.add_patient = true;
            this.patient_data = false;
            this.appoint = false;
            this.show_user = false;
          }else if(event.url === '/data_patient') {
            this.patient_data = true;
            this.add_patient = false;
            this.appoint = false;
            this.show_user = false;
          }else if(event.url === '/appoint') {
            this.appoint = true;
            this.add_patient = false;
            this.patient_data = false;
            this.show_user = false;
          }else if(event.url === '/user') {
            this.show_user = true;
            this.add_patient = false;
            this.patient_data = false;
            this.appoint = false;
          }else {
            this.add_patient = false;
            this.patient_data = false;
            this.appoint = false;
            this.show_user = false;
          }
        }
      });        
  
   }

    ngOnInit() {   
    this.getUserLogin();
    
    (<any>$('#sidebar')).click(); 
  } 

 
  logout(){
     this.auth.logout();
  }
  
  getUserLogin(){
  
    this.auth.getUserConnect().subscribe(
        data=>{
           
            if (data.role=="ROLE_ADMIN") {        
               this.show_admin= true;
             }else if(data.role=="ROLE_MEDECIN") {        
               this.show_medecin= true;
             }else{
                this.show_secretaire= true;
             }
            });    
  }
  
  getLogin() {
    this.auth.getUserLogin().subscribe(
        data=>{
            this.roleUserLogin=data.role[0];
            
            }
        ); 
  }

 
  
}