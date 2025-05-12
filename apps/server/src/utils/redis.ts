import { createClient, RedisClientType } from 'redis';
import { isJsonString } from './string';

export class RedisCache {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });

    this.client.on('error', console.error);
    this.client.on('connect', () => console.log(`Connected to redis server on port ${process.env.REDIS_PORT}`));
    this.client.connect();
  }

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (!this.client) {
      return await fetcher();
    }

    return new Promise(async resolve => {
      const data = await this.client.get(key);

      if (!data) {
        const result = await fetcher();
        if (result) {
          await this.client.set(key, JSON.stringify(result), { EX: +process.env.REDIS_TTL! });
        }
        return resolve(result);
      }

      return resolve(isJsonString(data) ? JSON.parse(data) : data);
    });
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async flush() {
    await this.client.flushAll();
  }
}

export default new RedisCache();
