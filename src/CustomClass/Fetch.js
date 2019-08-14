// /*URLs*/
// export const MainURL = 'www.devemerald.com';
// export const LoginURL = 'https://www.devemerald.com/login';
// export const GetHomesURL = "https://www.devemerald.com/api/v1/ops/get-homes";
// export const LogoutURL = 'https://www.devemerald.com/logout';
// export const GetTrialsURL = 'https://www.devemerald.com/api/v1/ops/get-trials';
// export const RegisterHomeURL = 'https://www.devemerald.com/api/v1/ops/register-home';
// export const RegisterURL = 'https://www.devemerald.com/api/v1/ops/register-deployment';
// export const ModifyDeploymentURL = 'https://www.devemerald.com/api/v1/ops/modify-deployment';

const Prot = 'https://';
const Login = '/login';
const GetHomes = "/api/v1/ops/get-homes";
const Logout = '/logout';
const GetTrials = '/api/v1/ops/get-trials';
const RegisterHome = '/api/v1/ops/register-home';
const Register = '/api/v1/ops/register-deployment';
const ModifyDeployment = '/api/v1/ops/modify-deployment';

export class FetchURL {
  constructor(server){
    this.server = server; //In the form of www.***.com, e.g. www.devemerald.com
  }

  get MainURL(){
    return Prot + this.server ;
  }

  get LoginURL(){
    return Prot+this.server+Login;
  }

  get GetHomesURL(){
    return Prot+this.server+GetHomes;
  }

  get LogoutURL(){
    return Prot+this.server+Logout;
  }

  get GetTrialsURL(){
    return Prot+this.server+GetTrials;
  }

  get RegisterHomeURL(){
    return Prot+this.server+RegisterHome;
  }

  get RegisterURL(){
    return Prot+this.server+Register;
  }

  get ModifyDeploymentURL(){
    return Prot+this.server+ModifyDeployment;
  }

}
