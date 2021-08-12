import { AuthentificationService } from './services/authentification.service';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, animate, transition, style, query } from '@angular/animations';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { DomSanitizer } from '@angular/platform-browser';



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
  fileToUpload: File | null = null;
  editPassForm: FormGroup; profil: boolean;registerForm: FormGroup;submitted = false;
  showHead;show: boolean = true;roles; editPassword:boolean; errorPassword:boolean;samePassword:boolean;
  userLogin;roleUserLogin: string;userLoginSexe; user_id; userSpecialite: string; userName: string; sexe: string; specialite: string;
  infoPassword;checkUsername;username;nombrePatient;nombreAppoinnt;nombrePatientData;images;errorCurrentPassword: boolean;
  imageDefaut: boolean;patients;appoints;dossiers;patient;appoint;dossier;selectedFile :File= null;imagesNull;

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
    this.imageDefaut = false;
    this.errorCurrentPassword=false;
    

    $(document).ready(() => {
      setInterval(() => {
        $('p').fadeIn();
        // $('p').fadeOut(); 
      }, 1000);
    });

   
    this.getLogin();
    
    

    this.editPassForm=this.formBuilder.group({
      id: [],
      currentPassword:['',[Validators.required, Validators.minLength(4)]],
      newPassword:['',[Validators.required, Validators.minLength(4)]],
      confirmPassword:['',[Validators.required, Validators.minLength(4)]],
      username:['',[Validators.required, Validators.minLength(4)]],

    })
  }
      

  getProfile(id){
    let images;
     return this.auth.getImage(id).subscribe(
       data =>{
         images= window.URL.createObjectURL(data);   
         this.imagesNull = images;
         this.images = this.domSanitizer.bypassSecurityTrustUrl(images);
       }
     )
  }

  editPhoto(){
    $("#file").trigger('click');
  }

  uploadFiles(event){
    
    this.selectedFile = <File>event.target.files[0];

    const fd = new FormData(); let images;
    fd.append('image', this.selectedFile,this.selectedFile.name);
    images = fd;

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    return this.auth.addProfile(images).subscribe(
      res =>{
        Toast.fire({
          icon:"success",
          title: ''+res['message'],
        })
        this.ngOnInit();
      }
    )

  }


  profile() {
    this.editPassword=false;
    if (!this.profil) {
      this.profil = true;
    } else {
      this.profil = false;
      this.ngOnInit();
    }
  }

  logout() {
    this.auth.logout();  
  }

  getLogin() {
    let profile;
    this.auth.getUserLogin().subscribe(
        data=>{
          profile= data;
              this.user_id=data.id;
              this.userName=data.prenom+" "+data.nom;
              this.sexe=data.sexe;
              this.roles=data.role[0];
              this.specialite=data.specialite;
              this.userSpecialite=data.specialite;
              this.imageDefaut = true;

              if (this.roles=='ROLE_MEDECIN') {

                this.getAppointementByMedecin()
                this.getPatientDataByMedecin();
                this.getPatient();
                if(profile.profil !== null){
                  this.getProfile(profile.profil.id)
                }
              }else if(this.roles=='ROLE_ADMIN'){

                this.getRole();
                this.getPatients();
                this.getAppointement()
                this.getPatientData();

                if(profile.profil !== null){
                  this.getProfile(profile.profil.id)
                  this.imageDefaut = false;
                }
              }else if(this.roles=='ROLE_SECRETAIRE'){

                this.getAppointement()
                this.getPatientData();
                this.getPatients();

                if(profile.profil !== null){
                  this.getProfile(profile.profil.id)
                }
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
    this.auth.getPatientData().subscribe(
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
        confirmPassword: this.editPassForm.value.confirmPassword
      };
     
   
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
          
          if(data['message'] =='Password modifié'){ 
              Toast.fire({
                icon:"success",
                title: ''+data['message'],
              })
              
              this.profil=true;
              this.editPassword=false;
              
              this.editForm();
              setTimeout(()=>{
                this.profile();
                this.logout();
                this.router.navigateByUrl('/');
              },3000);
          }else if(data['message'] =='Choisir un password diffrent'){
            this.samePassword=true;
              setInterval(() => {
                this.samePassword= false;
              }, 5000);   
               
            this.infoPassword=data['message'];
          }else if(data['message'] =='Password actuel incorrect'){
            this.errorCurrentPassword=true;
            this.editPassForm.get('currentPassword').patchValue('');
           
              setInterval(() => {
                this.errorCurrentPassword= false;
              }, 5000);
          }
        }
        
      );
    }
  }

  
  editForm(){
    this.editPassForm=this.formBuilder.group({
      id: [''],
      currentPassword:['',[Validators.required, Validators.minLength(4)]],
      newPassword:['',[Validators.required, Validators.minLength(4)]],
      confirmPassword:['',[Validators.required, Validators.minLength(4)]]
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