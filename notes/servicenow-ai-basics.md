# ServiceNow AI — Complete Reference

**By Aaron Johnson** · Last updated April 2026

Everything you need to know about AI in ServiceNow — from foundational concepts to Now Assist, AI Agents, Skill Kit, NLU vs LLM, and where it all fits together.

---

## AI Fundamentals

### Artificial Intelligence (AI)
AI is a broad discipline used throughout IT to describe any attempt to replicate human or near-human intelligence in machines. In ServiceNow's context, AI powers everything from predictive intelligence to generative content creation.

### Machine Learning (ML)
ML applies advanced AI using data and algorithms to create **data models** — mathematical expressions that approximate relationships between variables and enable prediction. ServiceNow uses ML in Predictive Intelligence for auto-categorization, assignment, and priority prediction.

### Deep Learning
A subset of ML based on **neural networks** — layered structures of connected nodes that learn patterns from data.

**Neural Network Structure:**

| Layer | Purpose |
|-------|---------|
| Input Layer | Where data enters — each neuron represents an input feature |
| Hidden Layers | Process and transform data via mathematical functions (the "deep" in deep learning) |
| Output Layer | Produces the prediction or classification |

**How it learns:**
- **Weights and Biases** — Connections between neurons with adjustable strength
- **Activation Functions** — Introduce non-linearity (sigmoid, ReLU) so the network can model complex relationships
- **Forward Propagation** — Data passes through layers, generating an output
- **Loss Function** — Measures how far the prediction is from truth
- **Backpropagation** — Adjusts weights using gradient descent to reduce error

### Generative AI
Designed to create new content by learning from existing data.

**What it generates:**
- **Language** — Text, notes, code, summaries, essays
- **Visuals** — Images, videos, 3D models, graphs
- **Audio** — Music, speech synthesis

**Limitations to be aware of:**
- Difficulty adapting to truly novel circumstances
- Harmful bias inherited from training data
- Confidential data risk — input data may be used in model training
- Lack of transparency (black box problem)
- Cybersecurity attack surface
- Hallucinations — confident but incorrect answers

---

## ServiceNow AI Architecture

### Now Assist
ServiceNow's generative AI experience — an integrated suite of AI features embedded across the entire platform.

**Core capabilities:**

| Capability | What It Does | Where It's Used |
|-----------|-------------|-----------------|
| Incident/Case Summarization | Auto-summarizes task records | Now Assist Panel, context menu |
| Generative Search | Better, faster answers from AI-powered search | Portal, Virtual Agent, search |
| Code Generation | Generates and explains code on the Now Platform | Flow Designer, Script Editor |
| Resolution Notes | Auto-generates close notes from work notes | Incident, Case, HR Case |
| GenAI Controller | Embeds generative AI into workflows and VA topics | Flow Designer, Virtual Agent |
| Now Assist Panel | Side panel for agents to interact with AI | Agent Workspace, Platform UI |

---

### Now Assist Skill Kit

The Skill Kit is a **developer toolkit** for building custom AI-powered capabilities (skills) that plug into the Now Assist interface.

**What it is:**
- A framework for creating custom AI skills with specific inputs, outputs, and business logic
- Skills appear alongside built-in Now Assist capabilities — users get one unified interface

**What you can build:**
- Specific question answering
- Custom summarization for your org's terminology
- Automated categorization and assignment routing
- Generate catalog questions specific to the situation
- Anything the out-of-box skills don't cover

**Key concepts:**

```
Skill Kit Anatomy:
├── Prompt Template      ← Instructions for the LLM
├── Input Parameters     ← What data the skill receives
├── Output Format        ← How results are structured
├── Data Sources         ← Tables, APIs, knowledge bases
└── Model Provider       ← Which LLM to use
```

**Model options (as of Q1 2026):**
- `llm_generic_small` — ServiceNow Small Language Model v1.0
- `llm_generic_small_v2` — ServiceNow Small Language Model v2.0
- `llm_generic_large` — ServiceNow Large Language Model v1.0
- `llm_generic_large_v2` — ServiceNow Large Language Model v2.0

> **Tip:** Skills built with Skill Kit do not consume "assists" when run inside Now Assist in Virtual Agent or Now Assist Panel. They only consume assists when run as tools within agentic workflows.

---

### AI Agents

AI Agents are **autonomous virtual workers** that can investigate, reason, and take action across ServiceNow workflows.

**Key difference from Skills:**
- A **Skill** is a single, discrete AI capability (summarize, classify, generate)
- An **Agent** orchestrates multiple skills and tools to solve complex, multi-step problems autonomously

**Where AI Agents work:**
- Now Assist Panel
- Virtual Agent
- Context menus
- Any channel via AI Agent Fabric

**Architecture:**

```
Agentic Workflow (the business goal)
  └── AI Agent (the virtual worker)
       ├── Tool: Now Assist Skill
       ├── Tool: Flow Designer Action
       ├── Tool: GlideRecord Query
       ├── Tool: External API Call
       └── Tool: Knowledge Search
```

**Key protocols:**
- **A2A (Agent-to-Agent)** — Enables communication between ServiceNow and third-party AI agents
- **MCP (Model Context Protocol)** — Agents pull context from external tools, data, and systems

**Data sources agents use:**
- Knowledge articles
- Historical incidents and cases
- CIs from the CMDB
- External systems via Workflow Data Fabric

**Use cases by module:**
- **ITSM** — Incident resolution, request fulfillment, change risk assessment
- **HRSD** — Employee onboarding automation, HR case routing
- **SecOps** — Vulnerability remediation, security incident triage
- **CSM** — Customer case resolution, CRM updates
- **ITOM** — Alert correlation, operational triage (most autonomous agents on the platform)

**Security model (Zurich+):**
- Role-based access controls configured in AI Agent Studio
- **Dynamic user** — Agent inherits invoking user's permissions (default)
- **AI user** — Dedicated sys_user record of type "AI" with specific roles
- **Role masking** — Minimizes the agent's effective roles to a subset of the user's roles

**Consumption:**
- Agentic workflows are bucketed into Small, Medium, and Large for assist pricing
- Skills/VA topics running as tools inside an agentic workflow do **not** consume additional assists
- Sub-prod usage and testing also consume assists

> **Prerequisite:** Now Assist installed with Pro Plus/Enterprise entitlement, Yokohama Patch 1+ or Xanadu Patch 7+, with the Now Assist AI Agents store app installed.

---

## NLU vs LLM in Virtual Agent

### NLU (Natural Language Understanding) — Traditional Approach

The original Virtual Agent model. Uses **predefined intents, entities, and utterances** to understand user input.

**How it works:**
- You define **intents** (what the user wants to do)
- You create **utterances** (example phrases users might say)
- You configure **entities** (data to extract from input)
- The NLU model is trained in **NLU Workbench**
- Topic discovery matches user input to the best intent

**Strengths:**
- Deterministic — predictable, testable behavior
- Cost-effective — no LLM consumption
- Easier to govern and audit
- Great for high-volume, structured flows (password resets, simple catalog orders)

**Weaknesses:**
- Requires constant utterance tuning and model retraining
- Intent overlap causes misclassification at scale
- Struggles with unstructured, freeform input
- No context awareness across messages

### LLM (Large Language Model) — Now Assist Approach

The newer model using generative AI. Uses **topic descriptions** instead of intents/utterances.

**How it works:**
- You write **topic descriptions** in natural language (what this topic does)
- The LLM matches user input to topics based on semantic understanding
- **Input Collector** nodes replace entity extraction — you describe what to collect in plain language
- No NLU Workbench, no utterance training

**Strengths:**
- No model management overhead — just write descriptions
- Better handling of varied, natural language input
- Context awareness across messages
- Faster to author and iterate
- Dynamic, conversational tone

**Weaknesses:**
- Less deterministic — harder to predict exact behavior
- Higher cost (LLM consumption per interaction)
- Potential for hallucinations
- Can't run NLU and LLM topics in the same assistant

### Side-by-Side Comparison

| Aspect | NLU Topics | LLM Topics |
|--------|-----------|------------|
| Intent matching | Trained utterances | Topic descriptions |
| Data collection | Entity extraction | Input Collector (natural language) |
| Training | NLU Workbench | None — just write descriptions |
| Predictability | High (deterministic) | Moderate (probabilistic) |
| Context awareness | None across messages | Yes |
| Cost | Low (no LLM consumption) | Higher (assist consumption) |
| Maintenance | High at scale | Low |
| Best for | Structured, high-volume flows | Complex, conversational flows |

### When to Migrate NLU → LLM

**Good candidates for migration:**
- Topics with frequently misclassified intents
- Topics where users describe issues in many different ways
- Topics requiring conversational, multi-turn data collection
- Large NLU estates (500+ topics) with high maintenance burden

**Keep on NLU:**
- Simple, deterministic flows that work well today (password reset, basic catalog)
- Compliance-sensitive workflows requiring predictable behavior
- High-volume topics where LLM cost adds up

> **Best practice:** Take a hybrid approach. Migrate targeted sets that benefit most from LLM, not everything at once.

### How to Migrate NLU Topics to LLM

Available since **Washington Patch 3:**

1. Open **Virtual Agent Designer**
2. Filter by Model Type = NLU to see existing topics
3. Click **Migrate Topics to LLM**
4. Do **not** migrate Read Only topics (best practice)
5. Select topics to migrate
6. Review topic blocks within each topic
7. In Settings, select the Assistant to migrate to
8. Confirm and migrate

**Post-migration checklist:**
- Check all **script blocks** to ensure they migrated correctly
- Review auto-generated **topic descriptions** (these power discovery)
- Test in VA Designer before publishing
- Verify entity vocabulary sources (not all may carry over)

> **Note:** Topic descriptions power the intent/search ability in LLM mode. Write clear, action-oriented descriptions starting with verbs like *get, order, resolve, reset, submit*.

---

## AI Skills Catalog (Q1 2026)

ServiceNow offers **300+ AI Skills** across 30+ product modules. Key areas:

| Module | Example Skills |
|--------|---------------|
| ITSM | Incident summarization, resolution notes, similar incidents, auto-categorization |
| CSM | Case summarization, customer sentiment, response generation |
| HRSD | Case routing, knowledge recommendations, lifecycle automation |
| SecOps | Threat analysis, vulnerability prioritization, playbook recommendations |
| ITOM | Alert correlation, root cause analysis, remediation suggestions |
| GRC | Risk assessment, compliance gap analysis |
| FSM | Work order summarization, scheduling optimization |

---

## Quick Reference

### Key Terms

| Term | Definition |
|------|-----------|
| **Now Assist** | ServiceNow's GenAI experience — the umbrella for all AI features |
| **AI Skill** | A single, reusable AI capability (summarize, classify, generate) |
| **AI Agent** | An autonomous worker that orchestrates skills to solve problems |
| **Skill Kit** | Developer toolkit for building custom AI skills |
| **AI Agent Studio** | Where you build and manage AI Agents and agentic workflows |
| **GenAI Controller** | Embeds generative AI into workflows and VA topics |
| **Agentic Workflow** | The business goal an AI Agent is trying to achieve |
| **NLU** | Traditional intent-based language understanding (utterances + training) |
| **LLM** | Large Language Model — powers Now Assist's natural language understanding |
| **Now LLM** | ServiceNow's own hosted language model |
| **Assists** | Consumption units for AI actions (licensing metric) |
| **A2A** | Agent-to-Agent protocol for cross-platform agent communication |
| **MCP** | Model Context Protocol — how agents access external context |
| **Workflow Data Fabric** | How AI Agents access data across ServiceNow and external systems |

---

## Related Resources

- [ServiceNow AI Agents Documentation](https://www.servicenow.com/products/ai-agents.html)
- [Now Assist Skill Kit Guide](https://www.servicenow.com/community/now-assist-articles/now-assist-in-ai-agents-resource-guide-updated-february-26/ta-p/3450997)
- [Migrating NLU Topics to LLM](https://www.servicenow.com/community/virtual-agent-nlu-articles/now-assist-in-virtual-agent-migrating-nlu-topics-to-llm-nbsp/ta-p/2980214)
- [AI Agents FAQ and Troubleshooting](https://www.servicenow.com/community/now-assist-articles/ai-agents-faq-and-troubleshooting/ta-p/3200454)
- [ServiceNow AI Skills Complete Guide](https://teivasystems.com/blog/servicenow-ai-skills-agents-workflows-complete-guide/)