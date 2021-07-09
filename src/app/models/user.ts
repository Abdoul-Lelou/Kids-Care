export interface User {
    id?:any;
    username?:string;
    password?:string;
    role?:string;
    roles?:string;
    prenom?:string;
    nom?:string;
    sexe?:string;
    specialite?:string;
    email?:string;
    tel?:number;
    token?:string;
    isActive?:boolean;
    profil?: string;
    newPassword?: any;
    currentPassword?: any;
    confirmPassword?: any;
}
