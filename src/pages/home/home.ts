
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
  directionsDisplay: any = [];

  loading: Loading;
  MinhasSolicitacoes = [];

  TodasSolicitacoes: any  = [];
  Solicitacao: any;
  numViajando: any;
  Relatorio = [];

  private Solicitante: any;
  private Aprovador: any;
  private Status: any;

  StatusPrinc = ['encerrado', 'expirado'];

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
    this.verificarTelefone(this.Solicitante);

    this.getMinhasSolicitacoes();
  }
  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    var latLng = new google.maps.LatLng(-2.53073, -44.3068);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  resumoStatus() {
    var Relatorio = this.TodasSolicitacoes.map(x => x.Status).reduce(function (allNames, name) {
      if (name in allNames) {
        allNames[name]++;
      }
      else {
        allNames[name] = 1;
      }
      return allNames;
    }, {});
    Relatorio = Object.keys(Relatorio).reduce(function (out, key) {
      out.push({
        Status: key,
        Quantidade: Relatorio[key]
      });
      return out;
    }, []);

    this.Relatorio = Relatorio;
  }

  gerarTrafego(Status) {

    let Solicitacao = this.TodasSolicitacoes.filter(s => s.Status === Status.Status);

    this.clearMap();
    this.directionsDisplay = new Array();
    let i = 0;

    Solicitacao.forEach(element => {

      this.directionsDisplay.push(new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        suppressInfoWindows: false
      }));
      this.directionsDisplay[i].setMap(this.map);
      let directionsService = new google.maps.DirectionsService;

      let request = {
        origin: { 'placeId': element.IdOrigemPlace },//new google.maps.LatLng(this.Origem.lat, this.Origem.lng),
        destination: { 'placeId': element.IdDestinoPlace },//new google.maps.LatLng(this.Destino.lat, this.Destino.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      }   
      let display = this.directionsDisplay[i];
      directionsService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          display.setDirections(result);
        }
      });

      i++;
    });


    this.setMinhasSolicitacoes(Solicitacao);
  }

  clearMap() {

    if (this.directionsDisplay != null && this.directionsDisplay != undefined) {

      this.directionsDisplay.forEach(element => {
        element.setMap(null);
        element = null;
      });

    }
  }

  getMinhasSolicitacoes() {
    this.showLoading();
    this.restProvider.getMinhasSolicitacoes(this.Solicitante.Id)
      .then(data => {
        this.loading.dismiss();

        this.TodasSolicitacoes = data;
        var Solicitacao = this.TodasSolicitacoes.filter(s => this.StatusPrinc.findIndex(x => x === s.Status) < 0);
        this.resumoStatus();
        this.setMinhasSolicitacoes(Solicitacao);

        
      });
  }
  setMinhasSolicitacoes(novasSolicitacoes) {
    this.MinhasSolicitacoes = novasSolicitacoes;
   
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
      dismissOnPageChange: false
    });
    this.loading.present();
  }

  buscarSolicitacaoAlterarStatus(Id, status) {
    this.showLoading();
    this.restProvider.getSolicitacao(Id)
      .then(data => {
        this.loading.dismiss();
        this.nav.push(AlterarStatusPage, { Dados: data, Status: status, User: this.Solicitante });
      });
  }

  tipoUser(item) {
    return (item.Aprovador == this.Solicitante.Nome)
  }

  userAprovador(item) {
    switch (item.Status) {

      case "aguardando": {
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[1], this.Status[2]]);
        break;
      }
      case "cancelado": {
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[3]]);
        break;
      }
      case "analisar_desvio": {
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[3]]);
        break;
      }

      default: {
        this.buscarSolicitacaoAlterarStatus(item.Id, []);
        break;
      }
    }

  }
  userSolicitante(item) {

    switch (item.Status) {

      case "nao_aprovado": {
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[3]]);
        break;
      }
      case "aprovado": {
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[4], this.Status[6]]);
        break;
      }
      case "viajando": {
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[3]]);
        break;
      }
      case "desvio_viagem": {
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[8]]);
        break;
      }
      case "encerrado": {
        this.buscarSolicitacaoAlterarStatus(item.Id, []);
        break;
      }
      case "expirado": {
        this.buscarSolicitacaoAlterarStatus(item.Id, []);
        break;
      }
      case "aguardando": {
        this.buscarSolicitacaoAlterarStatus(item.Id, []);
        break;
      }
      case "cancelado": {
        this.buscarSolicitacaoAlterarStatus(item.Id, []);
        break;
      }
      default: {
        this.buscarSolicitacaoAlterarStatus(item.Id, []);
        break;
      }
    }
  }

  itemSelected(item) {

    if (this.tipoUser(item)) {

      this.userAprovador(item)

    } else {

      this.userSolicitante(item)

    }
  }


  getTempoQueFalta(DataStr) {
    console.log(DataStr);
    let Data = new Date(DataStr.replace("Z", ""));
    var msecPerMinute = 1000 * 60;
    var msecPerHour = msecPerMinute * 60;
    var msecPerDay = msecPerHour * 24;

    let now = new Date();
    let interval = Data.getTime() - now.getTime();


    var days = Math.floor(interval / msecPerDay);
    interval = interval - (days * msecPerDay);

    // Calculate the hours, minutes, and seconds.  
    var hours = Math.floor(interval / msecPerHour);
    interval = interval - (hours * msecPerHour);

    var minutes = Math.floor(interval / msecPerMinute);
    interval = interval - (minutes * msecPerMinute);

    var seconds = Math.floor(interval / 1000);

    // Display the result.  
    return String(days + " Dias, " + hours + " Horas  e " + minutes + " Minutos ");

  }



}
