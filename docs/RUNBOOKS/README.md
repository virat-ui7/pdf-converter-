# Runbooks

Troubleshooting guides for common issues in FileConverter platform.

## Available Runbooks

All runbooks are located in `docs/MONITORING_AND_ALERTING.md` (Part 4).

### Critical Runbooks

1. **Conversion Success Rate Dropped** - When format pair success rate < 90%
2. **Worker Unresponsive** - When workers stop processing jobs
3. **Queue Backing Up** - When queue depth > 1000 jobs
4. **High Error Rate (5xx)** - When 5xx errors > 1% of traffic
5. **Database Connection Issues** - When database pool exhausted

### High Priority Runbooks

6. **File Validation Rejecting Legitimate Files** - When validation rejection rate > 20%
7. **Suspicious Validation Failures** - When possible attack detected
8. **Rate Limit Breach** - When single user submits > 100 jobs in 5 minutes
9. **Worker Job Timeout Risk** - When conversion duration approaching timeout
10. **Zero Byte Output Files** - When conversions complete but output is 0 bytes

### Medium Priority Runbooks

11. **High API Response Time** - When P95 latency > 60 seconds

## Using Runbooks

1. **Identify the Issue:** Check alerts or monitoring dashboard
2. **Find the Runbook:** Match alert to runbook
3. **Follow Steps:** Execute steps in order
4. **Verify Resolution:** Check metrics and logs
5. **Document:** Update runbook if needed

## Runbook Format

Each runbook includes:
- **Alert Name:** Which alert triggers this runbook
- **Steps:** Step-by-step troubleshooting
- **Expected Resolution Time:** How long it should take
- **Escalation:** When to escalate to team lead

## Contributing

If you find a new issue or improve a runbook:
1. Document the issue and solution
2. Add to `docs/MONITORING_AND_ALERTING.md`
3. Test the runbook in staging
4. Update this README

---

**Last Updated:** 2025-12-15

