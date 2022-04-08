// import { Injectable } from '@nestjs/common';
// import { IPushConnector } from '../push-connector.interface';
// import { IMessage } from '../../../../infrastructure/connection';
//
// import admin from 'firebase-admin';
//
// @Injectable()
// export class FirebaseConnectorService implements IPushConnector {
//   async send(deviceId: string, message: IMessage) {
//     admin
//       .messaging()
//       .sendToDevice(deviceId, {
//         notification: {
//           title: message.title,
//           body: message.body,
//         },
//       })
//       .then((r) => console.log(r))
//       .catch((r) => console.log(r))
//       .finally(() => console.log('Пуш отработал'));
//   }
// }
