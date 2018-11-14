import * as React from "react";
import Select from "react-select";

import Parser from "../core/Parser";
import Random from "../core/Random";
import { extractFeatureProperty } from "../core/Utils";
import World from "../core/World";

function expandValues(value: any): any {
    if (Array.isArray(value)) {
        return value.map((v) => ({ label: v, value: v }));
    }

    return { label: (value || "none"), value };
}

function expandFeature(value: any, isMulti: boolean): any {
    if (isMulti) {
        return (value || []).map((v: any) => ({ label: extractFeatureProperty(v, "name"), value: v }));
    }

    return { label: (value ? extractFeatureProperty(value, "name") : "none"), value };
}

function flattenValues(value: any): any {
    if (Array.isArray(value)) {
        if (value.length === 1) {
            return value[0].value;
        }

        return value.map((v) => v.value);
    }

    if (value.value) {
        return value.value;
    }

    return value;
}

export default class FormGenerator {
    public static expressionToForm(name: string, rootExpr: string, defaultValue: any, world: World, selectValue: any): any {
        const root = rootExpr.split("=>");
        const meta = root[1] ? root[0].trim().split("|") : "";
        const label = (meta[0] || name).trim();
        const options = (meta[1] || "").trim().split(",");
        const expr = (root[1] || root[0]).trim();

        if (expr.indexOf("[") === 0) {
            const start = expr.indexOf("[") + 1;
            const end = expr.indexOf("]");
            const part = expr.substring(start, end);
            const args = part.split(" to ").map((s) => Number(s));

            return <div key={name}>
                <label>{label} ({args[0]} to {args[1]})</label>
                <input defaultValue={String(defaultValue)} onChange={(event) => selectValue(name, Number(event.target.value))} key={name} type="number" min={args[0]} max={args[1]}/>
            </div>;
        } else if (expr.startsWith("pick(")) {
            const argsStart = expr.indexOf("(") + 1;
            const argsEnd = expr.indexOf(")");
            const argsValue = Parser.parsePickArgs(expr.substring(argsStart, argsEnd));
            const resultsValue = expr.substring(argsEnd + 2).split(",").map((s) => s.trim());
            const possibleValues: any = resultsValue.map((value: string) => ({ value, label: value }));

            if (options.includes("nullable")) {
                possibleValues.push({ label: "none", value: null });
            }

            return <div key={name}>
                <label>{label} ({typeof argsValue === "object" ? `${argsValue.min} to ${argsValue.max}` : argsValue})</label>
                <Select
                    defaultValue={expandValues(defaultValue)}
                    className="select"
                    isSearchable={false}
                    onChange={(value) => selectValue(name, flattenValues(value))}
                    isMulti={argsValue !== 1}
                    key={name}
                    options={possibleValues} />
            </div>;
        } else if (expr.startsWith("pick_feature(")) {
            const argsStart = expr.indexOf("(") + 1;
            const argsEnd = expr.indexOf(")");
            const argsValue = Parser.parsePickArgs(expr.substring(argsStart, argsEnd));
            const selector = expr.substring(argsEnd + 2).split(",").map((s) => s.trim());
            const features = world.getFeatures(selector);
            const possibleValues: any = features.map((value: string[]) => ({ value, label: extractFeatureProperty(value, "name") }));

            if (options.includes("nullable")) {
                possibleValues.push({ label: "none", value: null });
            }

            return <div key={name}>
                <label>{label} ({typeof argsValue === "object" ? `${argsValue.min} to ${argsValue.max}` : argsValue})</label>
                <Select
                    defaultValue={expandFeature(defaultValue, argsValue !== 1)}
                    className="select"
                    isSearchable={false}
                    onChange={(value) => selectValue(name, flattenValues(value))}
                    isMulti={argsValue !== 1}
                    key={name}
                    options={possibleValues} />
            </div>;
        } else if (expr === "seed()") {
            return <div key={name}>
                <label>{label}</label>
                <input type="text" defaultValue={defaultValue} onChange={(event) => selectValue(name, event.target.value)} key={name} />
            </div>;
        }

        return <div key={name}></div>;
    }

}
