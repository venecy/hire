import { parseError } from './index';

const fixtureStack = `TypeError: Error raised
  at bar http://192.168.31.8:8000/c.js:2:9
  at foo http://192.168.31.8:8000/b.js:4:15
  at calc http://192.168.31.8:8000/a.js:4:3
  at <anonymous>:1:11
  at http://192.168.31.8:8000/a.js:22:3
`;

const parsedFixtureStack = [
    {
        line: 2,
        column: 9,
        filename: 'http://192.168.31.8:8000/c.js'
    },
    {
        line: 4,
        column: 15,
        filename: 'http://192.168.31.8:8000/b.js'
    },
    {
        line: 4,
        column: 3,
        filename: 'http://192.168.31.8:8000/a.js'
    },
    {
        line: 22,
        column: 3,
        filename: 'http://192.168.31.8:8000/a.js'
    },
];

const fixtureFirefoxStack = `
  bar@http://192.168.31.8:8000/c.js:2:9
  foo@http://192.168.31.8:8000/b.js:4:15
  calc@http://192.168.31.8:8000/a.js:4:3
  <anonymous>:1:11
  http://192.168.31.8:8000/a.js:22:3
`;

const parsedFixtureFirefoxStack = [
    {
        line: 2,
        column: 9,
        filename: 'http://192.168.31.8:8000/c.js'
    },
    {
        line: 4,
        column: 15,
        filename: 'http://192.168.31.8:8000/b.js'
    },
    {
        line: 4,
        column: 3,
        filename: 'http://192.168.31.8:8000/a.js'
    },
    {
        line: 22,
        column: 3,
        filename: 'http://192.168.31.8:8000/a.js'
    },
];

const createAnError = (message: string, stack: string): Error => {
    const err = new Error(message);
    err.stack = stack;
    return err;
};

test('parse chrome error', () => {
    const message = 'mocked error in chrome';

    const err = createAnError(message, fixtureStack);

    const parsed = parseError(err);

    expect(parsed).toEqual({ message, stack: parsedFixtureStack });
});

test('parse firefox error', () => {
    const message = 'mocked error in firefox';

    const err = createAnError(message, fixtureFirefoxStack);

    const parsed = parseError(err);

    expect(parsed).toEqual({ message, stack: parsedFixtureFirefoxStack });
});
