import { getNetworkByType, NetworkType } from "./network";
import axios from 'axios';

export interface GasPricesMap {
    uluna: string;
    usdr: string;
    uusd: string;
    ukrw: string;
    umnt: string;
    ueur: string;
    ucny: string;
    ujpy: string;
    ugbp: string;
    uinr: string;
    ucad: string;
    uchf: string;
    uaud: string;
    usgd: string;
    uthb: string;
    usek: string;
    unok: string;
    udkk: string;
    uidr: string;
    uphp: string;
    uhkd: string;
}

const GAS_PRICES_ENDPOINT: string = '/v1/txs/gas_prices';

export async function fetchGasPrices(networkType: NetworkType): Promise<GasPricesMap> {
    try {
        const network = getNetworkByType(networkType);
        const response = await axios.get<GasPricesMap>(`${network.fcd}${GAS_PRICES_ENDPOINT}`);
        return response.data;
    } catch (e) {
        throw new Error("Failed to fetch gas prices");
    }
}
