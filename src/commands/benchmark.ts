import type { Arguments, CommandBuilder } from 'yargs';
import ora from 'ora';
import { getNetworkByType, NetworkType } from '../services/terra/network';
import { AccAddress, MsgExecuteContract } from '@terra-money/terra.js';
import { BenchmarkMessages, convertToCoins, isValidBenchmark } from '../services/benchmarkMessages';
import { readFile, writeFile } from '../services/fs';
import { fetchGasPrices, GasPricesMap } from '../services/terra/gas';
import { createLCDClient } from '../services/terra/client';
const StringBuilder = require("string-builder");

type Options = {
    chainID: string,
    sender: string,
    messagesPath: string,
    outputPath: string | undefined,
}

export const command: string = 'bench <chainID> <sender> <messagesPath>';
export const desc: string = 'Benchmark provided contracts messages';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
        outputPath: { type: 'string' },
    })
    .positional('chainID', { type: 'string', demandOption: true })
    .positional('sender', { type: 'string', demandOption: true })
    .positional('messagesPath', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
    const spinner = ora({
        isSilent: false,
    });
    spinner.start('Benchmarking contracts.');

    const {
        chainID,
        sender,
        messagesPath,
        outputPath,
    } = argv;

    const networkType: NetworkType = (<any>NetworkType)[chainID];
    if (typeof networkType === 'undefined') {
        throw new Error("Unknown network type.\n Supported network types: 'columbus', 'bombay'");
    }

    if (!AccAddress.validate(sender)) {
        throw new Error("Provided address is an invalid Terra address");
    }

    const messages: BenchmarkMessages = readFile(messagesPath);
    if (!isValidBenchmark(messages)) {
        throw new Error("Provided benchmark file is not valid. Check the valid format");
    }

    const gasPricesMap: any = await fetchGasPrices(networkType);

    const fees: string[] = [];
    messages.feeDenoms.forEach((feeDenom: string) => {
        const gasPrice: string = gasPricesMap[feeDenom];
        const fee = `${gasPrice}${feeDenom}`;
        fees.push(fee);
    });

    const network = getNetworkByType(networkType);
    const terraClient = createLCDClient(networkType);

    const accountInfo = await terraClient.auth.accountInfo(sender);

    const sb = new StringBuilder();
    sb.appendFormat("Network: {0}\n", chainID);
    sb.appendLine();

    for (const benchmark of messages.benchmarks) {
        sb.appendFormat("Contract Address: {0}\n", benchmark.contractAddress);
        sb.appendFormat("ExecuteMsg: {0}\n", Object.keys(benchmark.msg)[0]);

        const executeMsg = new MsgExecuteContract(
            sender,
            benchmark.contractAddress,
            benchmark.msg,
            convertToCoins(benchmark.funds)
        );

        for (const fee of fees) {
            const txOptions = {
                msgs: [executeMsg],
                memo: undefined,
                gasPrices: fee,
                gasAdjustment: network.gasAdjustment,
            };

            const estimatedFee = await terraClient.tx.estimateFee(
                [
                    {
                        sequenceNumber: accountInfo.getSequenceNumber(),
                        publicKey: accountInfo.getPublicKey(),
                    },
                ],
                txOptions,
            );

            const data = estimatedFee.toData();
            sb.appendFormat("\tGas usage in {0}: {1}\n", data.amount[0].denom, data.amount[0].amount);
            sb.appendFormat("\tGas Limit: {0}\n", data.gas_limit);
            sb.appendFormat("\tGas Adjustment: {0}\n", network.gasAdjustment);
        }

        sb.appendLine();
    }
    spinner.succeed();

    const outputFilePath: string = (typeof outputPath === 'undefined') ? './results' : outputPath;
    spinner.start(`Writing results to output file located at ${outputFilePath}.`);
    writeFile(outputFilePath, sb.toString());
    spinner.succeed();
}

