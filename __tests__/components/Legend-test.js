// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import Legend from '../../src/js/components/Legend';

// needed because this:
// https://github.com/facebook/jest/issues/1353
jest.mock('react-dom');

describe('Legend', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <Legend series={[
        {
          "continent": "NorthAmerica",
          "label": "North America",
          "value": 40,
          "colorIndex": "graph-1"
        },
        {
          "continent": "SouthAmerica",
          "label": "South America",
          "value": 30,
          "colorIndex": "accent-2"
        },
        {
          "continent": "Europe",
          "label": "Europe",
          "value": 20,
          "colorIndex": "unset"
        },
        {
          "continent": "Africa",
          "label": "Africa",
          "value": 10,
          "colorIndex": "graph-2"
        },
        {
          "continent": "Asia",
          "label": "Asia",
          "value": 15,
          "colorIndex": "graph-3"
        },
        {
          "continent": "Australia",
          "label": "Australia",
          "value": 10,
          "colorIndex": "graph-4"
        }
      ]} units="B" />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // should properly calculate total
    expect(component.getInstance()._seriesTotal()).toBe(125);
  });
});
