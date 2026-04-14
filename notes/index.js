/* ═══════════════════════════════════════════
   NOTES INDEX
   ═══════════════════════════════════════════
   
   To add a new note:
   1. Create a .md file in the /notes/ folder
   2. Add an entry below with title, description, and the filename
   
   That's it. The site handles the rest.
   
   ═══════════════════════════════════════════ */

const NOTES_INDEX = [
  {
    title: "Community Connect Integration",
    description: "SCIM-based user sync from Radiant Logic to ServiceNow via scheduled imports.",
    file: "community-connect.md",
  },
  {
    title: "Development Standards",
    description: "Coding conventions, naming standards, and best practices for our ServiceNow team.",
    file: "development-standards.md",
  },
  {
    title: "GlideRecord Patterns",
    description: "Common GlideRecord recipes, performance tips, and anti-patterns to avoid.",
    file: "gliderecord-patterns.md",
  },
  {
    title: "Update Set Strategy",
    description: "How we manage update sets, naming conventions, and promotion workflows.",
    file: "update-set-strategy.md",
  },
];