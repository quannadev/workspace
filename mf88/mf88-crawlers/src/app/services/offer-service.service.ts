import wretch, {Wretcher} from 'wretch';
import {PublisherService} from './publisher-service.service';
import {LoggerService} from './logger-service.service';
import {CacheService} from './cache-service.service';
import {INetworkInfo, IOffer} from '../models';


export class OfferService {
    private client: Wretcher;
    private publisherService: PublisherService;
    private logger: LoggerService;
    private cache: CacheService;

    constructor() {
        this.logger = LoggerService.init();
        this.cache = CacheService.init();
        this.client = wretch().polyfills({
            fetch: require('node-fetch')
        });
        this.publisherService = new PublisherService();
    }

    async doGetOffers(network: INetworkInfo, query: string) {
        return this.client.url(`http://${network.info.api_domain}?${query}`).get()
            .json(data => data)
            .catch(err => {
                this.logger.error(`getOffers ${network.name} Error`, err);
            });
    }

    async getNetworks(publisherId: string, forceCache?: boolean): Promise<INetworkInfo[]> {
        if (forceCache) {
            const publisher = await this.publisherService.getPublisherById(publisherId);
            if (publisher) {
                return this.client.url(`${publisher.api}/getnetwork.php`).get()
                    .json(data => {
                        const list = Object.values(data);
                        list.map(item => {
                            const network = item;
                            // return JSON.parse(item) as INetworkInfo;
                            network.info = JSON.parse(item.info);
                            network.data = JSON.parse(item.data);
                            return network as INetworkInfo;
                        });
                        this.cache.setNetworks(publisherId, list).then();
                        return list;
                    })
                    .catch(err => {
                        this.logger.error(`GetNetwork ${publisher.name} Error`, err);
                        return []
                    });
            }
            return []
        }
        const cache = await this.cache.getNetworkByPid(publisherId);
        if (cache) {
            return cache;
        } else {
            return this.getNetworks(publisherId, true)
        }

    }

    async getOffers(publisherId: string, networkId: number, queryFilters: any): Promise<IOffer[]> {
        const network = await this.cache.getNetworkByNId(publisherId, networkId);
        if (network) {
            let query = '';
            if (queryFilters) {
                query = this.queryBuilder(queryFilters, network.network);
            }
            let uri = `http://${network.info.api_domain}`;
            let baseAuth = '';
            switch (network.network) {
                case 'Offerslook':
                    uri = uri.concat(`/aff/v1/offers?${query}`);
                    baseAuth = 'Basic ' + Buffer.from(network.info.api_email + ':' + network.info.api_key).toString('base64');
                    break;
                default:
                    uri = uri.concat(`/3.0/offers?${query}`);
                    break
            }
            return this.client.url(uri, true)
                .auth(baseAuth)
                .get()
                .unauthorized(_ => this.logger.error('getOffers UnAuth'))
                .badRequest(_ => this.logger.error('getOffers badRequest'))
                .json(item => {
                    if (item.code == 0) {
                        const data = item.data;
                        return Array.from<IOffer>(data.rowset);
                    }
                    this.logger.error(JSON.stringify(item))
                    return []
                }).catch(err => {
                    this.logger.error(`getOffers ${network.name} Error ${err}`, err);
                    return []
                })
        }
        return []
    }

    queryBuilder(q: any, name: string): string {
        let query = '';
        switch (name) {
            case 'Offerslook':
                if (q.limit && q.page){
                    query = `?limit=${q.limit}&type=personal&sort=-id&offset=${q.page}&`;
                }else {
                    query = '?limit=100&type=personal&sort=-id&offset=1&';
                }
                if (q.pricing_type) {
                    query = query.concat(`filters[pricing_type][EQUAL_TO]=${q.pricing_type}`);
                }
                if (q.geo_country) {
                    query = query.concat(`&filters[geo_country][EQUAL_TO]=${q.geo_country}`)
                }
                if (q.offer_platform) {
                    query = query.concat(`&filters[offer_platform][EQUAL_TO]=${q.offer_platform}`)
                }
                break;
            default:
                break;
        }

        return query;
    }

}
