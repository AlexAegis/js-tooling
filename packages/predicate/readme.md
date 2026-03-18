# [@alexaegis/predicate](https://github.com/AlexAegis/common/tree/master/packages/predicate)

[![npm](https://img.shields.io/npm/v/@alexaegis/predicate/latest)](https://www.npmjs.com/package/@alexaegis/predicate)
[![ci](https://github.com/AlexAegis/common/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/common/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/402dd6d7fcbd4cde86fdf8e7d948fcde)](https://www.codacy.com/gh/AlexAegis/common/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/common&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/AlexAegis/common/branch/master/graph/badge.svg?token=kw8ZeoPbUh)](https://codecov.io/gh/AlexAegis/common)

Dead simple declarative predicates

```ts
import { and, equal, contains } from '@alexaegis/predicate';

const predicate = or(and(contains('fo'), contains('oo')), equal('bar'));

predicate('foo'); // true
predicate('bar'); // true
predicate('zed'); // false
```
