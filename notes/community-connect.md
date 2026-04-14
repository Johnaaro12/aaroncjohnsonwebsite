# Community Connect

**By Aaron Johnson** · Last updated March 2026

If the user is community connect it gets pushed from IIQ to us (so cyber needs to do it).

---

## Overview

Scheduled Import runs, either daily or full sync. Uses the data stream as a data source to pull user information from Radiant Logic. SCIM protocol inserts the source to the Sys User table.

**Story:** [STRY0072023](https://example.com) — IIQ Decommission and sync rebuild

**Update Set:** `community_connect_v2_rebuild`

---

## Data Flow

**Data Stream:** Get Community Connect User Data

**Inputs:**
- Full Sync (True/False)

**Preprocessing:**

- **Outputs:**
  - `outputs.pagesize` = system property (`x_inthe_radiant.page_size`)
  - `outputs.filter`
    - Full sync: no filter if full sync
    - Not full sync: filters for records changed in the last 2 days

---

## Scheduled Import Configuration

| Setting | Value |
|---------|-------|
| Table | sys_user |
| Data Source | Radiant Logic SCIM |
| Frequency | Daily at 2:00 AM CT |
| Full Sync | Sundays only |

---

## Transform Map

The transform map handles field mapping from the SCIM payload to `sys_user`:

```javascript
// onBefore transform script
(function runTransformScript(source, map, log, target) {
    
    // Skip inactive users
    if (source.u_active == 'false') {
        ignore = true;
        return;
    }
    
    // Set the source field
    target.source = 'Community Connect';
    
})(source, map, log, target);
```

### Field Mapping

| Source Field | Target Field | Coalesce |
|-------------|-------------|----------|
| userName | user_name | Yes |
| displayName | name | No |
| emails[0].value | email | No |
| active | active | No |
| department | department | No |

---

## Troubleshooting

### Common Issues

1. **Duplicate users created** — Check that `user_name` coalesce is enabled on the transform map
2. **Missing department** — Department must exist in `cmn_department` before import
3. **Sync not running** — Verify the scheduled job is active and the MID server is online

### Useful Scripts

Check last import status:
```javascript
var gr = new GlideRecord('sys_import_set_run');
gr.addQuery('set', 'YOUR_IMPORT_SET_SYS_ID');
gr.orderByDesc('sys_created_on');
gr.setLimit(5);
gr.query();
while (gr.next()) {
    gs.info(gr.sys_created_on + ' | ' + gr.state + ' | Rows: ' + gr.rows_inserted + '/' + gr.rows_updated);
}
```

---

## Related Links

- [Radiant Logic Documentation](https://example.com)
- [ServiceNow SCIM Docs](https://docs.servicenow.com)
- [Import Set Best Practices](https://example.com)