import { Requester } from "./Requester";
import { getApiServerHost } from "./getApiHost";

export class ServerRequester extends Requester {
  constructor() {
    super(getApiServerHost());
  }
}
