export interface INetworkInfo {
    id: number;
    name: string;
    network: string;
    apiid: string;
    apikey: string;
    tracking: string;
    network_id: number;
    info: {
        api_email: string;
        api_key: string;
        api_domain: string;
        idfa: string;
        gaid: string;
        ip: string;
        agent: string;
        appname: string;
        bundleid: string;
        aff_source: string;
        click_id: string;
        rateprivate: number;
    };
    mapping: any;
    data: {
        sync_status: number;
        sync_status_exists: number;
        sync_status_old: any;
        sync_rate: number;
        sync_param: any;
        min_payout: any;
        check_duplicate: number;
        ignore_empty_country: number;
        ignore_empty_os: number;
        check_except_country: number;
        check_except_name: number;
        page_size: number;
    };
    lastsync: string;
    status: number;
}

export interface IOffer {
    offer: IOfferInfo;
    offer_geo: IOfferGeo;
    offer_url: OfferURI;
    offer_platform: IOfferPlatform;
}
export interface OfferURI {
    type: string;
    name: string;
    tracking_link: string;
    preview_url: string;
    conversion_protocol: number;
}
export interface IOfferInfo {
    id: number;
    name: string;
    status: string;
    category: any;
    offer_approval: number;
    offer_approval_msg: string;
    tracking_link: string;
    end_date: number;
    pricing_type: string;
    payout: number;
    percent_payout: null;
    preview_url: string;
    currency: string;
    conversion_protocol: number;
    conversion_protocol_msg: string;
    thumbnail: string;
    app_id: string;
    impression_pixel: string;
}
export interface IOfferGeo {
    type: number;
    target: IGEO[];
}
export interface IGEO {
    country: string;
    country_code: string;
    id: number;
    regions: [];
    cities: [];
}
export interface IOfferPlatform {
    id: number;
    offer_id: number;
    platform: string;
    system: string;
    version: [];
    is_above: number
}