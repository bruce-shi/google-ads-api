import { ReportOptions, ConstraintValue } from './types';
export declare function buildReportQuery(config: ReportOptions): string;
export declare const verifyConstraintType: (key: string, constraint: any) => void;
export declare const addQuotesIfMissing: (constraint: ConstraintValue) => string;
export declare function translateEnumValue(key: string, value: ConstraintValue): ConstraintValue;
export declare const formatQueryResults: (result: object[]) => object[];
export declare const fromMicros: (value: number) => number;
export declare const toMicros: (value: number) => number;
export declare const normaliseCustomerId: (id: string | undefined) => string;
export declare const snakeCaseGads: (str: string) => string;
export declare function parseResult(rows: any): any[];
export declare function getEnumString(type: string, value: number): string;
