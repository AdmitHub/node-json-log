# Node Json Log

This package standardizes the formatters, loggers, serializers, and middleware
AdmitHub uses to extract useful data into Logs.

Based on practices laid out in [Logging Best Practices](https://admithubteam.atlassian.net/wiki/spaces/ENG/pages/671744015/Logging+Strategy+Page)

### Custom logger
- Provides a `logger.report` function which automatically sends to both `logger.error` and Sentry
- Attaches `sentry_id` to any log message which was also reported to Sentry
- Simplifies error handling, so there is a single correct way of doing it which is quick and easy
- DataDog tracing information is attached to every payload

### Serializers
- Ensures any request, response passed into it is properly formatted with
  - The duration of the request
  - The Headers and Cookies used in this request
- Ensures any error passed into it is properly formatted with stacktraces and other information

### Installer
- Handles initializing Raven and handling any connection or other errors

# Usage
- Install, which is handled via `installLogger`. This will install Raven and handle hooking it up to environment variables and logging
- Logger, which is used via `createLogger` key from `require('node-json-log')`
```javascript
const logger = require('node-json-log').createLoger()

try {
  throw new Error('test')
} catch (err) {
  logger.report({ err, scope: 'testing.example' }, 'Just an example')
}

logger.info({ scope: 'testing.success' }, 'Example succeeded')
```
# Build

### Requirements

```
node v14.16.1
```
### Run
```
npm run build
```

# Test

Tests are written using Jest

To run tests run command
```
npm run test
```
