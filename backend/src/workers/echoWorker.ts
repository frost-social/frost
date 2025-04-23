import { expose } from "threads";
import { sleep } from "../core/sleep";

const echoMethods = {
  async echo(message: string) {
    await sleep(3000 + Math.random() * 3000);
    return message;
  }
};
expose(echoMethods);

export type EchoMethods = typeof echoMethods;
