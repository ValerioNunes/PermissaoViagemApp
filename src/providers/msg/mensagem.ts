import { EmailComposer } from '@ionic-native/email-composer';
import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';


@Injectable()
export class MensagemProvider {

constructor(private emailComposer: EmailComposer, 
            private  sms: SMS,
            private callNumber: CallNumber) { }

     
public SendEmail(){
    this.emailComposer.isAvailable().then( () => {
        // the promise is resolving in this function, so sending is available
        this.emailComposer.open( {
            to: 'valerio_breno@hotmail.com',
            subject: 'valerio_breno@hotmail.com',
            body: 'App Ionic Teste',
            isHtml: false
        } );
    }, () => {
        // the promise is being rejected here, sending is not available
        // do some sort of error code
    } );
    }
    
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
