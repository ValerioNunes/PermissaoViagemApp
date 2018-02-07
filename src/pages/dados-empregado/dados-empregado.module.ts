import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DadosEmpregadoPage } from './dados-empregado';
import { BrMaskerModule } from 'brmasker-ionic-3';

export class BrModel {
  mask: string;
  len: number;
  person: boolean;
  phone: boolean;
  money: boolean;
}

@NgModule({
  declarations: [
    DadosEmpregadoPage,
  ],
  imports: [
    IonicPageModule.forChild(DadosEmpregadoPage),
    BrMaskerModule
  ],
})
export class DadosEmpregadoPageModule {}
