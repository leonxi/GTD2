import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MPage } from './m';
import { CalendarModule } from "../../components/ion2-calendar";
import {MService} from "./m.service";

@NgModule({
  declarations: [
    MPage,
  ],
  imports: [
    IonicPageModule.forChild(MPage),
    CalendarModule
  ],
  entryComponents: [
    MPage,
  ],
  providers: [
    MService,
  ],
})
export class MPageModule {}