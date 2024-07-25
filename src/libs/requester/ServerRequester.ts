import { Requester } from './Requester';

export class ServerRequester extends Requester {
  constructor() {
    super(process.env.API_SERVER_BASE_URL);
  }
}
