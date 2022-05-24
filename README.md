# Token Convertor Subgraph
This Subgraph sources events from contracts of [Token-Convertor](https://github.com/octopus-network/nep141-token-convertor) on NEAR chain.


# GraphQL API
https://api.thegraph.com/subgraphs/name/hsxyl/convertor

# Example Query
Here we have an example query for getting ConversionPools:
```graphql
{
  conversionPools(
      orderBy: in_token_balance, 
      orderDirection: desc
  ) {
    id
    creator
    in_token
    in_token_balance
    out_token
    out_token_balance
    reversible
    out_token_rate
  }
}
```
Here is the response for the query above: 

```graphql
{
  "data": {
    "conversionPools": [
      {
        "id": "7",
        "creator": "xsb.testnet",
        "in_token": "usdc.fakes.testnet",
        "in_token_balance": "100000",
        "out_token": "usdt.fakes.testnet",
        "out_token_balance": "900000",
        "reversible": false,
        "out_token_rate": 1
      },
      {
        "id": "6",
        "creator": "xsb.testnet",
        "in_token": "usdt.fakes.testnet",
        "in_token_balance": "0",
        "out_token": "usdc.fakes.testnet",
        "out_token_balance": "100000",
        "reversible": false,
        "out_token_rate": 1
      },
      {
        "id": "13",
        "creator": "xsb.testnet",
        "in_token": "usdc.fakes.testnet",
        "in_token_balance": "0",
        "out_token": "usdt.fakes.testnet",
        "out_token_balance": "0",
        "reversible": false,
        "out_token_rate": 1
      }
    ]
  }
}
```
