require("dotenv").config();
const amqp = require("amqplib");
const _ = require("lodash");
import client, { Connection, Channel } from "amqplib";
const rabitHost = process.env.RABBIT_URL || "amqp://localhost:5672";
class Broker {
  queues: {};
  connection: Connection;
  channel: Channel;
  handler: any;
  constructor() {
    this.queues = {};
  }

  async init() {
    try {
      this.connection = await amqp.connect(rabitHost);
      console.log(`rabbit connected to ${rabitHost}`);

      return this;
    } catch (err) {
      console.log(err);
      console.log(`error rabbit connecting to ${rabitHost}`);
    }
  }

  async createEx({ name, type, durable = true }) {
    if (!this.connection) await this.init();
    return this;
  }

  /**
   * Send message to an exchange
   *
   */
  async publish(queue, msg) {
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(msg));
  }

  /**
   * @param {Object} - object defining queue name and bindingKey
   * @param {Function} handler Handler that will be invoked with given message and acknowledge function (msg, ack)
   */
  async subscribe(queue, handler) {
    this.channel = await this.connection.createChannel();
    await this.channel.prefetch(1);
    await this.channel.assertQueue(queue);
    await this.channel.consume(queue, handler(this.channel));
    this.handler = handler;
  }

  async unsubscribe(queue) {
    _.pull(this.queues[queue], this.handler);
    // await this.channel.deleteQueue(queue)
    await this.channel.close();
    // await this.connection.close()
  }
}

export default Broker;
