# Playwright quick start 

This short template sets up a small repo that allows you to run against multiple environments while specifying what user to log in as. 

## How to run

interactive mode:  
```bash
npm t
```

arguments: (ignoring the warning that this is not a module in the package.json)
```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON runner.ts -u standard_user -c productPageTests.config.ts -s headless
```
or 
```bash
npm t -- --user user_name --config config_name -s headed
```

## What you get to do
Write tests :)

Put the tests into the e2e/tests folder (nest them in organized folders)
add configs in `./configs` following the format:

```ts
import { defineConfig } from '@playwright/test';
import baseConfig from './base.config';

export default defineConfig({
	...baseConfig,
	testMatch: [
		'tests/path_to_tests/testname.spec.ts',
		'tests/path_to_tests/othertest.spec.ts',
	]
});
```

This way, you can group tests together easily. e.g. smoke tests, nightly tests, and so on.


### Setting up users and passwords
Locally, a password will be read from a `.env` file but you should have secrets in Github, CircleCI, or Gitlab when running the tests.
The config in `e2e/configs` is read, the user_name you set when starting the tests is the key on the object. This way, you can get the vital information for your test run.

### use the test file
The password for the saucelabs page is secret_sauce

