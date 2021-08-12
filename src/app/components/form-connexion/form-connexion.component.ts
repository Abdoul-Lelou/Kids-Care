import { AuthentificationService } from './../../services/authentification.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

@Component({
  selector: 'app-form-connexion',
  templateUrl: './form-connexion.component.html',
  styleUrls: ['./form-connexion.component.scss']
})
export class FormConnexionComponent implements OnInit {

  formConnexion:FormGroup; show : boolean = true;userConnect; logError: boolean = false; erreur;
  showModal: boolean;registerForm: FormGroup;submitted = false;loading: boolean;passwordError:boolean
  disableError:boolean;

  constructor(private formBuilder: FormBuilder,private auth: AuthentificationService, private router: Router) 
  {
    
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        username: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.logError=false;
    this.loading= false;
    this.passwordError= false;
    this.disableError= false;
  }

    // get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    if (this.submitted) {
      this.loading= true;
      const user = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
      };
      
      this.auth.getConnexion(user).subscribe(
        data => {  
          setTimeout(()=>{
            if (data.token) {   
              this.router.navigateByUrl('/home');
          }
          },2000)
          
        },
        error => {
         
          if(error ==='Invalid credentials.'){
            this.passwordError=true;
            setInterval(() => {
              this.passwordError=false;
            }, 5000);
            this.loading= false;
            
          }else if(error ==='Account is disabled.'){
            this.disableError=true;
            setInterval(() => {
              this.disableError=false;
            }, 5000);
            this.loading= false;
          }
        }
      );
    }

  }
  //   getUserConnect(){
  //    this.auth.getUserLogin().subscribe(
  //       data=>{
  //           this.userConnect=data;
  //       })  
  // }  
     
 }
  

