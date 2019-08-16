const Prot = 'https://';

const Login = '/login';
const Logout = '/logout';

const GetHomes = "/api/v1/ops/get-homes";
const GetTrials = '/api/v1/ops/get-trials';
const GetPhysicalDevices = '/api/v1/ops/get-available-physical-devices';
const GetHomeByUUID = '/api/v1/ops/get-home-by-uuid';

const RegisterHome = '/api/v1/ops/register-home';
const Register = '/api/v1/ops/register-deployment';

const ModifyDeployment = '/api/v1/ops/modify-deployment';

const DeregisterHome = '/api/v1/ops/deregister-home';
const DeregisterDeployment = '/api/v1/ops/deregister-deployment';

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

  get LogoutURL(){
    return Prot+this.server+Logout;
  }

  get GetHomesURL(){
    return Prot+this.server+GetHomes;
  }

  get GetTrialsURL(){
    return Prot+this.server+GetTrials;
  }

  get GetPhysicalDevicesURL(){
    return Prot+this.server+GetPhysicalDevices;
  }

  get GetHomeByUUIDURL(){
    return Prot+this.server+GetHomeByUUID;
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

  get DeregisterHomeURL(){
    return Prot+this.server+DeregisterHome;
  }

  get DeregisterDeploymentURL(){
    return Prot+this.server+DeregisterDeployment;
  }

}
