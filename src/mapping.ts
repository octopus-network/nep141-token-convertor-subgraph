import {near, BigInt, log, JSONValue, json, Bytes, store} from "@graphprotocol/graph-ts";
import {ConversionPool } from "../generated/schema";
import {ConversionPoolDTO} from "./types";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
    let actions = receipt.receipt.actions;
    let signerId = receipt.receipt.signerId.toString();
    let contractId = receipt.receipt.predecessorId.toString();
    let receiverId = receipt.receipt.receiverId.toString();
    log.info('------start signerId={}, contract={}, receiver={}, block={}--------', [signerId, contractId, receiverId, receipt.block.header.height.toString()])

    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (action.kind == near.ActionKind.FUNCTION_CALL) {
            handleFunctionCall(action.toFunctionCall(), receipt)
        }
    }
    log.info('--------------end---------', [])
}

function handleFunctionCall(functionCall: near.FunctionCallAction, receipt: near.ReceiptWithOutcome): void {
    log.info("start handleFunctionCall", []);
    let outcome = receipt.outcome;

    for (let i = 0; i < outcome.logs.length; i++) {
        let outcomeLog = outcome.logs[i];
        log.info('receipt.outcome.log[{}]= {}',[i.toString(),outcomeLog.toString()])
        if (outcomeLog.startsWith("EVENT_JSON:")) {
            outcomeLog = outcomeLog.replace("EVENT_JSON:", "");
            let bytes = Bytes.fromUTF8(outcomeLog)
            const jsonObject = json.fromBytes(bytes).toObject();
            // const jsonObject = json.fromString(outcomeLog);

            if(jsonObject.get("pool_event")) {
                handlePoolEvent(
                    jsonObject.get("pool_event")!.toString(),
                    jsonObject.get("data")!,
                )
            }
        }
    }
    log.info("end handleFunctionCall", []);
}

function handlePoolEvent(event: string, data: JSONValue): void {
    log.info("start handlePoolEvent",[]);

    if(event=="create_pool") {
        handleCreatePool(data);
    } else if (event=="update_pool") {
        handleUpdatePool(data);
    } else if (event=="delete_pool") {
        handleDeletePool(data);
    }

    log.info("end handlePoolEvent",[]);
}


function handleCreatePool(data: JSONValue): void {
    log.info("start handleCreatePool.", []);
    // let poolDTO = parseAsCreatePool(data);
    let poolDTO = ConversionPoolDTO.fromJSON(data.toObject().get("pool")!)
    let pool = new ConversionPool(poolDTO.id);
    pool.creator = poolDTO.creator;
    pool.out_token = poolDTO.out_token;
    pool.in_token = poolDTO.in_token;
    pool.reversible = poolDTO.reversible;
    pool.out_token_rate = poolDTO.out_token_rate as i32;
    pool.in_token_rate = poolDTO.in_token_rate as i32;
    pool.deposit_near_amount = BigInt.fromString(poolDTO.deposit_near_amount);
    pool.save();

    log.info("end handleCreatePool", []);
}

function handleUpdatePool(data: JSONValue): void {
    log.info("start handleUpdatePool.", []);
    // let updatePool = parseAsUpdatePool(data);
    let poolDTO = ConversionPoolDTO.fromJSON(data.toObject().get("pool")!);
    let conversionPool = ConversionPool.load(poolDTO.id);
    if(conversionPool) {
        conversionPool.in_token_balance = BigInt.fromString(poolDTO.in_token_balance);
        conversionPool.out_token_balance = BigInt.fromString(poolDTO.out_token_balance);
        conversionPool.save();
    } else {
        log.warning("The updated #{}pool not exist, create a pool now.", [poolDTO.id])
        let pool = new ConversionPool(poolDTO.id)
        pool.creator = poolDTO.creator;
        pool.out_token = poolDTO.out_token;
        pool.out_token_balance = BigInt.fromString(poolDTO.out_token_balance);
        pool.in_token = poolDTO.in_token;
        pool.in_token_balance = BigInt.fromString(poolDTO.in_token_balance);
        pool.reversible = poolDTO.reversible;
        pool.out_token_rate = poolDTO.out_token_rate as i32;
        pool.in_token_rate = poolDTO.in_token_rate as i32;
        pool.deposit_near_amount = BigInt.fromString(poolDTO.deposit_near_amount);
        pool.save();
    }

    log.info("end handleUpdatePool", []);
}

function handleDeletePool(data: JSONValue): void {
    log.info("start handleDeletePool", []);
    let pool_id = data.toObject().get("pool_id")!.toString()
    if(ConversionPool.load(pool_id)) {
        store.remove("ConversionPool", pool_id.toString())
    } else {
        log.error("Try to delete the #{} pool not exist in the graph.", [pool_id.toString()])
    }
    log.info("end handleDeletePool", []);
}
