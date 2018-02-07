
import { Component } from "@angular/core/";
import { IonicPage, NavController, AlertController, NavParams , Loading, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { MensagemProvider } from '../../providers/msg/mensagem';
/**
 * Generated class for the SolicitarviagemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-solicitarviagem',
  templateUrl: 'solicitarviagem.html',
})

export class SolicitarviagemPage {

  private Aprovador   :  any;
  private Locais      :  any;
  private Transportes :  any;

  private Viajante    :  any;
  private Viajantes   :  any = [];

  private Telefone    :  any;
  private Telefones   :  any = [];

  SolicitacaoViagem  = this.FormatSolicitacao();

  loading: Loading;
       


  constructor(  public nav: NavController ,
                public restProvider: RestProvider,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                public msg         : MensagemProvider) {

                  this.Aprovador   =  this.navParams.get("Aprovador");  
                  this.Locais      =  this.navParams.get("Local");
                  this.Transportes =  this.navParams.get("Transporte");
  }


  onSubmit(formData) {
     

      if(this.formValidacao()) {
        this.showLoading();

        this.restProvider.addDadosParaSolicitacao(this.SolicitacaoViagem).then(allowed => {
            console.log(allowed);

            if(allowed == 'Sua solicitação foi cadastrada com sucesso!'){
               this.SolicitacaoViagem = this.FormatSolicitacao();

               this.showError("Solicitação relizada com SUCESSO!")
               this.enviarMensagem(this.Aprovador);
              
            }else{
              this.showError("NÃO foi possível realizar Solicitação!")
            }
           
            this.loading.dismiss();
        }).catch(error => { console.log(error) });

    }
  }

  enviarMensagem(Aprovador){

    let Mensagem = { Telefone : "98987542419",
                     Texto    : "Permissão Viagem - Solicitação AGUARDADO Analise" 
                    };
    this.msg.SendSMS(Mensagem);

  }



  formValidacao(){
    if(this.SolicitacaoViagem.Origem !== ''){
      if(this.SolicitacaoViagem.Destino !== ''){
        if(this.SolicitacaoViagem.Aprovador !== ''){
          if(this.Viajantes.length > 0 ){
            if(this.SolicitacaoViagem.Transporte !== '' ){
              if(this.SolicitacaoViagem.Partida !== '' ){
                if(this.SolicitacaoViagem.Chegada !== '' ){
                  if(this.Telefones.length > 0 ){
                        this.Viajantes.forEach(viajante =>  this.SolicitacaoViagem.Viajantes.push(viajante.Id) );
                        this.SolicitacaoViagem.Contatos =  this.Telefones;
                        this.Viajantes = []; 
                        this.Telefones = [];
                        return true;
                  }else{
                  this.showError("Digite o(s) Telefone(s)")
                }
                }else{
              
                this.showError("Coloque a Data de Chegada")
              }
              }else{
              this.showError("Coloque a Data de Partida")
            }
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


  onAddviajante(){
    this.showLoading()
 
    if(this.Viajante !== undefined && this.Viajante !== "" ){

      if(this.verificarMatriculainList(this.Viajante)){

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
        this.showError("A Matrícula já esta na Lista")
        this.Viajante = "";
        this.loading.dismiss();
      }
    }else{
      this.showError("Digite a Matrícula do Viajante")
      this.loading.dismiss();
    }

}

  onAddTelefone(){
    console.log(this.Telefone);

    if(this.Telefone !== undefined && this.Telefone !== ""){
          if(this.verificarTelefoneList(this.Telefone)){
            this.Telefones.push(this.Telefone);
          }else{
            this.showError("Telefone já esta na Lista")
          }
    }else{
      this.showError("Digite o Telefone")
    }
    this.Telefone = "";
  }

  onRemoveTelefone(item){

      let index = this.Telefones.indexOf(item);
        if(index > -1){
          this.Telefones.splice(index, 1);
        }

      }



  verificarTelefoneList(telefone){

      var flag =  true;

      this.Telefones.forEach(element => {
          if(element == telefone){ 
            flag =  false;
          }
      });

    return flag;
        }

  verificarMatriculainList(matricula){

    var flag =  true;

    this.Viajantes.forEach(element => {
    if(element.Id == matricula){ 
      flag =  false;
    }
    });
   return flag;
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
    title: 'Atenção...',
    subTitle: text,
    buttons: ['OK']
  });
  alert.present();

}


private FormatSolicitacao (){

  return  { Origem     : '',
            Destino    : '',
            Transporte : '',
            Aprovador  : '',
            Solicitante: this.navParams.get("Solicitante").Id,
            Partida    : '',
            Chegada    : '',
            Contatos   : [],
            Viajantes  : []}
  }

 }
