# Scripting & Development

---

## Overview

Advanced server-side and client-side scripting across the ServiceNow platform.

## Server-Side

- **GlideRecord** — CRUD operations, encoded queries, aggregate queries
- **Script Includes** — Reusable server logic, classless and class-based
- **Business Rules** — Before, after, async, and display rules
- **GlideAjax** — Client-to-server communication
- **Scripted REST APIs** — Custom API endpoints

## Client-Side

- **Client Scripts** — onChange, onLoad, onSubmit, onCellEdit
- **UI Policies** — Field visibility, mandatory, read-only
- **UI Actions** — Custom buttons and context menu items
- **g_form / g_list** — Client-side API usage

## Code Standards

```javascript
// Always use setValue() over dot notation
gr.setValue('state', 6); // ✓
gr.state = 6;           // ✗

// Always check .get() return value
var gr = new GlideRecord('incident');
if (gr.get(sysId)) {
    // safe to use gr
}

// Use GlideAggregate for counts
var ga = new GlideAggregate('incident');
ga.addAggregate('COUNT');
ga.query();
// Never use getRowCount() for this
```

## Key Principles

> Write server-side code by default. Only use client scripts when you need immediate UI feedback. Every client script is a potential performance hit.