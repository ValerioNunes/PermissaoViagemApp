import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams , Loading, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ContatosPage } from '../contatos/contatos';
import { MensagemProvider } from '../../providers/msg/mensagem';
/**
 * Generated class for the AlterarStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;


@IonicPage()
@Component({
  selector: 'page-alterar-status',
  templateUrl: 'alterar-status.html',
})
export class AlterarStatusPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  directionsDisplay: any;



  Solicitacao : any; 
  ListStatus: any;
  Status: any;
  Solicitante : any;
  Aprovador :  any;
  Viajantes : any = [];

  NovoStatus = this.FormatStatus();
  Origem: any;
  Destino: any;


  loading: Loading;

  constructor(public navCtrl: NavController,
              public restProvider: RestProvider,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              public navParams: NavParams,
              public msg         : MensagemProvider) {

    this.Solicitacao =  this.navParams.get('Dados');
    this.ListStatus  =  this.navParams.get('Status');
    this.NovoStatus.SolicitacaoViagemId = this.Solicitacao[0].Id;
    this.Solicitante = this.Solicitacao[0].Empregado;
    this.Aprovador   = this.Solicitacao[0].AprovadorSolicitacaoId[0].Aprovador.Empregado;
    this.Viajantes   = this.Solicitacao[0].ViajanteSolicitacaoId;
    
    
  }
  ionViewDidLoad() {
    this.loadMap();
   }

  loadMap(){

      var latLng = new google.maps.LatLng(-2.53073, -44.3068);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.gerarTrajeto();
    }

  gerarTrajeto(){

      this.directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService;

      this.directionsDisplay.setMap(this.map);

      var request = {
        origin: {'placeId': this.Solicitacao[0].Origem.IdPlace },//new google.maps.LatLng(this.Origem.lat, this.Origem.lng),
        destination: {'placeId': this.Solicitacao[0].Destino.IdPlace },//new google.maps.LatLng(this.Destino.lat, this.Destino.lng),
        travelMode: google.maps.TravelMode.DRIVING
      }

      let lvDirectionsDisplay = this.directionsDisplay;
      directionsService.route(request,  function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          lvDirectionsDisplay.setDirections(result);
          var dados = {
              DISTANCIA: lvDirectionsDisplay.directions.routes[0].legs[0].distance.text,
              DURACAO:   lvDirectionsDisplay.directions.routes[0].legs[0].duration.text
          }
          document.getElementById('distancia').innerHTML = "Distância: "+dados.DISTANCIA;
          document.getElementById('duracao').innerHTML   = "Duração:   "+dados.DURACAO;
        }
      });
      }

  onSubmit(event){
    
    this.NovoStatus.StatusId =  this.Status;
   
    this.showLoading();

    this.restProvider.setStatusSolicitacao(this.NovoStatus).then(allowed => {
      console.log(allowed);

      if(allowed == 'Sua solicitação foi cadastrada com sucesso!'){

         this.showError("Status alterado com  SUCESSO!")      
         this.EnviarMensagem(this.Status);
         this.navCtrl.pop();
      }else{
        this.showError("NÃO foi possível realizar alteração do Status!")
      }
     
        this.loading.dismiss();
    }).catch(error => { console.log(error) });
    }

  EnviarMensagem(Status){

    let StatusNome

    if(Status == 2)
        StatusNome = "NÃO APROVADA";
      else if(Status == 3)
          StatusNome = "APROVADA";
          else if(Status == 4)
              StatusNome = "ENCERRADO";
            else if(Status == 5)
              StatusNome = "VIAJANDO";

      //this.EnviarSMS(this.Aprovador  , StatusNome );

      this.EnviarSMS(this.Solicitante, StatusNome );
      this.Viajantes.forEach(element => {
      this.EnviarSMS(element.Empregado,StatusNome);
      console.log(element.Empregado);
      });

   }

  EnviarSMS(Empregado, StatusNome ){
   let Mensagem = { Telefone : Empregado.Telefone,
                   Texto   : "Permissao Viagem - "+
                              "Viagem - SV : "+this.Solicitacao[0].Id+" De: " +this.Solicitacao[0].Origem.Nome
                              +" Para: " +this.Solicitacao[0].Destino.Nome +" *"+ StatusNome+"* "
      };
    this.msg.SendSMS(Mensagem);
   }

  private FormatStatus(){
    return  { SolicitacaoViagemId     : '',
              StatusId                : ''}
    }
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
    content: 'Aguarde...',
    dismissOnPageChange: true
    });
    this.loading.present();
    }
  
  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Atenção...',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
    }

  contato(event){


    var contatos : any = []

    this.showLoading();
    this.restProvider.getContadosDaSolicitacao(this.NovoStatus.SolicitacaoViagemId).then(allowed => {
      console.log(allowed);
      contatos = allowed;
      this.loading.dismiss();
      
      this.navCtrl.push(ContatosPage,{ Contatos : contatos, Viajantes :  this.Solicitacao[0].ViajanteSolicitacaoId });
      
    }).catch(error => { console.log(error) });

    }

}
