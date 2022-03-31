import { Coin, Coins } from "@terra-money/terra.js";

export type BenchmarkMessages = {
    feeDenoms: string[],
    benchmarks: {
        contractAddress: string,
        msg: object,
        funds: {
            denom: string,
            amount: string,
        }[] | undefined,
    }[],
};

export function isValidBenchmark(messages: BenchmarkMessages): boolean {
    if (messages.benchmarks.length === 0) {
        return false;
    }

    return true;
}

export function convertToCoins(funds: {
    denom: string,
    amount: string,
}[] | undefined): Coins {
    const coins = new Coins({});

    if (typeof funds === 'undefined') {
        return coins;
    }

    funds.forEach((asset) => {
        const coin = Coin.fromString(`${asset.amount}${asset.denom}`);
        coins.set(coin.denom, coin.amount);
    });

    return coins;
}