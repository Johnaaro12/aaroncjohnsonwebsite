# GlideRecord Patterns

**By Aaron Johnson** · Last updated January 2026

Common GlideRecord recipes and patterns I use regularly. Copy-paste friendly.

---

## Basic Query

```javascript
var gr = new GlideRecord('incident');
gr.addQuery('state', 1); // New
gr.addQuery('priority', '<=', 2); // Critical or High
gr.orderByDesc('sys_created_on');
gr.setLimit(10);
gr.query();

while (gr.next()) {
    gs.info(gr.number + ' | ' + gr.short_description);
}
```

---

## Encoded Query (Faster for Complex Filters)

```javascript
var gr = new GlideRecord('incident');
gr.addEncodedQuery('active=true^priority=1^assigned_toISEMPTY');
gr.query();
// Returns all active P1 incidents with no assignee
```

> **Tip:** Build your filter in the list view, then right-click the breadcrumb → "Copy query" to get the encoded query string.

---

## Aggregate Query (Don't Load Full Records)

```javascript
var ga = new GlideAggregate('incident');
ga.addQuery('active', true);
ga.addAggregate('COUNT');
ga.groupBy('category');
ga.query();

while (ga.next()) {
    gs.info(ga.category + ': ' + ga.getAggregate('COUNT'));
}
```

**Why this matters:** GlideAggregate runs at the database level. If you're counting or summing, never load full records with GlideRecord — it's orders of magnitude slower.

---

## Safe Update Pattern

```javascript
function closeIncident(incidentSysId) {
    var gr = new GlideRecord('incident');
    if (gr.get(incidentSysId)) {
        gr.setValue('state', 7); // Closed
        gr.setValue('close_code', 'Solved (Permanently)');
        gr.setValue('close_notes', 'Resolved via automation');
        gr.setWorkflow(false); // Skip business rules if needed
        gr.update();
        return true;
    }
    return false;
}
```

---

## Anti-Patterns to Avoid

### 1. Querying inside a loop

```javascript
// BAD — N+1 query problem
var incidents = new GlideRecord('incident');
incidents.query();
while (incidents.next()) {
    var user = new GlideRecord('sys_user');
    user.get(incidents.assigned_to); // Query per row!
}
```

```javascript
// GOOD — Use dot-walking or GlideRecord with IN clause
var incidents = new GlideRecord('incident');
incidents.query();
while (incidents.next()) {
    gs.info(incidents.assigned_to.name); // Dot-walk, no extra query
}
```

### 2. Using getRowCount() for existence checks

```javascript
// BAD — loads entire result set to count
if (gr.getRowCount() > 0) { ... }

// GOOD — stops at first match
gr.setLimit(1);
gr.query();
if (gr.hasNext()) { ... }
```