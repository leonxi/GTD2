import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";

/**
 * 闹铃
 */
@Injectable()
export class RemindSqliteService {

  constructor(private baseSqlite: BaseSqliteService) {

  }

}
