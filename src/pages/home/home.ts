
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AlterarStatusPage } from '../alterar-status/alterar-status';
import { DadosEmpregadoPage } from '../dados-empregado/dados-empregado';

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  directionsDisplay: any;

  loading: Loading;
  MinhasSolicitacoes:any = [];
  Solicitacao: any;


  private Solicitante: any;
  private Aprovador: any;
  private Status: any;

  constructor(public nav: NavController,
              public restProvider: RestProvider,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {

    this.Solicitante = this.navParams.get("Solicitante");
    this.Aprovador = this.navParams.get("Aprovador");
    this.Status = this.navParams.get("Status");
  
  }
  ionViewWillEnter() {
    console.log(this.Solicitante.Telefone);
    this.verificarTelefone(this.Solicitante);
    this.getMinhasSolicitacoes();
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
    
    }

  gerarTrajeto(MinhasSolicitacoes){

    this.clearMap();

    MinhasSolicitacoes.forEach(element => {
        if(element.Status == "viajando" ){
          var request = {
            origin:      {'placeId': element.IdOrigemPlace },//new google.maps.LatLng(this.Origem.lat, this.Origem.lng),
            destination: {'placeId': element.IdDestinoPlace},//new google.maps.LatLng(this.Destino.lat, this.Destino.lng),
            travelMode: google.maps.TravelMode.DRIVING,
          }
          

          this.directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            suppressInfoWindows: true
           });
          var directionsService = new google.maps.DirectionsService;
          this.directionsDisplay.setMap(this.map);

          let lvDirectionsDisplay = this.directionsDisplay;
          directionsService.route(request,  function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              lvDirectionsDisplay.setDirections(result);
              var dados = {
                  DISTANCIA: lvDirectionsDisplay.directions.routes[0].legs[0].distance.text,
                  DURACAO:   lvDirectionsDisplay.directions.routes[0].legs[0].duration.text
              }
           
            }
          });
        }
   });
  
   }

  clearMap(){
    if(this.directionsDisplay != null) {
      this.directionsDisplay.setMap(null);
      this.directionsDisplay = null;
      }
    }

  getMinhasSolicitacoes() {
    this.showLoading();
    this.restProvider.getMinhasSolicitacoes(this.Solicitante.Id)
      .then(data => {
        this.MinhasSolicitacoes = data;
        this.gerarTrajeto(this.MinhasSolicitacoes);
        this.loading.dismiss();

      });
     
   }

 



  verificarTelefone(Empregado) {
    if (Empregado.Telefone == null) {
      this.nav.push(DadosEmpregadoPage, this.navParams);
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

  showLoading() {

    this.loading = this.loadingCtrl.create({
      content: 'Aguarde! Consultando Solicitações...',
      dismissOnPageChange: true
    });
    this.loading.present();
   }

  buscarSolicitacaoAlterarStatus(Id, status) {
    this.showLoading();
    this.restProvider.getSolicitacao(Id)
      .then(data => {
        this.loading.dismiss();
        this.nav.push(AlterarStatusPage, { Dados: data, Status: status });
      });
   }
 
  tipoUser(item) {
    return (item.Aprovador == this.Solicitante.Nome)
   }

  userAprovador(item) {

    if (item.Status == 'aguardando') {
      this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[1], this.Status[2]]);
    } else {
      this.buscarSolicitacaoAlterarStatus(item.Id, []);
    }
    }

  userSolicitante(item) {
    if (item.Status == "aprovado" || item.Status == "nao_aprovado") {
      this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[4]]);
    } else if (item.Status == this.Status[4].Nome) {
      this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[3]]);
    } else {
      this.buscarSolicitacaoAlterarStatus(item.Id, []);
    }
    }

  itemSelected(item) {

    if (this.tipoUser(item)) {

      this.userAprovador(item)

    } else {

      this.userSolicitante(item)

    }
    }

}
