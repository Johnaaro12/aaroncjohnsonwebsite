# Development Standards

**By Aaron Johnson** · Last updated February 2026

Standards and conventions for ServiceNow development across our platform team.

---

## Naming Conventions

### Scripts

All custom scripts should follow this pattern:

| Type | Pattern | Example |
|------|---------|---------|
| Script Include | PascalCase | `UserProvisioningUtils` |
| Business Rule | snake_case with prefix | `br_incident_auto_assign` |
| Client Script | cs_ prefix | `cs_validate_phone_format` |
| Fix Script | fix_ prefix with date | `fix_20260301_cleanup_orphaned_cis` |

### Update Sets

Format: `PROJ-XXX_short_description`

- Always include the story number
- Use underscores, no spaces
- Keep it under 80 characters
- Example: `STRY0089_incident_sla_redesign`

---

## Code Standards

### GlideRecord Best Practices

**Always do:**
```javascript
// Use setValue() for setting fields
gr.setValue('state', 6);

// Use query limits when you only need one record
gr.setLimit(1);

// Initialize with table name
var gr = new GlideRecord('incident');
```

**Never do:**
```javascript
// Don't use dot-walking to set values
gr.state = 6; // BAD - use setValue()

// Don't query without conditions in server scripts
gr.query(); // BAD if no addQuery — will return entire table

// Don't use getRowCount() for existence checks
if (gr.getRowCount() > 0) // BAD - use gr.hasNext() instead
```

### Error Handling

Always wrap integration calls in try/catch:

```javascript
try {
    var response = new sn_ws.RESTMessageV2('My_Integration', 'get');
    var result = response.execute();
    var httpStatus = result.getStatusCode();
    
    if (httpStatus != 200) {
        gs.error('Integration failed with status: ' + httpStatus);
    }
} catch (ex) {
    gs.error('Integration exception: ' + ex.getMessage());
}
```

---

## Peer Review Checklist

Before requesting review, confirm:

- [ ] No hardcoded sys_ids
- [ ] No `gs.log()` in production code (use `gs.debug()` or `gs.error()`)
- [ ] Script includes have JSDoc comments
- [ ] Business rules have descriptions
- [ ] ATF test exists for new functionality
- [ ] Update set is complete and properly named
- [ ] No unnecessary global scope usage

---

## Deployment Process

1. Complete development in your personal dev instance
2. Move update set to **Test** → validate
3. Peer review (minimum 1 approver)
4. Move to **Stage** → full regression test
5. CAB approval for production deployment
6. Deploy during maintenance window

> **Rule:** Never skip the stage environment. No exceptions.