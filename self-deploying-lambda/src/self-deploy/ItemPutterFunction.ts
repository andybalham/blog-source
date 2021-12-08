/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import SelfDeployFunction from './package/SelfDeployFunction';
import SelfDeployTable from './package/SelfDeployTable';

interface ItemPutterServices {
  testTable: SelfDeployTable;
}

export default class ItemPutterFunction extends SelfDeployFunction<ItemPutterServices> {
  async handleEventAsync(event: any): Promise<any> {
    this.services.testTable.putAsync({
      Item: {
        PK: nanoid(),
        SK: DateTime.now().toSeconds(),
        ...event,
      },
    });
  }
}
