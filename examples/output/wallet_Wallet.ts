import { Cell, Slice, Address, Builder, beginCell, ComputeError, TupleItem, TupleReader, Dictionary, contractAddress, ContractProvider, Sender, Contract, ContractABI } from 'ton-core';
import { ContractSystem, ContractExecutor } from 'ton-emulator';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

export type Transfer = {
    $$type: 'Transfer';
    seqno: bigint;
    mode: bigint;
    to: Address;
    amount: bigint;
    body: Cell | null;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.seqno, 32);
        b_0.storeUint(src.mode, 8);
        b_0.storeAddress(src.to);
        b_0.storeCoins(src.amount);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    let _seqno = sc_0.loadUintBig(32);
    let _mode = sc_0.loadUintBig(8);
    let _to = sc_0.loadAddress();
    let _amount = sc_0.loadCoins();
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'Transfer' as const, seqno: _seqno, mode: _mode, to: _to, amount: _amount, body: _body };
}

function loadTupleTransfer(source: TupleReader) {
    let _seqno = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _to = source.readAddress();
    let _amount = source.readBigNumber();
    let _body = source.readCellOpt();
    return { $$type: 'Transfer' as const, seqno: _seqno, mode: _mode, to: _to, amount: _amount, body: _body };
}

export type TransferMessage = {
    $$type: 'TransferMessage';
    signature: Cell;
    transfer: Transfer;
}

export function storeTransferMessage(src: TransferMessage) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(123, 32);
        b_0.storeRef(src.signature);
        b_0.store(storeTransfer(src.transfer));
    };
}

export function loadTransferMessage(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 123) { throw Error('Invalid prefix'); }
    let _signature = sc_0.loadRef();
    let _transfer = loadTransfer(sc_0);
    return { $$type: 'TransferMessage' as const, signature: _signature, transfer: _transfer };
}

function loadTupleTransferMessage(source: TupleReader) {
    let _signature = source.readCell();
    const _transfer = loadTupleTransfer(source.readTuple());
    return { $$type: 'TransferMessage' as const, signature: _signature, transfer: _transfer };
}

async function Wallet_init(key: bigint, walletId: bigint) {
    const __init = 'te6ccgEBBgEAMwABFP8A9KQT9LzyyAsBAgFiAgMCAs4EBQAJoUrd4AUAAUgAH0cAPIzFUgUCPLH8v/yz/Jg=';
    const __code = 'te6ccgECLQEABF0AART/APSkE/S88sgLAQIBYgIDAgLLBAUCASAnKAIBzgYHAgEgDxAE9Tt+3Ah10nCH5UwINcLH94C0NMDAXGwwAGRf5Fw4gH6QCJQZm8E+GECjigw7UTQ1AH4YtMf0//TP1UgbBNVAvAfyPhCAcxVIFAjyx/L/8s/ye1U4CDAe+MCIMAAItdJwSGw4wLAAOMA7UTQ1AH4YtMf0//TP1UgbBNVAoAgJCgsACwgbvLQgIACiMO1E0NQB+GLTH9P/0z9VIGwTA9MfAcB78uCB1AHQAdMf0wf6QAEB+gDSAAGR1JJtAeJVQBBWNhB4EGdVBPAZyPhCAcxVIFAjyx/L/8s/ye1UAExb7UTQ1AH4YtMf0//TP1UgbBPwG8j4QgHMVSBQI8sfy//LP8ntVALyIPkBIILwhdKIOEwAQ0WLAoA8siBZ9ogDxVPDZWNENGRo2slh8ka6jihb7UTQ1AH4YtMf0//TP1UgbBPwGMj4QgHMVSBQI8sfy//LP8ntVNsx4CCC8A4jVyYQi1cA0Dad1xZ/av+4BqfgQFk3XdDg+ySXHnKyuuMCIAwNACjwGsj4QgHMVSBQI8sfy//LP8ntVABQW+1E0NQB+GLTH9P/0z9VIGwT8BzI+EIBzFUgUCPLH8v/yz/J7VTbMQHmgvBnJ9aXZfjyLHXFgeNWVEOX9aALuRvTLE0NltTJJoS8wrqOKFvtRNDUAfhi0x/T/9M/VSBsE/AdyPhCAcxVIFAjyx/L/8s/ye1U2zHggvCcoPGFUXTjLo/TeN9WpuT2xA5N/LYJDkmBL3seJiFL+brjAg4AUDDtRNDUAfhi0x/T/9M/VSBsE/AeyPhCAcxVIFAjyx/L/8s/ye1U2zECASAREgIBIBwdAgEgExQCASAYGQAVWUfwHKAOBwAcoAgCASAVFgH3MhxAcoBUAfwEXABygJQBc8WUAP6AnABymgjbrMlbrOxjj1/8BHIcPARcPARJG6zmX/wEQTwAVAEzJU0A3DwEeIkbrOZf/ARBPABUATMlTQDcPAR4nDwEQJ/8BECyVjMljMzAXDwEeIhbrOYf/ARAfABAcyUMXDwEeLJAYBcAHxwA8jMVSBQI8sfy//LP8mAABPsAAAVTAxgCASAaGwAFGwhgAAMW4AIBIB4fAgEgIiMCASAlIAIBICEkAI0VHQyU0PIVUBQRcsfEssHAc8WAfoCIW6zlX8BygDMlHAyygDiyfkAggC9EVF5+RAW8vSBRPZRSLoU8vQGpH9QdEMwbW3wEoAAbDD4QW8kXwOzkwKkAt6ACASAkJAIBICUmABk+EFvJF8Ds5MCpALegAAEgAAMMIAIBaikqAgEgKywAK7Ml+1E0NQB+GLTH9P/0z9VIGwT8BeAAK7B+O1E0NQB+GLTH9P/0z9VIGwT8BWAATbu9GCcFzsPV0srnsehOw51kqFG2aCcJ3WNS0rZHyzItOvLf3xYjmAAruASu1E0NQB+GLTH9P/0z9VIGwT8BaA==';
    const __system = 'te6cckECLwEABGcAAQHAAQEFoHL9AgEU/wD0pBP0vPLICwMCAWILBAIBIAgFAgEgBwYAK7gErtRNDUAfhi0x/T/9M/VSBsE/AWgATbu9GCcFzsPV0srnsehOw51kqFG2aCcJ3WNS0rZHyzItOvLf3xYjmAIBagoJACuwfjtRNDUAfhi0x/T/9M/VSBsE/AVgACuzJftRNDUAfhi0x/T/9M/VSBsE/AXgAgLLJQwCASAZDQIBIBIOAgEgEQ8CASAYEAADDCACASAUFAIBIBYTAgEgFRQAGT4QW8kXwOzkwKkAt6AAGww+EFvJF8Ds5MCpALegAgEgGBcAjRUdDJTQ8hVQFBFyx8SywcBzxYB+gIhbrOVfwHKAMyUcDLKAOLJ+QCCAL0RUXn5EBby9IFE9lFIuhTy9Aakf1B0QzBtbfASgAAEgAgEgHxoCASAeGwIBIB0cAAMW4AAFGwhgAAVTAxgCASAkIAIBICIhAB8cAPIzFUgUCPLH8v/yz/JgAfcyHEBygFQB/ARcAHKAlAFzxZQA/oCcAHKaCNusyVus7GOPX/wEchw8BFw8BEkbrOZf/ARBPABUATMlTQDcPAR4iRus5l/8BEE8AFQBMyVNANw8BHicPARAn/wEQLJWMyWMzMBcPAR4iFus5h/8BEB8AEBzJQxcPAR4skBgIwAE+wAAFVlH8BygDgcAHKAIAgHOJyYACwgbvLQgIAT1O37cCHXScIflTAg1wsf3gLQ0wMBcbDAAZF/kXDiAfpAIlBmbwT4YQKOKDDtRNDUAfhi0x/T/9M/VSBsE1UC8B/I+EIBzFUgUCPLH8v/yz/J7VTgIMB74wIgwAAi10nBIbDjAsAA4wDtRNDUAfhi0x/T/9M/VSBsE1UCgLi0pKAAo8BrI+EIBzFUgUCPLH8v/yz/J7VQC8iD5ASCC8IXSiDhMAENFiwKAPLIgWfaIA8VTw2VjRDRkaNrJYfJGuo4oW+1E0NQB+GLTH9P/0z9VIGwT8BjI+EIBzFUgUCPLH8v/yz/J7VTbMeAggvAOI1cmEItXANA2ndcWf2r/uAan4EBZN13Q4Psklx5ysrrjAiAsKgHmgvBnJ9aXZfjyLHXFgeNWVEOX9aALuRvTLE0NltTJJoS8wrqOKFvtRNDUAfhi0x/T/9M/VSBsE/AdyPhCAcxVIFAjyx/L/8s/ye1U2zHggvCcoPGFUXTjLo/TeN9WpuT2xA5N/LYJDkmBL3seJiFL+brjAisAUDDtRNDUAfhi0x/T/9M/VSBsE/AeyPhCAcxVIFAjyx/L/8s/ye1U2zEAUFvtRNDUAfhi0x/T/9M/VSBsE/AcyPhCAcxVIFAjyx/L/8s/ye1U2zEATFvtRNDUAfhi0x/T/9M/VSBsE/AbyPhCAcxVIFAjyx/L/8s/ye1UAKIw7UTQ1AH4YtMf0//TP1UgbBMD0x8BwHvy4IHUAdAB0x/TB/pAAQH6ANIAAZHUkm0B4lVAEFY2EHgQZ1UE8BnI+EIBzFUgUCPLH8v/yz/J7VSFzKAz';
    let systemCell = Cell.fromBase64(__system);
    let __tuple: TupleItem[] = [];
    __tuple.push({ type: 'cell', cell: systemCell });
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let initCell = Cell.fromBoc(Buffer.from(__init, 'base64'))[0];
    let system = await ContractSystem.create();
    let executor = await ContractExecutor.create({ code: initCell, data: new Cell() }, system);
    let res = await executor.get('init', __tuple);
    if (!res.success) { throw Error(res.error); }
    if (res.exitCode !== 0 && res.exitCode !== 1) {
        if (Wallet_errors[res.exitCode]) {
            throw new ComputeError(Wallet_errors[res.exitCode].message, res.exitCode, { logs: res.vmLogs });
        } else {
            throw new ComputeError('Exit code: ' + res.exitCode, res.exitCode, { logs: res.vmLogs });
        }
    }
    
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

const Wallet_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    17654: { message: `Invalid seqno` },
    48401: { message: `Invalid signature` },
}

export class Wallet implements Contract {
    
    static async init(key: bigint, walletId: bigint) {
        return await Wallet_init(key,walletId);
    }
    
    static async fromInit(key: bigint, walletId: bigint) {
        const init = await Wallet_init(key,walletId);
        const address = contractAddress(0, init);
        return new Wallet(address, init);
    }
    
    static fromAddress(address: Address) {
        return new Wallet(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: Wallet_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
}