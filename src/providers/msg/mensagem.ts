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
        this.emailComposer.addAlias('gmail', 'com.google.android.gm');
        this.emailComposer.isAvailable().then((available: boolean) =>{
        if(available) {
            let email = {
                to: 'valerio.nunes@vale.com',
                cc: 'valeriobsno@gmail.com',
                bcc: ['john@doe.com', 'jane@doe.com'],
                attachments: [],
                subject: 'Solicitação de Viagem',
                body: 'Você tem uma Solicitação para Analise!',
                isHtml: true
            }; 
            this.emailComposer.open(email);
            //Now we know we can send
        }
        });
    }
    
public SendSMS(Mensagem){

    var options={
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // Opens Default sms app
                 intent: '' // Sends sms without opening default sms app
            }
    }
    
    this.sms.send(Mensagem.Telefone,Mensagem.Texto,options)

}

 public LigarPara(Telefone){
    this.callNumber.callNumber(Telefone, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
 }



} 
