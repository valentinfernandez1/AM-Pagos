"use strict";
import Broker from "../rabbit/broker";
import consumer from './handler'

let rabbitClient: Broker;
let subscribed: boolean = false

export async function getClient() {
  if (!rabbitClient) {
    rabbitClient = await new Broker().init();
  }
  return rabbitClient;
}

export async function subscribe(queue) {
  (await getClient()).subscribe(queue, consumer)
  subscribed = true
  console.log('subscribed to rabbit')
}

export async function publish(queue, msg: string) {
  (await getClient()).publish(queue, msg);
}

export async function unsubscribe(queue) {
  (await getClient()).unsubscribe(queue)
  console.log('unsubscribed')
  subscribed = false
}

export function getStatus(): boolean {
  return subscribed
}