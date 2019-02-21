import { Component } from "@blendsdk/core";

/**
 * Function signature for a component event handler
 */
export type TComponentEventHandler = (sender: Component, ...args: any[]) => any;

/**
 * Function signature for a controller reference
 */
export type TComponentReference = (component: Component) => void;
