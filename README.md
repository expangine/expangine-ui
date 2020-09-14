# expangine-ui

The core framework for creating user interfaces with Expangine.

## Use

A designer will allow an interface to be developed through dragging and dropping components.
Components can be layouts, inputs, and more complex objects like charts, tables, canvas, and utilities that communicate with browser functions.
Components have... 
- Attributes which define their behavior and appearance which take Expressions.
- Events that are emitted when something happens with the component.
- Slots that can have components dropped into them. Inside a slot the components could have access to special variables.
- An internal state.
- A name other components can refer to it by.

## Status

This library is a work in progress, and has the following work to do:
- [ ] Custom components will trigger an event by setting `emit.eventName` to the event value.
- [ ] Modifications to the DOM should be queued and processed at the end frame.
- [ ] Triggering custom component events should be queued (created, updated, initial, changed, update).

## Context

Components have access to the following variables in expressions:

- `page`: The type defined for the interface
- `refs`: The map of named components
- `this`: The reference to this component and it's state
- `item`: If inside a :for directive, this is the current one
- `index`: If inside a :for directive, this is the index
- `[attribute]`: An attribute in a component
- `[slot]`: A variable given in a slot

## Syntax

The following examples show how the supported components and directives are used.

#### DOM Element
```ts
['div', { class: 'btn' }, { click: Expression }, [
  // components
]]
```

#### If
```ts
[':if', { condition: Expression }, {}, [
  // components
]]
```

#### Show
```ts
[':show', { condition: Expression }, {}, [
  // components
]]
```

#### Hide
```ts
[':hide', { condition: Expression }, {}, [
  // components
]]
```

#### For
```ts
[':for', { items: Expression, key: Expression, item?: string, index?: string }, {}, [
  // components that can see item & index
]]
```

#### Slot
```ts
[':slot', { name: Expression, scope: { scopeVar: 10 } }, {}, [
  // components that can see scope
]]
```

## Example

Here's an example of a simple component:

```ts
export const HtmlInput: Component<{
  type: string,
  value: string,
}> = {
  name: 'input',
  collection: 'html',
  attributes: {
    type: Types.enumForText(['text', 'password', 'number', 'date']),
    value: Types.text(),
  },
  render: (i) => ['input', {
    type: Exprs.get('type'),
    value: Exprs.get('value'),
  }],
};

ComponentRegistry['html/input'] = HtmlInput;
```

And an example of a chart component:

```ts
export const PieChart: Component<{
  title: string,
  label: string,
  value: string,
  data: Array<{label: string, value: number, color?: string, offset?: number}>,
}, { 
  updated: null,
}> = {
  name: 'pie',
  collection: 'googlecharts',
  attributes: {
    title: Types.text(),
    label: Types.text(),
    value: Types.text(),
    data: Types.list(Types.object({ 
      label: Types.text(), 
      value: Types.number(),
      color: Types.optional(Types.color()),
      offset: Types.number(0, 1),
    })),
  },
  events: {
    updated: Types.null(),
  },
  render: () => ['div'],
  created: (i, e) => {
    i.update();
  },
  updated: (i, e) => {
    const google = (window as any).google;

    google.charts.setOnLoadCallback(() => {
      const chart = i.cache.chart || new google.visualization.PieChart(e[0]);
      const [data, label, value, title] = [
        i.scope.get('data'), 
        i.scope.get('label'), 
        i.scope.get('value'), 
        i.scope.get('title'),
      ];
      
      const chartData = ([[label, value]] as Array<[string, any]>).concat(data.map((p) => [p.label, p.value]));

      const options = {
        title,
        slices: {} as any,
      };

      data.forEach((point, pointIndex) => {
        options.slices[pointIndex] = {
          offset: point.offset,
          color: point.color,
        };
      });

      const chartTable = google.visualization.arrayToDataTable(chartData);

      chart.draw(chartTable, options);

      i.cache.chart = chart;
      i.cache.options = options;

      i.trigger('updated', null);
    });
  },
};

ComponentRegistry['googlecharts/pie'] = PieChart;
```