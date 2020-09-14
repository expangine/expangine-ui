import { Component } from './Component';

export const ComponentRegistry: Record<string, Component<any, any, any>> = Object.create(null);