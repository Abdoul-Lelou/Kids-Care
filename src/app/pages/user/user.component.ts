import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { animate, style, transition, trigger } from '@angular/animations';
import { filter, map, catchError } from 'rxjs/operators';
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
      ])
    ]),
    trigger('slideOut', [
      transition(':enter', [
        style({ transform: 'translateY(+100%)' }),
        animate('1000ms ease-in', style({ transform: 'translateY(0%)' }))
      ])
    ])
  ]
})
export class UserComponent implements OnInit {

  registerForm: FormGroup; submitted = false; bloc1: boolean = true; bloc2: boolean = false;updateError;
  inputSearch: boolean = false; add; list; edit; role; username; checkUsername: boolean;usersNotActiveLength;
  inputTel; chechNumber: boolean; users; email; chechEmail: boolean; allUsers;usersActive;usersNotActive;
  activeUsers:boolean; userDisableStatut: boolean= false; userActiveStatut: boolean= false;usersActiveLength;


  constructor(private auth: AuthentificationService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: [''],
      role: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      specialite: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      tel: ['', [Validators.required, Validators.pattern(/^-?(0|[33]\d*)?$/), Validators.maxLength(9), Validators.minLength(9)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.getRole();
    this.getUsers();
    this.add = false;
    this.list = true;
    this.add = false
    this.edit = false;
    this.bloc1 = true;
    this.bloc2 = false;
    this.checkUsername = false;
    this.chechNumber = false;
    this.chechEmail = false;
    this.activeUsers= true;
    
  }

   
  updateUser() {

    this.submitted = true;

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

    if (this.submitted) {
      if (this.registerForm.value.password) {
        const user = {
          id: this.registerForm.value.id,
          username: this.registerForm.value.username,
          password: this.registerForm.value.password,
          nom: this.registerForm.value.nom,
          prenom: this.registerForm.value.prenom,
          email: this.registerForm.value.email,
          specialite: this.registerForm.value.specialite,
          tel: this.registerForm.value.tel,
          role: this.registerForm.value.role,
          sexe: this.registerForm.value.sexe,
        };

        this.auth.upDate(user.id, user).subscribe(
          data => {
            Toast.fire({
              icon: "success",
              title: 'Modifié avec succès',

            })
            this.ngOnInit();
          },
          error => {
            alert(error['message']);
            console.log(error)
          }
        );
      } else {
        const user = {
          id: this.registerForm.value.id,
          username: this.registerForm.value.username,
          nom: this.registerForm.value.nom,
          prenom: this.registerForm.value.prenom,
          email: this.registerForm.value.email,
          specialite: this.registerForm.value.specialite,
          tel: this.registerForm.value.tel,
          role: this.registerForm.value.role,
          sexe: this.registerForm.value.sexe,
        };
        this.auth.upDate(user.id, user).subscribe(
          data => {
            Toast.fire({
              icon: "success",
              title: 'Modifié avec succès',

            })
            this.ngOnInit();
          },
          error => {
            alert(error['message']);
          }
        );
      }


    }
  }

  addUser() {
    this.list = false;
    this.edit = false;
    this.add = true;

    let checkTel: boolean = false, checkEmail: boolean = false;
    // let verifNum:boolean = this.allUsers.filter(u => u.tel == this.inputTel);
    // let verifEmail:boolean = this.allUsers.filter(u => u.email == this.email);


    for (const iterator of this.allUsers) {

      if (iterator.tel == this.inputTel) {
        checkTel = true
      } else if (iterator.email == this.email) {
        checkEmail = true;
      }
    }

    if (checkTel) {
      this.chechNumber = true;
      this.registerForm.get('tel').patchValue(null);
      setTimeout(() => {
        this.chechNumber = false;
      }, 5000);
    } else if (checkEmail) {
      this.chechEmail = true;
      this.registerForm.get('email').patchValue(null);
      setTimeout(() => {
        this.chechEmail = false;
      }, 5000);
    } else {
      const user = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        nom: this.registerForm.value.nom,
        prenom: this.registerForm.value.prenom,
        email: this.registerForm.value.email,
        specialite: this.registerForm.value.specialite,
        tel: this.registerForm.value.tel,
        role: this.registerForm.value.role,
        sexe: this.registerForm.value.sexe,

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

      this.auth.addUser(user).subscribe(
        data => {
          Toast.fire({
            icon: 'success',
            title: 'Ajouté avec succès',
          })
          this.ngOnInit();
        }
      );
    }


  }

  getUsers() {

    this.auth.getUsers().subscribe(
      data => {
        this.users = data;
        this.allUsers = data;
        this.usersActive = this.users.filter(x => x.role != 'ROLE_ADMIN' && x.isActive);
        this.usersNotActive = this.users.filter(x => x.role != 'ROLE_ADMIN' && !x.isActive);
        this.usersNotActiveLength = this.usersNotActive.length;
        this.usersActiveLength = this.usersActive.length;
         if(this.usersNotActive.length == 0) 
          {
            this.userDisableStatut = true;
          }
          
      }
    )
  }

  getRole() {
    this.auth.getRoles().subscribe(
      data => {
        this.role = data;
      }
    );
  }

  disUnable(id) {

    Swal.fire({
      title: 'Voulez-vous bloquer ce medecin',
      showCancelButton: true,
      confirmButtonText: `Bloquer`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Ajoute!', '', 'success')
      }
    })

    Swal.fire({
      title: 'Etez-vous sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.disUnable(id).subscribe(
          data => {
            this.ngOnInit();
            Swal.fire(
              'Effectuer!',
              '' + data['message'],
              'success'
            )
          }
        )
      }
    })

  }

  editForm(user) {
    this.list = false;
    this.add = false
    this.edit = true;

    this.registerForm = this.formBuilder.group({
      id: [user.id, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      password: [''],
      username: [user.username, [Validators.required, Validators.minLength(4)]],
      prenom: [user.prenom, [Validators.required, Validators.minLength(3)]],
      nom: [user.nom, [Validators.required, Validators.minLength(4)]],
      tel: [user.tel, [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(9), Validators.minLength(9)]],
      specialite: [user.specialite, [Validators.required]],
      role: [user.role, [Validators.required]],
      sexe: [user.sexe, [Validators.required]],
    });
  }

  checkUsernameLogin() {
    let userName, checkUsername
    return this.auth.getUsers().subscribe(
      data => {
        for (var index in data) {
          userName = data[index].username.toLowerCase();
          checkUsername = this.username.toLowerCase();

          if (userName === checkUsername) {
            this.checkUsername = true;
            this.registerForm.get('username').patchValue(null);
            setTimeout(() => {
              this.checkUsername = false;
            }, 3000)

          }
        }
      }
    )
  }


  removeSpaces(string) {
    let splitStr = string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    splitStr = splitStr.replace(/[^a-zA-Z]+/g, '');
    splitStr = splitStr.split(' ').join('');
    return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
  }

  getInputEmail(string) {

    let splitStr = string.replace(/[^a-zA-Z0-9]@.-+/g, '');
    splitStr = splitStr.split(' ').join('');
    this.email = splitStr;

    return splitStr;
  }

  removeLetter(string) {
    let splitStr = string.replace(/[^0-9]+/g, '');
    splitStr = splitStr.split(' ').join('');
    this.inputTel = splitStr;
    return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
  }

  adduserForm() {
    this.list = false;
    this.add = true;
  }

  cancel() {
    this.ngOnInit();
  }

  blockForm() {
    this.bloc1 = false;
    this.bloc2 = true;
  }

  patientVisite(){
    this.activeUsers= true
 }

 notVisite(){
   this.activeUsers= false
 }

}