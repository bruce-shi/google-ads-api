"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const maps = __importStar(require("google-ads-node/build/lib/mapping"));
const index_1 = require("./index");
function unrollConstraintShorthand(constraint) {
    if (!constraint.key) {
        const key = Object.keys(constraint)[0];
        const val = constraint[key];
        if (lodash_1.isArray(val)) {
            return { key, op: 'IN', val };
        }
        return { key, op: '=', val };
    }
    return constraint;
}
function buildReportQuery(config) {
    let query = ``;
    let where_clause_exists = false;
    const attributes = config.attributes ? config.attributes.sort() : [];
    const metrics = config.metrics ? config.metrics.sort() : [];
    const segments = config.segments ? config.segments.sort() : [];
    const constraints = config.constraints || [];
    const normalised_constraints = Array.isArray(constraints)
        ? constraints.map((constraint) => {
            if (lodash_1.isString(constraint)) {
                return constraint;
            }
            return unrollConstraintShorthand(constraint);
        })
        : Object.keys(constraints).map(key => {
            const val = constraints[key];
            return unrollConstraintShorthand({ [key]: val });
        });
    /* ATTRIBUTES */
    const all_selected_attributes = attributes.concat(metrics, segments).join(', ');
    if (!all_selected_attributes) {
        throw new Error(`Must specify at least one field in "attributes", "metrics" or "segments"`);
    }
    query = `SELECT ${all_selected_attributes} FROM ${config.entity}`;
    /* Constraints */
    if (normalised_constraints && normalised_constraints.length > 0) {
        const constraints = formatConstraints(normalised_constraints);
        query += ` WHERE ${constraints}`;
        where_clause_exists = true;
    }
    /* Date Ranges */
    if (config.date_constant && (config.from_date || config.to_date)) {
        throw new Error('Use only one of "date_constant" OR ("from_date","to_date")');
    }
    if (config.from_date && !config.to_date) {
        const d = new Date();
        const today_string = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
        config.to_date = today_string;
    }
    else if (config.to_date && !config.from_date) {
        throw new Error('Expected start date range is missing - "from_date"');
    }
    /* Custom Date Range */
    if (config.from_date && config.to_date) {
        query += where_clause_exists ? ' AND ' : ' WHERE ';
        query += `segments.date >= '${config.from_date}' AND segments.date <= '${config.to_date}'`;
        where_clause_exists = true;
    }
    /* Predefined Date Constant */
    if (config.date_constant) {
        query += where_clause_exists ? ' AND ' : ' WHERE ';
        query += `segments.date DURING ${config.date_constant}`;
    }
    /* Order By */
    if (config.order_by) {
        query += formatOrderBy(config.entity, config.order_by, config.sort_order);
    }
    /* Limit To */
    if (config.limit && config.limit > 0) {
        query += ` LIMIT ${config.limit}`;
    }
    return query;
}
exports.buildReportQuery = buildReportQuery;
exports.verifyConstraintType = (key, constraint) => {
    if (!['number', 'string', 'boolean'].includes(typeof constraint)) {
        throw new Error(`The value of the constraint ${key} must be a string, number, or boolean. Here, typeof ${key} is ${typeof constraint}`);
    }
};
exports.addQuotesIfMissing = (constraint) => {
    const string_constraint = constraint.toString();
    if (string_constraint.startsWith(`'`) && string_constraint.endsWith(`'`)) {
        return string_constraint;
    }
    if (string_constraint.startsWith(`"`) && string_constraint.endsWith(`"`)) {
        return string_constraint;
    }
    return `"${string_constraint}"`;
};
const formatConstraints = (constraints) => {
    const formatConstraint = (constraint) => {
        if (lodash_1.isString(constraint)) {
            return constraint;
        }
        let key;
        let val;
        let op;
        if (!lodash_1.isUndefined(constraint.key) && !lodash_1.isUndefined(constraint.op) && lodash_1.isUndefined(constraint.val)) {
            throw new Error(`"val" cannot be undefined for the key "${constraint.key}" in constraints`);
        }
        if (lodash_1.isUndefined(constraint.key) || lodash_1.isUndefined(constraint.op) || lodash_1.isUndefined(constraint.val)) {
            throw new Error('must specify { key, op, val } when using object-style constraints');
        }
        key = constraint.key;
        op = constraint.op;
        val = constraint.val;
        if (lodash_1.isArray(constraint.val)) {
            if (constraint.val.length === 0) {
                val = `()`;
            }
            else {
                const vals = constraint.val
                    .map((v) => {
                    exports.verifyConstraintType(key, v);
                    let _v = translateEnumValue(key, v);
                    _v = exports.addQuotesIfMissing(_v);
                    return _v;
                })
                    .sort()
                    .join(`,`);
                val = `(${vals})`;
            }
        }
        else {
            exports.verifyConstraintType(key, val);
            val = translateEnumValue(key, val);
            val = exports.addQuotesIfMissing(val);
        }
        return `${key} ${op} ${val}`;
    };
    if (constraints instanceof Array) {
        return constraints
            .map(formatConstraint)
            .sort()
            .join(' AND ');
    }
    return constraints;
};
function translateEnumValue(key, value) {
    const enum_name = lodash_1.get(maps, key);
    if (enum_name && typeof value === 'number') {
        return getEnumString(enum_name, value);
    }
    return value;
}
exports.translateEnumValue = translateEnumValue;
const formatOrderBy = (entity, order_by, sort_order) => {
    if (!sort_order) {
        // If sort order is unspecified, all values are sorted in DESCending order.
        sort_order = 'DESC';
    }
    if (order_by instanceof Array) {
        order_by = order_by.map((key) => (!key.includes('.') ? `${entity}.${key}` : key)).join(', ');
    }
    else {
        order_by = !order_by.includes('.') ? `${entity}.${order_by}` : order_by;
    }
    return ` ORDER BY ${order_by} ${sort_order}`;
};
exports.formatQueryResults = (result) => {
    const parsed_results = [];
    for (const row of result) {
        const parsed_row = formatEntity(row);
        parsed_results.push(parsed_row);
    }
    return parsed_results;
};
const formatEntity = (entity, final = {}) => {
    for (const key in entity) {
        const underscore_key = exports.snakeCaseGads(key);
        const value = entity[key];
        if (lodash_1.isObject(value) && !Array.isArray(value)) {
            final[underscore_key] = formatEntity(value, final[underscore_key]);
        }
        else {
            final[underscore_key] = value;
        }
    }
    return final;
};
exports.fromMicros = (value) => value / 1000000;
exports.toMicros = (value) => value * 1000000;
exports.normaliseCustomerId = (id) => {
    if (id) {
        return id.split('-').join('');
    }
    return '';
};
/*
    lodash.snakeCase will convert headlinePart1 to headline_part_1,
    but we need headline_part1.
*/
exports.snakeCaseGads = (str) => {
    const snaked = lodash_1.snakeCase(str);
    const last_character = snaked[snaked.length - 1];
    if (!isNaN(+last_character)) {
        return snaked.slice(0, snaked.length - 2) + last_character;
    }
    return snaked;
};
function parseResult(rows) {
    return lodash_1.values(rows).map(convertFakeArrays);
}
exports.parseResult = parseResult;
function convertFakeArrays(o) {
    for (const key in o) {
        if (o[key] && typeof o[key] === 'object') {
            if (o[key]['0']) {
                o[key] = lodash_1.values(o[key]);
            }
            else {
                o[key] = convertFakeArrays(o[key]);
            }
        }
    }
    return o;
}
function getEnumString(type, value) {
    if (!index_1.enums.hasOwnProperty(type)) {
        throw new Error(`Could not find enum "${type}"`);
    }
    const e = index_1.enums[type];
    if (!e.hasOwnProperty(value)) {
        throw new Error(`Could not find value "${value}" on enum "${type}"`);
    }
    return e[value];
}
exports.getEnumString = getEnumString;
