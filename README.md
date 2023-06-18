# MeiliXiu

## Test:
- Jest
- Mocha
- Jasmine
- Ava
- Tape

    ```javascript
    (base) 192:MeiliXiu gsq$ npm test

    > meilixiu@1.0.0 test
    > jest

    PASS  lib/__tests__/handlers.test.js
    ✓ Home Page Renders (2 ms)

    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        0.471 s
    Ran all test suites.
    ```
    & Coverage Test
    ```javascript
    (base) 192:MeiliXiu gsq$ npm test -- --coverage

    > meilixiu@1.0.0 test
    > jest "--coverage"

    PASS  lib/__tests__/handlers.test.js
    ✓ Home Page Renders (3 ms)
    ✓ About Page Renders With Rand (1 ms)
    ✓ 404 Page Renders
    ✓ 500 Page Renders (1 ms)

    ----------------|---------|----------|---------|---------|-------------------
    File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ----------------|---------|----------|---------|---------|-------------------
    All files       |     100 |      100 |     100 |     100 |                   
    handlers.js     |     100 |      100 |     100 |     100 |                   
    luckyNumber.js  |     100 |      100 |     100 |     100 |                   
    ----------------|---------|----------|---------|---------|-------------------
    Test Suites: 1 passed, 1 total
    Tests:       4 passed, 4 total
    Snapshots:   0 total
    Time:        0.535 s, estimated 1 s
    Ran all test suites.    
    ```