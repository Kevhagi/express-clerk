# Performance Monitoring Guide

This application now includes comprehensive performance monitoring to help you identify slow endpoints and optimize your API performance.

## Features

### Real-time Request Logging
Every request is logged with execution time, HTTP status, and performance indicators:

- 🟢 **Green**: Fast requests (< 100ms)
- 🟠 **Orange**: Moderate requests (100-500ms)  
- 🟡 **Yellow**: Medium requests (500ms-1s)
- 🔴 **Red**: Slow requests (≥ 1s)





## Configuration

### Environment Variables

```bash
# Enable detailed logging (includes IP, User-Agent, Content-Length)
PERFORMANCE_DETAILED_LOGGING=true

# Log all requests (not just slow ones)
PERFORMANCE_LOG_ALL=true
```

### Default Behavior
- **Without environment variables**: Only logs requests ≥ 500ms
- **With `PERFORMANCE_LOG_ALL=true`**: Logs all requests
- **With `PERFORMANCE_DETAILED_LOGGING=true`**: Includes additional request details

## Usage





### Console Output Examples

#### Request Logging
```
🟡 [2024-01-15T10:30:45.123Z] GET /api/transactions - 750ms - Status: 200
🔴 [2024-01-15T10:31:12.456Z] POST /api/transactions - 1500ms - Status: 201
⚠️  SLOW REQUEST DETECTED: POST /api/transactions took 1500ms
```



## Performance Thresholds

| Color | Time Range | Description |
|-------|------------|-------------|
| 🟢 | < 100ms | Excellent performance |
| 🟠 | 100-500ms | Good performance |
| 🟡 | 500ms-1s | Moderate performance |
| 🔴 | ≥ 1s | Poor performance - investigate |

## Best Practices

1. **Monitor Console Logs**: Watch for performance indicators in real-time
2. **Investigate Red Requests**: Any request ≥ 1s should be investigated
3. **Environment Tuning**: Adjust logging levels based on your needs

## Troubleshooting



### Log Volume
If logs become too verbose:
- Remove `PERFORMANCE_LOG_ALL=true`
- Keep only `PERFORMANCE_DETAILED_LOGGING=true` for detailed analysis

## Integration with Existing Monitoring

This performance monitoring can be integrated with:
- Application Performance Monitoring (APM) tools
- Log aggregation services (ELK stack, Splunk)
- Metrics collection systems (Prometheus, Grafana)
- Alerting systems for slow request thresholds
