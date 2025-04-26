import { type ModuleThread, Thread, Worker, spawn } from "threads";
import type { EchoMethods } from "./echoWorker";

export class EchoThread {
  constructor(private thread: ModuleThread<EchoMethods>) {}

  static async create(): Promise<EchoThread> {
    const thread = await spawn<EchoMethods>(new Worker("./echoWorker"));
    return new EchoThread(thread);
  }

  echo(message: string) {
    return this.thread.echo(message);
  }

  dispose(): Promise<void> {
    return Thread.terminate(this.thread);
  }
}

export async function run(): Promise<void> {
  console.log("start");
  const echoThread = await EchoThread.create();

  const promises: Promise<unknown>[] = [];

  for (const i of [...Array(5).keys()]) {
    const p = echoThread.echo(i.toString()).then((message) => {
      console.log(message);
    });
    promises.push(p);
  }

  await Promise.all(promises);
  await echoThread.dispose();
  console.log("finish");
}
