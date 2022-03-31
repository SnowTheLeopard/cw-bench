# cw-bench

cw-bench is a tool to benchmark Terra CW Smart-Contracts.

## Usage

Create a json file with messages to benchmark.

NOTE: Contracts for benchmark must be deployed on chain and specified messages must execute with no errors otherwise you will get an error.

Input file example:
```json
{
    "feeDenoms": ["uusd", "uluna"],
    "benchmarks": [
        {
            "contractAddress": "terra1tz4hl2wlle44u24kk5f3040gxgw7ral6urc78w",
            "msg": {
                "transfer": {
                    "recipient": "terra1fxr0yyngkmcg8c4lr3jt822kpwk3ae3zmhrncf",
                    "amount": "100"
                }
            }
        },
        {
            "contractAddress": "terra1tz4hl2wlle44u24kk5f3040gxgw7ral6urc78w",
            "msg": {
                "send":{
                   "contract":"terra1nr4kmf2x4dc6j65zhknnk9p32w307zu07jt4xs",
                   "amount":"1000000",
                   "msg":"ewogICAgInN0YWtlIjogewogICAgICAgICJzdGFrZV90eXBlIjogewogICAgICAgICAgICAidW5sb2NrZWQiOiB7fQogICAgICAgIH0KICAgIH0KfQ=="
                }
             }
        }
    ]
}
```

To execute this benchmarks use following command:

`cw-bench bench bombay terra1kzz9askwhrd2v58ulkhch0qzynrxp03qd5tfgk ./benches.json --outputPath ./results`

CLI Args:
```
cw-bench bench <chainID> <sender_addr> <path_to_benchmarks>

Supported chains: bombay(testnet), columbus(mainnet)
```

Output after performing benchmarks:
```
Network: bombay

Contract Address: terra1tz4hl2wlle44u24kk5f3040gxgw7ral6urc78w
ExecuteMsg: transfer
	Gas usage in uusd: 26149
	Gas Limit: 174324
    Gas Adjustment: 1.75
	Gas usage in uluna: 1976
	Gas Limit: 174324
    Gas Adjustment: 1.75

Contract Address: terra1tz4hl2wlle44u24kk5f3040gxgw7ral6urc78w
ExecuteMsg: send
	Gas usage in uusd: 47281
	Gas Limit: 315201
    Gas Adjustment: 1.75
	Gas usage in uluna: 3572
	Gas Limit: 315201
    Gas Adjustment: 1.75
```
