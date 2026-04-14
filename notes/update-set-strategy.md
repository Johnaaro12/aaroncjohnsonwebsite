# Update Set Strategy

**By Aaron Johnson** · Last updated December 2025

How we manage, name, and promote update sets across environments.

---

## Naming Convention

```
STRY0072023_community_connect_rebuild
```

Format: `{STORY_NUMBER}_{short_description}`

- Always tie to a story or task number
- Use underscores, no spaces
- Lowercase everything
- Keep under 80 characters total

---

## Environment Flow

```
DEV → TEST → STAGE → PROD
```

| Environment | Purpose | Who Promotes |
|-------------|---------|-------------|
| DEV | Active development | Developer |
| TEST | QA validation | Developer |
| STAGE | UAT + regression | Release Manager |
| PROD | Live | Release Manager (CAB approved) |

---

## Rules

1. **One update set per story** — don't mix work from different stories
2. **Never batch unrelated changes** — it makes rollback impossible
3. **Complete your update set** before promoting — incomplete sets cause preview errors
4. **Document everything** in the update set description field

---

## Handling Conflicts

When you get preview errors:

1. **Missing dependency** — The target instance is missing a record your update set references. Fix: promote the dependency first, or accept the remote update.
2. **Collision** — Someone else modified the same record. Fix: review both changes, decide which wins, document why.
3. **Scope mismatch** — You're promoting a global update to a scoped app instance. Fix: verify your app scope before developing.

> **Golden rule:** If you're not sure about a conflict, don't skip it. Ask the team.