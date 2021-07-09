import { AuthentificationService } from './services/authentification.service';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output ,HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { trigger, animate, transition, style, query } from '@angular/animations';


import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
      trigger('routeAnimations', [
        transition('* <=> *', [
          query(':enter, :leave',  [
            style({
              position: 'fixed',
              left: 0,
              width: '100%',
              opacity: 0,
              transform: 'scale(0) translateY(-100%)',
              transition: 5
            }),
          ], { optional: true }),
          query(':enter', [
            animate('1000ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
          ], { optional: true })
        ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ]),
    trigger('slideOut', [
      transition(':enter', [
        style({transform: 'translateY(+100%)'}),
        animate('500ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ])
  ]
})
export class AppComponent {

  editPassForm: FormGroup; profil: boolean;registerForm: FormGroup;submitted = false;
  showHead;show: boolean = true;roles; editPassword:boolean;
  userLogin;roleUserLogin: string;userLoginSexe; user_id; userSpecialite: string; userName: string; sexe: string; specialite: string;
  errorPassword:boolean;samePassword:boolean;infoPassword;checkUsername;username;nombrePatient;nombreAppoinnt;
  nombrePatientData;pp;
 
  patients;appoints;dossiers;patient;appoint;dossier
  images: string;

  constructor(private auth: AuthentificationService, private router: Router, private http: HttpClient,private formBuilder: FormBuilder, private domSanitizer: DomSanitizer) {

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/login' || event.url === '/') {
          this.showHead = false;
        } else {
          this.showHead = true;
          
        }
      }
    });
  }


  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngOnInit() {
    this.profil = false;
    this.editPassword=false;
    this.checkUsername=false;

    //this.errorPassword=false;

    $(document).ready(() => {
      setInterval(() => {
        $('p').fadeIn();
        // $('p').fadeOut(); 
      }, 1000);
    });

   
    this.getLogin();
    
    this.onGet();

    this.editPassForm=this.formBuilder.group({
      id: [],
      currentPassword:['',[Validators.required, Validators.minLength(4)]],
      newPassword:['',[Validators.required, Validators.minLength(4)]],
      confirmPassword:['',[Validators.required, Validators.minLength(4)]],
      username:['',[Validators.required, Validators.minLength(4)]],

    })
  }
  onGet():any{
    //    let mySrc: SafeUrl;
    //     return this.auth.getImage().subscribe(
    //       data =>{
    
    
    //         // const reader = new FileReader();
    //         // reader.readAsDataURL(data); 
    //         // reader.onloadend = function() {
    //         //   // result includes identifier 'data:image/png;base64,' plus the base64 data
    //         // mySrc = reader.result;  
    //        // this.images= window.URL.createObjectURL(data);   
    // // }
    //        // this.thumbnail='data:image/png;base64'+this.images;
    //         // this.ok= true;
    //         // this.image=data;
    //        // this.image= this.domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${this.zona?.fotografia}`)
    //         // let objectURL = 'data:image/jpeg;base64,' + data.image;
    //         //  mySrc = this.domSanitizer.bypassSecurityTrustUrl(this.images);
    //         console.log(data);
    //       }
    //     )
  }
  
  get f() {
    return this.editPassForm.controls;
  }

  profile() {
    this.editPassword=false;
    if (this.profil == false) {
      this.profil = true;
    } else {
      this.profil = false;
    }

  }

  logout() {
    this.auth.logout();  
  }

  getLogin() {
    this.auth.getUserLogin().subscribe(
        data=>{
         
              this.user_id=data.id;
              this.userName=data.prenom+" "+data.nom;
              this.sexe=data.sexe;
              this.roles=data.role[0];
              this.specialite=data.specialite;
              this.userSpecialite=data.specialite;

              if (this.roles=='ROLE_MEDECIN') {
                this.getAppointementByMedecin()
                this.getPatientDataByMedecin();
                this.getPatient();
              }else if(this.roles=='ROLE_ADMIN'){
                this.getRole();
                this.getPatients();
                this.getAppointement()
                this.getPatientData();
              }else if(this.roles=='ROLE_SECRETAIRE'){
                this.getAppointement()
                this.getPatientData();
                this.getPatients();
              }
            }
        ); 
  }
  
  getRole() {
    this.auth.getRoles().subscribe(
      data => {
        this.roles = data;
      }
    );
  }

  getPatient() { 
     let patient;
    this.auth.getPatientByMedecin().subscribe(
      data =>{
        patient=data;
        this.patients =patient;
      }
    )
  }

  getPatients() { 
    let patient;
   this.auth.getPatient().subscribe(
     data =>{
       patient=data;
       this.patient =patient;
       this.nombrePatient= this.patient.length;
       
     }
   )
  }

  getAppointementByMedecin() { 
    let appoint;
   this.auth.getAppointByMedecin().subscribe(
     data =>{
      appoint=data;
       this.appoints =appoint;
     }
   )
  }

getAppointement() { 
  let appoints;
 this.auth.getAppoint().subscribe(
   data =>{
    appoints=data;
     this.appoint =appoints;
     this.nombreAppoinnt= this.appoint.length;
   }
 )
}

  getPatientDataByMedecin() { 
  let dossier;
 this.auth.getPatientDataByMedecin().subscribe(
   data =>{
    dossier=data;
     this.dossiers =dossier;
   }
 )
  }

  getPatientData() { 
  let dossiers;
 this.auth.getPatient().subscribe(
   data =>{
    dossiers=data;
     this.dossier =dossiers;
     this.nombrePatientData= this.dossier.length;
   }
 )
  }

  check(){
  let userName,checkUsername
    return this.auth.getUsers().subscribe(
      data =>{
       
        for(var index in data){
          userName = data[index].username.toLowerCase();
          checkUsername=this.username.toLowerCase();

          if(userName === checkUsername){
            this.checkUsername=true;
            setTimeout(() => {
              this.checkUsername=false;
              this.editPassForm.get('username').patchValue('');
            },2000);
          }
        }
      }
    )
  }

  editProfile(){
    this.submitted = true;
    console.log(this.checkUsername);
    // stop here if form is invalid
    if (this.editPassForm.value.newPassword != this.editPassForm.value.confirmPassword) {
       this.editPassForm.get('newPassword').patchValue('');
       this.editPassForm.get('confirmPassword').patchValue('');
       
       this.errorPassword= true;
            setInterval(() => {
              this.errorPassword= false;
            }, 4000);        
      return;
    }
    if (this.submitted) {
      const user = {
        id: this.user_id,
        newPassword: this.editPassForm.value.newPassword,
        currentPassword: this.editPassForm.value.currentPassword,
        confirmPassword: this.editPassForm.value.confirmPassword,
        username: this.editPassForm.value.username,
      };
     
    console.log(user);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      this.auth.editProfile(user.id,user).subscribe(
        data => {
          console.log(data['message']);
          if(data['message'] =='Password modifié'){ 
              Toast.fire({
                icon:"success",
                title: ''+data['message'],
                //imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg'
              })
              this.profil=true;
              this.editPassword=false;
              setTimeout(()=>{
                this.profile();
                this.logout();
                this.router.navigateByUrl('/');
              },2000);
          }else if(data['message'] =='Choisir un password diffrent'){
            this.samePassword=true;
            $(document).ready(() => {
              setInterval(() => {
                this.samePassword= false;
              }, 7000);
            });  
               
            this.infoPassword=data['message'];
          }
        },
        error => {
          this.editPassForm.get('currentPassword').patchValue(null);
        }
      );
    }
  }

  editForm(){
    this.editPassForm=this.formBuilder.group({
      id: [''],
      currentPassword:['',[Validators.required, Validators.minLength(4)]],
      newPassword:['',[Validators.required, Validators.minLength(4)]],
      confirmPassword:['',[Validators.required, Validators.minLength(4)]],
      username:['']
    })
  }

  editPasswordForm(){
    this.profil=false;
    this.editPassword=true;
  }

  removeSpaces(string) {
    return string.split(' ').join('').replace(new RegExp("\\\\", "g"), "");
   }
  
  cancel() {
    this.ngOnInit();
  }
}