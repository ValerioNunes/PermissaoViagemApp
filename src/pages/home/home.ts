import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,  Loading, IonicPage,LoadingController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage   {
  private Solicitante :  any;
  private Aprovador   :  any;
  private Locais      :  any;
  private Transportes :  any;
  private Viajante    :  any;
  private Viajantes   :  any = [];
  loading: Loading;
  


  private SolicitacaoViagem = {Origem: null, Destino: null,Transporte :  null, Aprovador : null, Viajantes : null};


  constructor( public nav: NavController ,
               public restProvider: RestProvider,
               public navParams: NavParams,
               public alertCtrl: AlertController,
               private loadingCtrl: LoadingController) {

              this.Solicitante =  this.navParams.get("Solicitante");
              this.Aprovador   =  this.navParams.get("Aprovador");  
              this.Locais      =  this.navParams.get("Local");
              this.Transportes =  this.navParams.get("Transporte");
  }

onSubmit(formData) {
   
        if(this.formValidacao()) {
          console.log(formData.valid);
    }
  }

formValidacao(){
      if(this.SolicitacaoViagem.Origem !== null){
        if(this.SolicitacaoViagem.Destino !== null){
          if(this.SolicitacaoViagem.Aprovador !== null){
            if(this.Viajantes.length > 0 ){
              if(this.SolicitacaoViagem.Transporte !== null ){
                  return true;
              }else{
               
                this.showError("Selecione Transporte")
              }
            }else{
              this.showError("Adicione Viajante(s)")
            }
          }else{
            this.showError("Selecione Aprovador")
          }
        }else{
          this.showError("Selecione o Destino")
        }
      }else{
        this.showError("Selecione a Origem")
      }
      return false;
}



onLogout(){ 
     this.nav.setRoot(LoginPage); 
  }

SolicitarViagem(){
  console.log(this.SolicitacaoViagem);
}

onAddviajante(){
  this.showLoading()
  console.log(this.Viajante);



  if(this.Viajante !== undefined){
        this.restProvider.getEmpregado(this.Viajante).then(allowed => {
          if (allowed[0]) { 
            this.Viajantes.push(allowed[1]);
            this.Viajante = "";
            this.loading.dismiss();
          } else {
            this. showError("Verificar Matrícula ou Conexão com Internet")
            this.loading.dismiss();
          }
        }).catch(error => { console.log(error) });

    }else{
      this.showError("Digite a Matrícula do Viajante")
      this.loading.dismiss();
    }
    
}

verificarMatriculainList(matricula){

  this.Viajantes.array.forEach(element => {
    if(element.Id == matricula){
      return false;
    }
  });
     return true;
}



showLoading() {
  this.loading = this.loadingCtrl.create({
    content: 'Aguarde! Verificando Matricula...',
    dismissOnPageChange: true
  });
  this.loading.present();
}


onRemoveItem(item){

      let index = this.Viajantes.indexOf(item);
      if(index > -1){
          this.Viajantes.splice(index, 1);
      }

  }

showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Ops...',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
   
  }

}

