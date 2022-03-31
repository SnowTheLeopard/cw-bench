import { LCDClient } from '@terra-money/terra.js';
import { getNetworkByType, NetworkType } from './network';

export function createLCDClient(networkType: NetworkType): LCDClient {
    const network = getNetworkByType(networkType);

    return new LCDClient({
        URL: network.lcd,
        chainID: network.id,
    });
}
