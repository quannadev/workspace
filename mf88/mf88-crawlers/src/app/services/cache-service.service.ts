import * as Redis from 'ioredis';
import {Config} from '@foal/core';
import {LoggerService} from './logger-service.service';
import {IPublisher} from '../models/Publisher.model';
import {PublisherService} from './publisher-service.service';
import {INetworkInfo} from "../models";

export enum RedisKey {
    publisher = 'publisher',
    networks = 'networks'
}

export class CacheService {
    private static instance: CacheService;
    private readonly client: Redis.Redis;
    private readonly cacheTime: number = Number(process.env.CACHETIME) || 2 * 60 *60;
    private logger: LoggerService;

    constructor() {
        this.logger = LoggerService.init();
        const uri = process.env.REDIS_HOST || Config.get<string>('redis.uri'); // Config.get<string>('redis.uri');
        this.client = new Redis(uri, {
            keyPrefix: process.env.REDIS_PREFIX || Config.get<string>('redis.prefix'),
        });
        this.client.on('connect', () => {
            this.logger.print('Redis connected');
            new PublisherService().getListPublisher().then();
        });
        this.client.on('error', e => {
            this.logger.error('redis error:' + e.message);
            process.exit(1);
        });

    }

    static init() {
        if (!this.instance) {
            this.instance = new CacheService();
        }
        return this.instance;
    }

    async setPublishers(data: IPublisher[]) {
        for (const item of data) {
            await this.client.hset(RedisKey.publisher, String(item._id), JSON.stringify(item));
        }
    }

    async getListPublishers(): Promise<IPublisher[]> {
        const cache = await this.client.hgetall(RedisKey.publisher);
        const list = Array.of<IPublisher>();
        if (cache) {
            Object.values(cache).forEach(item => list.push(JSON.parse(item)))
        }
        return list
    }

    async getPublisherId(id: string): Promise<IPublisher | null> {
        const cache = await this.client.hget(RedisKey.publisher, id);
        if (cache) {
            return JSON.parse(cache) as IPublisher
        }
        return null
    }

    async setNetworks(publishId: string, data: INetworkInfo[]) {
        for (const item of data) {
            await this.client.hset(RedisKey.networks, `${publishId}_${item.id}`, JSON.stringify(item));
        }
        await this.client.hset(RedisKey.networks, publishId, JSON.stringify(data));
        await this.client.expire(RedisKey.networks, this.cacheTime);
    }

    async getNetworkByPid(publishId: string): Promise<INetworkInfo[] | null> {
        const cache = await this.client.hget(RedisKey.networks, publishId);
        if (cache) {
            return JSON.parse(cache) as INetworkInfo[]
        }
        return null
    }
    async getNetworkByNId(pId: string, nId: number) {
        const cache = await this.client.hget(RedisKey.networks, `${pId}_${nId}`);
        if (cache) {
            return JSON.parse(cache) as INetworkInfo;
        }
    }
}
