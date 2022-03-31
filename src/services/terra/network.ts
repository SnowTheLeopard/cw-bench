export enum NetworkType {
    columbus = 'columbus-5',
    bombay = 'bombay-12',
}

export interface Network {
    id: string,
    lcd: string,
    fcd: string,
    gasAdjustment: number,
}

export const Networks: Record<NetworkType, Network> = <const>{
    [NetworkType.columbus]: {
        id: 'columbus-5',
        lcd: 'https://lcd.terra.dev',
        fcd: 'https://fcd.terra.dev',
        gasAdjustment: 1.75,
    },
    [NetworkType.bombay]: {
        id: 'bombay-12',
        lcd: 'https://bombay-lcd.terra.dev',
        fcd: 'https://bombay-fcd.terra.dev',
        gasAdjustment: 1.75,
    },
};

export function getNetworkByType(networkType: NetworkType): Network {
    return Networks[networkType];
}
