import { assert } from "console"

export interface VizProps {
    xKeys: string[],
    yKeys: string[]
}

export interface Agg {
    select: string,
    where: string,
    groupby: string,
}

export interface AggViz {
    agg: Agg,
    vizProps: VizProps,
}

export interface Sample {
    select: string,
    where: string,
    limit: string,
}

export class Select {
    col: string = ""
    operator: string = ""
    alias: string = ""

    constructor(col: string, operator: string, alias: string) {
        this.col = col
        this.operator = operator
        this.alias = alias.length > 0 ? alias : col
    }

    toQuery() {
        return `${this.operator}(${this.col}) AS ${this.alias}`
    }
}

export interface Filter {
    col: string, // column name
    predicate: string // '> 0', 'not null'
}


export interface AggV2 {
    select: Array<Select>,
    where: Array<Filter>,
    groupBy: Array<string>,
}

export interface SampleV2 {
    select: Array<Select>,
    where: Array<Filter>,
    limit: number
}