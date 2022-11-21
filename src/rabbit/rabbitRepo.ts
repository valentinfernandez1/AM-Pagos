"use strict";
import Broker from "../rabbit/broker";

let rabbitClient: Broker;
let subscribed: boolean = false;

export async function getClient() {
  if (!rabbitClient) {
    rabbitClient = await new Broker().init();
  }
  return rabbitClient;
}

export async function publish(queue, msg: string) {
  (await getClient()).publish(queue, msg);
}

export async function unsubscribe(queue) {
  (await getClient()).unsubscribe(queue);
  console.log("unsubscribed");
  subscribed = false;
}

export function getStatus(): boolean {
  return subscribed;
}
