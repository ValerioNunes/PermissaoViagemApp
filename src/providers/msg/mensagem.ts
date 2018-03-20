
import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';


@Injectable()
export class MensagemProvider {

constructor( 
            private  sms: SMS,
            private callNumber: CallNumber) { }


    
public SendSMS(Mensagem){

    var options={
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // Opens Default sms app
                 intent: '' // Sends sms without opening default sms app
            }
    }
   
    this.sms.send(Mensagem.Telefone, Mensagem.Texto, options);

}

 public LigarPara(Telefone){
    this.callNumber.callNumber(Telefone, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
 }



} 
