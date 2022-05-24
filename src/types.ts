import {JSONValue} from "@graphprotocol/graph-ts";

export class ConversionPoolDTO {
	id: string
	creator: string
	in_token: string
	in_token_balance: string
	out_token: string
	out_token_balance: string
	reversible: boolean
	in_token_rate: u64
	out_token_rate: u64
	deposit_near_amount: string

	constructor(
		id: string,
		creator: string,
		in_token: string,
		in_token_balance: string,
		out_token: string,
		out_token_balance: string,
		reversible: boolean,
		in_token_rate: u64,
		out_token_rate: u64,
		deposit_near_amount: string) {
		this.id = id;
		this.creator = creator;
		this.in_token = in_token;
		this.in_token_balance = in_token_balance;
		this.out_token = out_token;
		this.out_token_balance = out_token_balance;
		this.reversible = reversible;
		this.in_token_rate = in_token_rate;
		this.out_token_rate = out_token_rate;
		this.deposit_near_amount = deposit_near_amount;
	}

	static fromJSON(data: JSONValue): ConversionPoolDTO {
		let dataObj = data.toObject();
		return new ConversionPoolDTO(
			dataObj.get("id")!.toString(),
			dataObj.get("creator")!.toString(),
			dataObj.get("in_token")!.toString(),
			dataObj.get("in_token_balance")!.toString(),
			dataObj.get("out_token")!.toString(),
			dataObj.get("out_token_balance")!.toString(),
			dataObj.get("reversible")!.toBool(),
			dataObj.get("in_token_rate")!.toU64(),
			dataObj.get("out_token_rate")!.toU64(),
			dataObj.get("deposit_near_amount")!.toString(),
		)
	}
}

