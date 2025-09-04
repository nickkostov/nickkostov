---
title: Terminal Live Examples
layout: page
---

Below are several runnable terminal examples demonstrating how to write Markdown that renders as an animated terminal session with commands and outputs.

## Basic playback

```terminal-input
echo "hello world"
_output_:
hello world
```

## Multiple commands and outputs

```terminal-input
pwd
_output_:
/home/user/project
ls -1
_output_:
README.md
src
package.json
```

## Custom prompt per block

Use raw HTML to set a custom prompt for a single block via `data-prompt`.

<pre data-prompt="#"><code class="language-terminal-input">whoami
_output_:
root
</code></pre>

Tip: you can also set a global prompt by defining `window.terminalLiveConfig = { prompt: ">" }` before the terminal script loads (see README for details).

## Command without output

```terminal-input
touch tmp.txt
```

## Separate multiple output sections

Add a new `_output_:` marker for each output section.

```terminal-input
printf "line1\nline2"
_output_:
line1
line2

echo done
_output_:
done
```

## Multiple terminal blocks on a page

```terminal-input
echo one
_output_:
one
```

```terminal-input
echo two
_output_:
two
```

---

# Diagram Examples (Mermaid)

Use fenced blocks with `mermaid` (or `diag`).

## Flowchart (TD)

```mermaid
flowchart TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Ship it]
  B -- No --> D[Fix it]
  D --> B
```

## Flowchart (LR)

```mermaid
flowchart LR
  A --> B --> C --> D
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant U as User
  participant S as Server
  U->>S: Request
  S-->>U: Response
```

## Class Diagram

```mermaid
classDiagram
  class Animal {
    +String name
    +eat()
  }
  class Dog {
    +bark()
  }
  Animal <|-- Dog
```

## State Diagram

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Running : start
  Running --> Idle : stop
  Running --> [*]
```

## ER Diagram

```mermaid
erDiagram
  USER ||--o{ ORDER : places
  ORDER ||--|{ LINE-ITEM : contains
  USER {
    string id
    string name
  }
```

## User Journey

```mermaid
journey
  title Checkout Journey
  section Browse
    View items: 3: User
  section Purchase
    Add to cart: 4: User
    Pay: 2: User
```

## Gantt

```mermaid
gantt
  title Example Timeline
  dateFormat  YYYY-MM-DD
  section Work
  Task A :a1, 2025-01-01, 3d
  Task B :after a1, 2d
```

## Pie Chart

```mermaid
pie title Languages
  "JS" : 60
  "Python" : 25
  "Other" : 15
```

## Mindmap

```mermaid
mindmap
  root((Tech))
    Web
      Frontend
      Backend
    Data
      ML
```

## Timeline

```mermaid
timeline
  title Release Timeline
  2025-01 : v1.0
  2025-02 : v1.1
```

## Requirement Diagram

```mermaid
requirementDiagram
  requirement R1 {
    text: System shall log in
    risk: high
  }
```

## Git Graph

```mermaid
gitGraph
  commit
  branch feature
  checkout feature
  commit
  checkout main
  merge feature
```
