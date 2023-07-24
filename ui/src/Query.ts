import { assert } from "console"

export interface Query {
    select: string,
    where: string,
    groupby: string,

}

export interface Filter {
    attribute: string,
    operator: Operator,
    value: string
}

export enum Operator {
    ">",
    ">=",
    "<",
    "<=",
    "!=",
    "=",
    "IN",
    "NOT IN"
}

export enum Stats {
    "avg",
    "median",
    "min",
    "max",
    "std",
    none = ""
}
