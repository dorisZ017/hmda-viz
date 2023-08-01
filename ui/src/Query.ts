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

