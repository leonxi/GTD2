import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TdcPage } from './tdc';
import {TdcService} from "./tdc.service";
import {ScrollSelectComponent} from "../../components/scroll-select/scroll-select";
import {ScrollRangePickerComponent} from "../../components/scroll-range-picker/scroll-range-picker";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    TdcPage,
  ],
  imports: [
    IonicPageModule.forChild(TdcPage),
    PipesModule
  ],
  providers: [
    TdcService,
  ],
})
export class TdcPageModule {}
