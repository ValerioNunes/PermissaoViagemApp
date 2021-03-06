
import { Component } from "@angular/core/";
import { IonicPage, NavController, AlertController, NavParams , Loading, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { MensagemProvider } from '../../providers/msg/mensagem';
import moment from 'moment';
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

  private Place: any;
  private Aprovador   :  any = [];
  private Transportes :  any;

  private Viajante    :  any;
  private Viajantes   :  any = [];

  private Telefone    :  any;
  private Telefones   :  any = [];

  loading: Loading;
 
  today = moment().format();
  SolicitacaoViagem  = this.FormatSolicitacao();
  duracao = '';
 

  constructor(  public navCtrl: NavController,
                public restProvider: RestProvider,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                public msg         : MensagemProvider) {

                //this.Aprovador   =  this.navParams.get("Aprovador");  
                this.Transportes =  this.navParams.get("Transporte");
                this.Place       =  this.navParams.get("Places");
  }

 ionViewDidLoad() {
  }
  onSubmit(formData) {
      if(this.formValidacao()) {
        this.showLoading();
        console.log(this.SolicitacaoViagem);
        this.restProvider.addDadosParaSolicitacao(this.SolicitacaoViagem).then(allowed => {
            console.log(allowed);

            if(allowed == 'Sua solicitação foi cadastrada com sucesso!'){
              
                this.loading.dismiss();
                this.enviarMensagemSMS();    
                this.SolicitacaoViagem = this.FormatSolicitacao();

                
                this.showError("Solicitação relizada com SUCESSO!");
                this.navCtrl.pop();

            }else{
              this.loading.dismiss();
              this.showError("NÃO foi possível realizar Solicitação!");
            }
           

        }).catch(error => { console.log(error) });

    }
   }

  enviarMensagemSMS(){
    let idAprovador = this.SolicitacaoViagem.Aprovador;
    var element = this.Aprovador.filter(function(elem, i, Aprovador){
       return (elem.Id === idAprovador);
    })[0];

    if(element.Telefone != null){
        let Mensagem = { Telefone : element.Telefone,
                        Texto     : "CCR-Online - +1 Solicitação AGUARDADO Análise" 
                        };
        this.msg.SendSMS(Mensagem);
                  }
    }



  formValidacao(){
    if(this.SolicitacaoViagem.Origem !== ''){
      if(this.SolicitacaoViagem.Destino !== ''){
        if(this.SolicitacaoViagem.Aprovador !== ''){
          if(this.Viajantes.length > 0 ){
            if(this.SolicitacaoViagem.Transporte !== '' ){
              if(this.SolicitacaoViagem.Partida !== '' ){
                if(this.SolicitacaoViagem.Chegada !== '' ){
                  let Partida = new Date(this.SolicitacaoViagem.Partida.replace("Z",""));
                  let Chegada = new Date(this.SolicitacaoViagem.Chegada.replace("Z",""));
                 
                    if((Partida < Chegada)){

                        this.Viajantes.forEach(viajante =>  this.SolicitacaoViagem.Viajantes.push(viajante.Id) );
                        this.SolicitacaoViagem.Contatos = this.Telefones;
                        this.SolicitacaoViagem.Partida  = this.SolicitacaoViagem.Partida.toString().replace("Z","");
                        this.SolicitacaoViagem.Chegada  = this.SolicitacaoViagem.Chegada.toString().replace("Z","");
                        if(this.SolicitacaoViagem.Observacao != null)
                            this.SolicitacaoViagem.Observacao = this.navParams.get("Solicitante").Id+ ' : '+this.SolicitacaoViagem.Observacao;


                        this.Viajantes = []; 
                        this.Telefones = [];
                        
                        return true;

                      }else{
              
                        this.showError("Data de Partida maior que Data de Chegada")
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
        return  { Origem     : this.navParams.get("Places").origem,
                  Destino    : this.navParams.get("Places").destino,
                  IdOrigemPlace:  this.navParams.get("Places").idorigemplace,
                  IdDestinoPlace: this.navParams.get("Places").iddestinoplace,
                  Transporte : '',
                  Aprovador  : '',
                  Solicitante: this.navParams.get("Solicitante").Id,
                  Partida    : '',
                  Chegada    : '',
                  Contatos   : [],
                  Viajantes  : [],
                  Observacao : null}
        }

  onChangeData(){
    
    let HoraInicioSup = 7;
    let HoraFimSup = 18;

    if((this.SolicitacaoViagem.Partida.length != 0) && (this.SolicitacaoViagem.Chegada.length != 0)){
      
      let Partida = new Date(this.SolicitacaoViagem.Partida.replace("Z",""));
      let Chegada = new Date(this.SolicitacaoViagem.Chegada.replace("Z",""));

      if(Partida < Chegada){

          this.duracao = this.getSubDate(Partida, Chegada);
          let HorasDeViagem = this.getHoras(Partida, Chegada);

          if((Partida.getHours() >= HoraInicioSup) && (Partida.getHours() < HoraFimSup)){

            if(((Partida.getHours() + Partida.getMinutes()/59) + HorasDeViagem ) <= 18){
                        //console.log("Supervisor");
                        this.Aprovador   =   this.getAprovador("Supervisor");  
            }else{
                        //console.log("Gerente");
                        this.Aprovador   =   this.getAprovador("Manager");
            }
          }else{
                        //console.log("Gerente");
                        this.Aprovador   =   this.getAprovador("Manager");
          }
        }
            else{
                this.duracao   = "Período Inválido..."
                this.Aprovador =[]
            }
    
    }
 
   }

  getAprovador(Nivel){

        var aprovador =   this.navParams.get("Aprovador").filter(x => x.NivelGerencial == Nivel); 

        if(aprovador.length == 0){
          return  this.navParams.get("Aprovador").filter(x => x.NivelGerencial == "Manager");
        }

        return  aprovador;
   }

  getSubDate(start, stop){

    var msecPerMinute = 1000 * 60;  
    var msecPerHour = msecPerMinute * 60;  
    var msecPerDay = msecPerHour * 24;  

    let interval =  stop.getTime()-start.getTime();

    var days = Math.floor(interval / msecPerDay );  
    interval = interval - (days * msecPerDay );  
    
    // Calculate the hours, minutes, and seconds.  
    var hours = Math.floor(interval / msecPerHour );  
    interval = interval - (hours * msecPerHour );  
    
    var minutes = Math.floor(interval / msecPerMinute );  
    interval = interval - (minutes * msecPerMinute );  
    
    var seconds = Math.floor(interval / 1000 );  
    
    // Display the result.  
    return String(days + " Dias, " + hours + " Horas  e " + minutes + " Minutos ");  
    
   }

  getHoras(start, stop){

    var msecPerMinute = 1000 * 60;  
    var msecPerHour = msecPerMinute * 60;  
    var msecPerDay = msecPerHour * 24;  

    let interval =  stop.getTime() - start.getTime();

    var days = Math.floor(interval/msecPerDay);  
    interval = interval - (days*msecPerDay);  
    
    // Calculate the hours, minutes, and seconds.  
    var hours = Math.floor(interval / msecPerHour );  
    interval = interval - (hours * msecPerHour );  
    
    var minutes = Math.floor(interval / msecPerMinute );  
    interval = interval - (minutes * msecPerMinute );  
    
    var seconds = Math.floor(interval / 1000 );  
    
    // Display the result.  
    return (days*24  + hours + minutes/60 );  
    
   }
}

