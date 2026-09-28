import { useEffect, useState } from "react";

type Mode = "Learn" | "Explore" | "Review";
type Overlay =
  | null
  | "project"
  | "concept"
  | "actions"
  | "settings"
  | "portfolio"
  | "completion"
  | "welcome"
  | "investigate"
  | "git";

const steps = [
  { title: "Understand the current form", meta: "Submit flow · TaskForm.tsx", status: "done" },
  { title: "Detect an empty title", meta: "Conditions · trim() · Forms", status: "current" },
  { title: "Show a validation message", meta: "React state · Rendering", status: "locked" },
  { title: "Clear the error", meta: "Events · State updates", status: "locked" },
  { title: "Test the final behavior", meta: "Unit tests · Assertions", status: "locked" },
];

const evidence = [
  ["File was modified", "verified"],
  ["Validation exists before addTask()", "verified"],
  ["Empty string is rejected", "verified"],
  ["Whitespace-only string is rejected", "attention"],
  ["Existing task creation remains intact", "verified"],
];

const code = [
  "import { useState } from \"react\";",
  "import { useTasks } from \"../context/TaskContext\";",
  "",
  "export function TaskForm() {",
  "  const [title, setTitle] = useState(\"\");",
  "  const [error, setError] = useState(\"\");",
  "  const { addTask } = useTasks();",
  "",
  "  function handleSubmit(event: React.FormEvent) {",
  "    event.preventDefault();",
  "",
  "    if (title === \"\") {",
  "      setError(\"Please enter a task\");",
  "      return;",
  "    }",
  "",
  "    addTask({ title, completed: false });",
  "    setTitle(\"\");",
  "  }",
  "",
  "  return (",
  "    <form onSubmit={handleSubmit}>",
  "      <label htmlFor=\"task-title\">New task</label>",
  "      <input",
  "        id=\"task-title\"",
  "        value={title}",
  "        onChange={(event) => setTitle(event.target.value)}",
  "      />",
  "      {error && <p role=\"alert\">{error}</p>}",
  "      <button type=\"submit\">Add task</button>",
  "    </form>",
  "  );",
  "}",
];

const Icon = ({ name, size = 16 }: { name: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    bell: <><path d="M6 16h12l-1.5-2V9a4.5 4.5 0 0 0-9 0v5z" /><path d="M10 19h4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    folder: <><path d="M3 6h7l2 2h9v11H3z" /><path d="M3 9h18" /></>,
    play: <path d="m8 5 10 7-10 7z" />,
    find: <><circle cx="10" cy="10" r="5" /><path d="m14 14 5 5" /></>,
    note: <><path d="M5 3h11l3 3v15H5z" /><path d="M15 3v5h4M8 12h8M8 16h6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    branch: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="19" r="2" /><path d="M6 7v10M8 10c7 0 6-4 8-4" /></>,
    terminal: <><path d="m5 7 4 5-4 5M11 17h8" /></>,
    book: <><path d="M4 5c4-2 6 0 8 2v14c-2-2-4-4-8-2zM20 5c-4-2-6 0-8 2v14c2-2 4-4 8-2z" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    menu: <><path d="M5 7h14M5 12h14M5 17h14" /></>,
    light: <><circle cx="12" cy="10" r="5" /><path d="M9 16h6M10 20h4" /></>,
    code: <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />,
  };
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

function ForgeMark({ full = true }: { full?: boolean }) {
  return (
    <div className={`brand ${full ? "" : "mark-only"}`}>
      <svg className="brand-mark" viewBox="0 0 40 40" aria-label="Forge">
        <path className="mark-a" d="M5 7.5 10 3h24v10H15v7h13v9H15V37H5z" />
        <path className="mark-b" d="M24 13h10v19l-5 5H19V27h5z" />
      </svg>
      {full && <span className="wordmark">Forge</span>}
    </div>
  );
}

function Button({
  children,
  variant = "ghost",
  onClick,
  disabled,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  disabled?: boolean;
  icon?: string;
  className?: string;
}) {
  return (
    <button className={`btn ${variant} ${className}`} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </button>
  );
}

function SessionHeader({
  mode,
  setMode,
  open,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  open: (o: Overlay) => void;
}) {
  return (
    <header className="session-header">
      <button className="app-menu" onClick={() => open("welcome")} title="Open Forge home">
        <ForgeMark />
        <Icon name="chevron" size={13} />
      </button>
      <div className="header-rule" />
      <div className="project-context">
        <span className="eyebrow">PROJECT</span>
        <strong>student-task-manager</strong>
      </div>
      <div className="goal-context">
        <span className="eyebrow">CURRENT GOAL</span>
        <strong>Prevent users from creating empty tasks</strong>
      </div>
      <div className="progress-context">
        <div className="progress-label"><span>Step 2 of 5</span><span>38%</span></div>
        <div className="seg-progress">{[1,2,3,4,5].map(n => <i key={n} className={n < 3 ? "filled" : ""} />)}</div>
      </div>
      <div className="mode-switch">
        {(["Learn", "Explore", "Review"] as Mode[]).map(m => (
          <button key={m} className={mode === m ? "active" : ""} onClick={() => setMode(m)}>{m}</button>
        ))}
      </div>
      <button className="icon-btn search-launch" title="Action Finder (Ctrl K)" onClick={() => open("actions")}><Icon name="search" /></button>
      <button className="icon-btn" title="Notifications"><Icon name="bell" /></button>
      <button className="avatar" onClick={() => open("portfolio")}>AM</button>
      <div className="window-controls"><button>—</button><button>□</button><button>×</button></div>
    </header>
  );
}

function JourneyRail({ open }: { open: (o: Overlay) => void }) {
  return (
    <aside className="journey-rail">
      <div className="rail-heading">
        <div><span className="eyebrow copper">LEARNING JOURNEY</span><h2>Add Task Validation</h2></div>
        <button className="icon-btn small" title="Journey options">•••</button>
      </div>
      <div className="journey-path">
        {steps.map((s, i) => (
          <button className={`journey-step ${s.status}`} key={s.title}>
            <span className="step-connector" />
            <span className="step-number">{s.status === "done" ? <Icon name="check" size={14} /> : s.status === "locked" ? <Icon name="lock" size={12} /> : i + 1}</span>
            <span className="step-copy">
              <span className="step-state">{s.status === "current" ? "CURRENT STEP" : s.status === "done" ? "COMPLETED" : `STEP ${i + 1}`}</span>
              <strong>{s.title}</strong>
              <small>{s.meta}</small>
              {s.status === "current" && <span className="step-file"><Icon name="code" size={13} /> TaskForm.tsx <i>Medium</i></span>}
            </span>
          </button>
        ))}
      </div>
      <div className="rail-bottom">
        <div className="backpack-head"><span><Icon name="book" /> Learning Backpack</span><small>4 saved</small></div>
        <div className="concept-pills">
          {["trim()", "React state", "Event handling", "Form validation"].map((x, i) => (
            <button key={x} onClick={() => open("concept")} className={i === 0 ? "accent" : ""}>{x}</button>
          ))}
        </div>
        <Button variant="secondary" icon="folder" onClick={() => open("project")} className="full">Browse Full Project <span className="shortcut">⌘P</span></Button>
      </div>
    </aside>
  );
}

function CodeWorkspace({ open }: { open: (o: Overlay) => void }) {
  const [file, setFile] = useState("TaskForm.tsx");
  const [find, setFind] = useState(false);
  return (
    <main className="focus-canvas">
      <div className="canvas-top">
        <div>
          <span className="eyebrow">FOCUS CANVAS</span>
          <span className="canvas-title">Current Step Files</span>
        </div>
        <div className="resource-chips">
          {[
            ["TaskForm.tsx", "Primary"],
            ["TaskContext.tsx", "Related"],
            ["TaskForm.test.tsx", "Related"],
          ].map(([name, kind]) => (
            <button key={name} onClick={() => setFile(name)} className={`resource-chip ${file === name ? "active" : ""}`}>
              <span className="file-glyph">TS</span><span><strong>{name}</strong><small>{kind}</small></span>
              {name === "TaskForm.tsx" && <i />}
            </button>
          ))}
        </div>
        <div className="editor-tools">
          <button title="Run current file"><Icon name="play" /></button>
          <button title="Format document">{"{ }"}</button>
          <button title="Find symbol" onClick={() => setFind(!find)}><Icon name="find" /></button>
          <button title="Compare changes" onClick={() => open("git")}><Icon name="branch" /></button>
          <button title="Add note"><Icon name="note" /></button>
          <button title="Ask about selection"><Icon name="light" /></button>
        </div>
      </div>
      <div className="breadcrumb"><span>src</span><b>/</b><span>components</span><b>/</b><strong>{file}</strong><span className="modified">M</span></div>
      {find && <div className="find-box"><input autoFocus placeholder="Find in current file" defaultValue="handleSubmit" /><span>1 of 2</span><button onClick={() => setFind(false)}>×</button></div>}
      <div className="editor-area">
        <div className="code-pane">
          <div className="folds">{code.map((_, i) => <span key={i}>{[4,9,12,21,24].includes(i + 1) ? "⌄" : ""}</span>)}</div>
          <div className="lines">{code.map((_, i) => <span key={i}>{i + 1}</span>)}</div>
          <div className="git-marks"><i className="mark-5" /><i className="mark-12" /></div>
          <div className="code-content">
            {code.map((line, i) => {
              const html = line
                .replace(/(import|from|export|function|const|return|if)/g, '<em class="kw">$1</em>')
                .replace(/(&quot;|")([^"]*)(&quot;|")/g, '<em class="str">"$2"</em>')
                .replace(/(useState|useTasks|setError|addTask|setTitle|handleSubmit|preventDefault)/g, '<em class="fn">$1</em>');
              return <div key={i} className={`${i === 11 ? "checkpoint-line" : ""} ${i === 13 ? "current-line" : ""}`}><span dangerouslySetInnerHTML={{ __html: html || " " }} /></div>;
            })}
          </div>
          <div className="checkpoint-box">
            <span>Current checkpoint</span>
          </div>
          <div className="mentor-link"><i /><span>Guidance linked</span></div>
          <div className="minimap">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ width: `${25 + ((i * 17) % 60)}%` }} />)}<b /></div>
          <div className="scroll-thumb" />
        </div>
        <div className="editor-status">
          <span><i className="status-dot" /> Changes saved locally</span>
          <span>Ln 14, Col 7</span><span>Spaces: 2</span><span>UTF-8</span><span>TypeScript React</span>
        </div>
      </div>
    </main>
  );
}

function MentorBoard({ open }: { open: (o: Overlay) => void }) {
  const [hint, setHint] = useState(0);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<"incorrect" | "correct" | null>(null);
  const [decide, setDecide] = useState(false);
  const [answer, setAnswer] = useState("");

  const check = () => {
    setChecking(true);
    setFeedback(null);
    window.setTimeout(() => {
      setChecking(false);
      setFeedback(hint >= 3 ? "correct" : "incorrect");
    }, 1500);
  };
  return (
    <aside className="mentor-board">
      <div className="mentor-head">
        <div className="guide-symbol"><span>F</span></div>
        <div><h2>Your Guide</h2><p>Working with you, not replacing you.</p></div>
        <button className="icon-btn small" title="Minimize guide">—</button>
      </div>
      <div className="guidance-level">
        <span>Guidance level</span>
        <button>Coaching <Icon name="chevron" size={13} /></button>
        <button title="Lesson settings" onClick={() => open("settings")}><Icon name="settings" /></button>
        <button title="Session history"><Icon name="book" /></button>
      </div>
      <div className="mentor-scroll">
        <section className="lesson-card objective">
          <span className="section-kicker"><i /> CURRENT OBJECTIVE</span>
          <h3>Prevent blank and whitespace-only tasks from being submitted.</h3>
          <p>Invalid records can make the task list difficult to understand and maintain.</p>
        </section>
        <section className="lesson-card move">
          <span className="section-kicker">YOUR NEXT MOVE</span>
          <p>Inside <code>handleSubmit</code>, add a condition that checks whether the task title is empty after unnecessary spaces are removed.</p>
          <div className="linked-to"><span>Linked to</span><code>TaskForm.tsx:12–15</code></div>
        </section>
        <section className="think-card">
          <div className="think-title"><Icon name="light" /><span>Think first</span></div>
          <label>Which value should be checked before <code>addTask()</code> is called?</label>
          <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write your reasoning…" />
          {answer && <small>Your reasoning is saved with this step.</small>}
        </section>
        <details className="example-card">
          <summary>Example pattern <span>Not your final solution</span></summary>
          <pre><span>if</span> (username.trim() === <b>&quot;&quot;</b>) {"{\n  // Handle missing username\n}"}</pre>
        </details>
        {hint > 0 && (
          <section className="hint-card">
            <div><span>HINT {hint} OF 3</span><button onClick={() => setHint(0)}>×</button></div>
            <strong>{hint === 1 ? "Think about string cleanup" : hint === 2 ? "Apply the method before comparing" : "Complete the missing method"}</strong>
            <p>{hint === 1 ? "A string method can remove spaces before the comparison." : hint === 2 ? "Use trim() on the title value before comparing it to an empty string." : "if (title._____() === \"\") {\n  // Stop the submission\n}"}</p>
          </section>
        )}
        {checking && (
          <section className="scanning">
            <div className="scanner"><i /></div>
            <strong>Reviewing your implementation…</strong>
            {["Reading your latest changes", "Checking the current condition", "Comparing with the goal", "Reviewing nearby logic"].map((x, i) => <span key={x} style={{ animationDelay: `${i * .25}s` }}><i />{x}</span>)}
          </section>
        )}
        {feedback === "incorrect" && (
          <section className="feedback incorrect">
            <span className="feedback-label">NEEDS ANOTHER LOOK</span>
            <h3>You are close, but one case is still missing.</h3>
            <p>Your condition detects an empty string, but a title containing only spaces can still pass.</p>
            <code>if (title === &quot;&quot;)</code>
            <div className="button-row"><Button variant="secondary" onClick={() => setFeedback(null)}>Try Again</Button><Button onClick={() => setHint(Math.max(hint, 1))}>Show Hint 1</Button></div>
          </section>
        )}
        {feedback === "correct" && (
          <section className="feedback correct">
            <span className="feedback-label">CHECKPOINT VERIFIED</span>
            <h3>Your validation condition works.</h3>
            <ul><li>Checked title before addTask()</li><li>Used trim() for whitespace</li><li>Prevented the function continuing</li></ul>
            <p><strong>Why is the return statement important here?</strong></p>
            <Button variant="primary" onClick={() => open("completion")}>Answer and Continue</Button>
          </section>
        )}
        {decide && (
          <section className="decision-card">
            <strong>Choose your approach</strong>
            {["Add the validation condition", "Create the error state first", "Write the failing test first", "Inspect the submit flow again"].map((x, i) => <button key={x} onClick={() => setDecide(false)}><span>{String.fromCharCode(65 + i)}</span>{x}<Icon name="arrow" /></button>)}
          </section>
        )}
      </div>
      <div className="mentor-actions">
        <Button variant="primary" onClick={check} disabled={checking} icon="check">Check My Work</Button>
        <div className="mentor-action-grid">
          <Button variant="secondary" onClick={() => setHint(Math.min(3, hint + 1))}>Give Me a Hint <span>{hint}/3</span></Button>
          <Button variant="secondary" onClick={() => open("concept")}>Explain Concept</Button>
        </div>
        <button className="decide-link" onClick={() => setDecide(!decide)}>Let Me Decide the Next Step <Icon name="arrow" /></button>
      </div>
    </aside>
  );
}

function EvidenceDock({ open }: { open: (o: Overlay) => void }) {
  const [tab, setTab] = useState("Step Evidence");
  const tabs = ["Step Evidence", "Code Changes", "Test Results", "Runtime", "Errors", "Terminal", "Notes"];
  return (
    <section className="evidence-dock">
      <div className="dock-tabs">
        <span className="dock-title">EVIDENCE DOCK</span>
        {tabs.map(t => <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}{t === "Errors" && <i>1</i>}</button>)}
        <button className="dock-collapse">⌄</button>
      </div>
      <div className="dock-content">
        {tab === "Step Evidence" && <>
          <div className="evidence-summary">
            <div className="evidence-ring"><span>3</span><small>/ 4</small></div>
            <div><strong>Evidence required for Step 2</strong><p>A step is completed only when the required evidence is verified.</p></div>
          </div>
          <div className="evidence-list">
            {evidence.map(([text, status]) => <div key={text}><span className={`evidence-icon ${status}`}><Icon name={status === "verified" ? "check" : "light"} size={12} /></span><span>{text}</span><b className={status}>{status === "verified" ? "Verified" : "Needs attention"}</b></div>)}
          </div>
          <Button variant="ghost">How evidence works</Button>
        </>}
        {tab === "Terminal" && <div className="terminal-view"><div><span className="prompt">student-task-manager %</span> npm run dev</div><p>&gt; vite</p><strong>VITE ready in 412 ms</strong><p>Local: <u>http://localhost:5173/</u></p><div className="terminal-input"><span className="prompt">student-task-manager %</span><input aria-label="Terminal command" /></div><aside>Forge can explain commands, but you remain in control of execution. <button>Explain Command</button><button>Add to Notes</button></aside></div>}
        {tab === "Code Changes" && <div className="simple-dock"><Icon name="branch" /><div><strong>2 files changed</strong><p>TaskForm.tsx <b>+4 −1</b> · TaskForm.test.tsx <b>+8</b></p></div><Button onClick={() => open("git")}>Open Change Review</Button></div>}
        {tab === "Test Results" && <div className="simple-dock"><span className="test-fail">1</span><div><strong>1 of 4 tests needs attention</strong><p>rejects a whitespace-only task · Expected 0 tasks, received 1</p></div><Button onClick={() => open("investigate")}>Investigate Failure</Button></div>}
        {!["Step Evidence", "Terminal", "Code Changes", "Test Results"].includes(tab) && <div className="empty-dock"><Icon name="note" /><span><strong>{tab}</strong><p>No new {tab.toLowerCase()} for this checkpoint.</p></span></div>}
      </div>
    </section>
  );
}

function OverlayShell({ title, subtitle, close, children, wide = false }: { title: string; subtitle?: string; close: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="overlay-backdrop" onMouseDown={close}>
      <section className={`overlay-shell ${wide ? "wide" : ""}`} onMouseDown={e => e.stopPropagation()}>
        <header><div><span className="eyebrow">FORGE WORKSPACE</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="close-btn" onClick={close}><Icon name="close" /></button></header>
        {children}
      </section>
    </div>
  );
}

function ProjectDrawer({ close }: { close: () => void }) {
  const rows = [
    ["▾", "student-task-manager", "root"], ["▾", ".forge", "folder"], ["", "journey.json", "file indent2"], ["", "preferences.json", "file indent2"],
    ["▾", "src", "folder"], ["▾", "components", "folder indent2"], ["", "TaskCard.tsx", "file indent3"], ["", "TaskForm.tsx", "file indent3 active"],
    ["", "TaskList.tsx", "file indent3"], ["▾", "context", "folder indent2"], ["", "TaskContext.tsx", "file indent3"], ["▸", "pages", "folder indent2"],
    ["▸", "services", "folder indent2"], ["", "App.tsx", "file indent2"], ["", "main.tsx", "file indent2"], ["▾", "tests", "folder"], ["", "TaskForm.test.tsx", "file indent2"], ["", "package.json", "file"], ["", "README.md", "file"],
  ];
  return <OverlayShell title="Project Resources" subtitle="Browse freely. Opening a file does not change your journey." close={close} wide>
    <div className="project-tools"><div className="search-field"><Icon name="search" /><input autoFocus placeholder="Search student-task-manager" /><kbd>⌘ F</kbd></div><button>All file types <Icon name="chevron" /></button></div>
    <div className="filter-row">{["Related to goal", "Recently used", "Modified 2", "Test files", "Documentation"].map((x,i)=><button className={i===0?"active":""} key={x}>{x}</button>)}</div>
    <div className="project-drawer-body">
      <div className="file-tree">{rows.map(([caret,name,cls],i)=><button key={i} className={cls}><span className="caret">{caret}</span><Icon name={cls.includes("folder")||cls==="root"?"folder":"code"} size={14}/><span>{name}</span>{name==="TaskForm.tsx"&&<b>M</b>}{name==="TaskForm.test.tsx"&&<b className="test-tag">TEST</b>}</button>)}</div>
      <div className="resource-preview"><span className="eyebrow">RELATED TO YOUR GOAL</span><h3>TaskForm.tsx</h3><p>Primary file for the current step. Contains the form submission flow and title state.</p><div className="preview-meta"><span><b>Modified</b> 2 min ago</span><span><b>Used in</b> Dashboard.tsx</span><span><b>Concepts</b> Forms, events, state</span></div><Button variant="primary">Open in Focus Canvas</Button><Button variant="secondary">Open in Explore Mode</Button></div>
    </div>
  </OverlayShell>;
}

function ConceptModal({ close }: { close: () => void }) {
  const [saved, setSaved] = useState(true);
  return <OverlayShell title="trim()" subtitle="String method · Saved from Step 2" close={close}>
    <div className="concept-modal">
      <div className="concept-definition"><span className="method">trim()</span><p>Removes whitespace from the beginning and end of a string without changing the original value.</p></div>
      <div className="before-after"><div><span>INPUT</span><code>&quot;  Buy groceries  &quot;</code></div><Icon name="arrow"/><div><span>OUTPUT</span><code>&quot;Buy groceries&quot;</code></div></div>
      <section><h3>Why it matters here</h3><p>A task containing only spaces looks empty to a person, but JavaScript still sees characters. Trimming lets you compare the meaningful value.</p></section>
      <section className="mistake"><span>COMMON MISTAKE</span><code>title === &quot;&quot;</code><p>This catches an empty string, but not <code>&quot;   &quot;</code>.</p></section>
      <div className="concept-location"><Icon name="code"/><span><strong>Appears in this project</strong><small>TaskForm.tsx · Current checkpoint</small></span><Button>View in code</Button></div>
      <Button variant={saved ? "secondary" : "primary"} onClick={() => setSaved(!saved)} icon={saved ? "check" : "book"}>{saved ? "Saved to Learning Backpack" : "Save to Learning Backpack"}</Button>
    </div>
  </OverlayShell>;
}

function ActionFinder({ close, open }: { close: () => void; open: (o: Overlay) => void }) {
  const actions: [string,string,string,Overlay][] = [
    ["Learning", "Check My Current Step", "Review your implementation against this checkpoint", null],
    ["Understand", "Explain Selected Code", "Explore syntax, behavior, and concepts", "concept"],
    ["Debug", "Investigate an Error", "Form a hypothesis and inspect evidence", "investigate"],
    ["Project", "Open Project Resources", "Browse files without leaving your learning journey", "project"],
    ["Review", "Review My Changes", "Inspect the current diff and prepare a commit", "git"],
    ["Growth", "View Learning Portfolio", "See your concepts, decisions, and progress", "portfolio"],
    ["Forge", "Open Settings", "Adjust guidance, privacy, editor, and learning preferences", "settings"],
  ];
  return <div className="action-backdrop" onMouseDown={close}><div className="action-finder" onMouseDown={e=>e.stopPropagation()}>
    <div className="action-search"><Icon name="search" size={20}/><input autoFocus placeholder="What would you like to do?" /><kbd>ESC</kbd></div>
    <div className="action-heading"><span>RECOMMENDED FOR THIS STEP</span><small>↑↓ Navigate · ↵ Open</small></div>
    {actions.map(([cat,title,desc,target],i)=><button key={title} className={i===0?"selected":""} onClick={()=>{close(); if(target) open(target)}}><span className="action-icon"><Icon name={i===0?"check":i===2?"find":i===3?"folder":i===4?"branch":i===5?"grid":"settings"}/></span><span><i>{cat}</i><strong>{title}</strong><small>{desc}</small></span>{i===0&&<kbd>⌘ ↵</kbd>}<Icon name="arrow"/></button>)}
  </div></div>;
}

function Settings({ close }: { close: () => void }) {
  const [category,setCategory]=useState("Guidance");
  const cats=["General","Editor","Appearance","Guidance","Learning","Privacy","Models","Terminal","Git","Keyboard Shortcuts"];
  const [toggles,setToggles]=useState([true,true,true,true,true,false]);
  return <OverlayShell title="Settings" subtitle="Make Forge work the way you learn." close={close} wide>
    <div className="settings-body"><nav>{cats.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?"active":""}>{c}{c==="Guidance"&&<small>Coaching</small>}</button>)}</nav>
    <div className="settings-content"><div className="settings-search"><Icon name="search"/><input placeholder="Search settings"/></div>
      <span className="eyebrow">{category.toUpperCase()} SETTINGS</span><h3>{category === "Guidance" ? "Shape how Forge guides you" : `${category} preferences`}</h3><p>Forge adapts support while keeping you responsible for every change.</p>
      <div className="setting-row"><div><strong>Guidance level</strong><small>How much direction appears by default.</small></div><div className="mini-segment"><button>Walkthrough</button><button className="active">Coaching</button><button>Independent</button></div></div>
      <div className="setting-row"><div><strong>Maximum hint strength</strong><small>The strongest hint available during a step.</small></div><button className="select-btn">Partial structure <Icon name="chevron"/></button></div>
      {["Ask before showing code","Explain unfamiliar syntax","Review every step","Ask reflection questions","Detect file changes","Allow complete explanations after repeated attempts"].map((x,i)=><div className="setting-row" key={x}><div><strong>{x}</strong><small>{i===0?"You decide when examples appear.":i===4?"Observe edits without changing your files.":"Applied to future learning journeys."}</small></div><button className={`toggle ${toggles[i]?"on":""}`} onClick={()=>setToggles(v=>v.map((a,j)=>j===i?!a:a))}><i/></button></div>)}
      <div className="resource-smart"><span><Icon name="light"/> RESOURCE-SMART MODE</span><strong>Use targeted context and local checks</strong><p>Uses cached explanations and smaller models for simpler learning tasks. Larger models are reserved for complex reasoning.</p><Button variant="secondary">Configure efficiency</Button></div>
    </div></div>
  </OverlayShell>;
}

function Portfolio({ close }: { close: () => void }) {
  const skills=[["JavaScript","Consistent","86"],["TypeScript","Applied","68"],["React","Applied","74"],["Testing","Practicing","48"],["Git","Practicing","55"],["Debugging","Applied","66"]];
  return <OverlayShell title="Learning Portfolio" subtitle="A record of what you have built, understood, and decided." close={close} wide>
    <div className="portfolio">
      <div className="portfolio-top"><div className="profile-large">AM</div><div><h3>Alex Morgan</h3><p>Frontend foundations · 7 week learning record</p></div><Button variant="secondary">Export learning record</Button></div>
      <div className="metric-grid">{[["4","Projects completed"],["11","Features implemented"],["6","Bugs solved"],["18","Concepts practiced"],["14","Tests written"],["29","Independent decisions"]].map(x=><div key={x[1]}><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div>
      <div className="portfolio-columns"><section><div className="section-title"><h3>Skills becoming stronger</h3><span>Last 30 days</span></div><div className="skill-grid">{skills.map(([name,state,n])=><div className="skill-card" key={name}><div><strong>{name}</strong><span>{state}</span></div><div className="skill-bar"><i style={{width:`${n}%`}}/></div><small>{n}% learning evidence</small></div>)}</div></section>
      <section className="records"><div className="section-title"><h3>Recent learning records</h3></div>{["Added task validation","Fixed API loading error","Created a React context","Wrote first component test"].map((x,i)=><div key={x}><span className="record-date">{["TODAY","TUE","MAY 12","MAY 09"][i]}</span><i/><span><strong>{x}</strong><small>{["student-task-manager · React","weather-dashboard · Debugging","student-task-manager · Architecture","portfolio-site · Testing"][i]}</small></span></div>)}</section></div>
    </div>
  </OverlayShell>;
}

function GitReview({ close }: { close: () => void }) {
  return <OverlayShell title="Change Review" subtitle="Understand and confirm each change before you commit." close={close} wide>
    <div className="git-review"><aside><span className="eyebrow">CHANGED FILES · 2</span><button className="active"><Icon name="code"/><span>TaskForm.tsx<small>Modified</small></span><b>+4 −1</b></button><button><Icon name="code"/><span>TaskForm.test.tsx<small>Modified</small></span><b>+8</b></button><div className="commit-box"><label>Commit message</label><textarea placeholder="Describe what you changed and why…"/><small>You manually confirm and execute all Git actions.</small><Button variant="secondary">Stage Selected File</Button><Button variant="primary">Commit Changes</Button></div></aside>
    <main><div className="diff-head"><span>src / components / <strong>TaskForm.tsx</strong></span><div><Button>Explain This Diff</Button><Button variant="secondary">Review My Changes</Button></div></div><div className="diff"><div className="diff-line"><i>10</i><i>10</i><code>event.preventDefault();</code></div><div className="diff-line removed"><i>12</i><i></i><code>- if (title === &quot;&quot;) {"{"}</code></div><div className="diff-line added"><i></i><i>12</i><code>+ if (title.trim() === &quot;&quot;) {"{"}</code></div><div className="diff-line"><i>13</i><i>13</i><code>  setError(&quot;Please enter a task&quot;);</code></div><div className="diff-line added"><i></i><i>14</i><code>+ return;</code></div><div className="diff-line"><i>15</i><i>15</i><code>{"}"}</code></div></div><div className="review-note"><Icon name="check"/><span><strong>The validation now handles whitespace-only titles.</strong><p>Review the return statement and confirm that it prevents <code>addTask()</code> from running.</p></span></div></main></div>
  </OverlayShell>;
}

function Investigation({ close }: { close: () => void }) {
  const [hyp,setHyp]=useState("I think the submit function continues after detecting an empty title.");
  return <OverlayShell title="Investigation Mode" subtitle="Use evidence to understand the failure before changing code." close={close}>
    <div className="investigation"><div className="observed"><span>OBSERVED PROBLEM</span><strong>The validation test expected zero tasks but received one task.</strong><code>Expected: 0&nbsp;&nbsp; Received: 1</code></div>
      <div className="investigation-steps">{["What did we expect?","What actually happened?","Which function controls this behavior?","Which condition might be missing?","What evidence should we inspect?"].map((x,i)=><button key={x} className={i<2?"done":i===2?"active":""}><span>{i<2?<Icon name="check" size={13}/>:i+1}</span>{x}<Icon name="chevron"/></button>)}</div>
      <label className="hypothesis"><span>YOUR HYPOTHESIS</span><textarea value={hyp} onChange={e=>setHyp(e.target.value)}/><small>Your guide will review your reasoning, not change your code.</small></label>
      <div className="button-row"><Button variant="secondary">Inspect Relevant Code</Button><Button variant="secondary">Read the Error</Button><Button variant="primary">Test My Hypothesis</Button></div>
    </div>
  </OverlayShell>;
}

function Completion({ close }: { close: () => void }) {
  return <OverlayShell title="You completed task-title validation." subtitle="Every required behavior is verified." close={close}>
    <div className="completion"><div className="completion-mark"><Icon name="check" size={34}/></div><div className="verified-outcomes">{["Empty titles are blocked","Whitespace-only titles are blocked","Users receive an error message","Valid tasks still submit correctly","The related test passes"].map(x=><span key={x}><Icon name="check" size={13}/>{x}</span>)}</div>
      <div className="completion-grid"><section><span>WHAT YOU BUILT</span><p>A reliable form boundary that keeps invalid task titles out of application state.</p></section><section><span>WHAT YOU LEARNED</span><p>String trimming, conditional logic, early returns, state, and testing.</p></section><section><span>WHAT YOU DECIDED</span><p>You chose to validate the input before creating error state and tests.</p></section></div>
      <div className="next-challenge"><span>NEXT CHALLENGE</span><h3>How would you require at least three characters?</h3><p>Apply the same evidence-first approach with a new constraint.</p></div>
      <div className="button-row"><Button variant="primary">Practice This Concept</Button><Button variant="secondary">Review My Changes</Button><Button onClick={close}>Explore the Project</Button></div>
    </div>
  </OverlayShell>;
}

function Welcome({ close }: { close: () => void }) {
  const [stage,setStage]=useState(0);
  const [guide,setGuide]=useState("Coaching");
  if(stage===3) return <div className="welcome-full"><div className="understanding"><ForgeMark/><div className="analyze-orbit"><span>F</span><i/><i/><i/></div><span className="eyebrow">PREPARING YOUR LEARNING JOURNEY</span><h1>Understanding student-task-manager</h1><div className="analysis-list">{["Reading the project structure","Identifying React and TypeScript","Locating relevant files","Mapping submit-flow dependencies","Preparing a learning journey"].map((x,i)=><span key={x} className={i<4?"done":"active"}><i>{i<4?<Icon name="check" size={12}/>:i+1}</i>{x}</span>)}</div><div className="proposed"><span>PROPOSED JOURNEY · 6 STEPS</span><strong>Add Task Validation</strong><p>Understand flow → Detect invalid titles → Display message → Clear message → Add a test → Review</p></div><Button variant="primary" onClick={close}>Begin Journey <Icon name="arrow"/></Button><Button onClick={()=>setStage(2)}>Adjust Steps</Button></div></div>;
  return <div className="welcome-full">
    <div className="welcome-top"><ForgeMark/><button onClick={close}><Icon name="close"/></button></div>
    {stage===0&&<div className="welcome-content"><div className="welcome-hero"><div className="hero-mark"><ForgeMark full={false}/></div><span className="eyebrow copper">A WORKSHOP FOR YOUR CODE AND CRAFT</span><h1>Build something.<br/>Understand everything.</h1><p>Forge guides you through real projects without taking control away from you.</p><div className="welcome-actions"><Button variant="primary" onClick={()=>setStage(1)} icon="folder">Open a Project</Button><Button variant="secondary" icon="branch">Clone a Repository</Button><Button variant="secondary">Start a Practice Project</Button></div><small className="ownership"><Icon name="check"/> Your code remains yours. Forge guides, explains, and reviews.</small></div>
      <section className="recents"><span className="eyebrow">RECENT PROJECTS</span>{[["student-task-manager","React · TypeScript","2 min ago"],["portfolio-site","React · CSS","Yesterday"],["weather-dashboard","JavaScript · API","May 12"]].map((x,i)=><button key={x[0]} onClick={()=>setStage(1)}><span className="recent-icon">{i===0?"ST":i===1?"PF":"WD"}</span><span><strong>{x[0]}</strong><small>{x[1]}</small></span><time>{x[2]}</time><Icon name="arrow"/></button>)}<button className="new-project">Create a New Project <span>+</span></button></section></div>}
    {stage===1&&<div className="setup-screen"><span className="setup-step">1 OF 3 · DEFINE YOUR GOAL</span><h1>What are you trying to accomplish?</h1><p>A clear goal helps Forge build a focused journey through your actual project.</p><textarea autoFocus defaultValue="I want to prevent users from submitting an empty task."/><div className="goal-cats">{["Build a Feature","Fix a Bug","Understand Code","Practice a Concept","Review My Work","Complete an Assignment"].map((x,i)=><button className={i===0?"active":""} key={x}>{x}</button>)}</div><div className="setup-nav"><Button onClick={()=>setStage(0)}>Back</Button><Button variant="primary" onClick={()=>setStage(2)}>Continue <Icon name="arrow"/></Button></div></div>}
    {stage===2&&<div className="setup-screen guidance-setup"><span className="setup-step">2 OF 3 · GUIDANCE</span><h1>How should Forge guide you?</h1><p>You can change this at any time during the journey.</p><div className="guidance-cards">{[["Walkthrough","One small step at a time with detailed explanations."],["Coaching","Direction and questions, with hints when requested."],["Independent","Requirements and checkpoints with minimal guidance."]].map(([x,d])=><button key={x} className={guide===x?"active":""} onClick={()=>setGuide(x)}><i>{x[0]}</i><strong>{x}</strong><span>{d}</span>{guide===x&&<b><Icon name="check" size={13}/></b>}</button>)}</div><div className="preference-list"><span>LEARNING PREFERENCES</span>{["Ask me questions before showing examples","Explain new concepts","Avoid complete solutions","Check my work after every step","Include reflection questions"].map((x,i)=><label key={x}><input type="checkbox" defaultChecked={i!==4}/><i/>{x}</label>)}</div><div className="setup-nav"><Button onClick={()=>setStage(1)}>Back</Button><Button variant="primary" onClick={()=>setStage(3)}>Prepare My Journey <Icon name="arrow"/></Button></div></div>}
  </div>;
}

function ExploreMode() {
  return <div className="mode-placeholder"><div className="mode-banner"><Icon name="grid"/><span><strong>You are exploring independently.</strong> Your lesson progress is still saved.</span><Button>Return to guided step</Button></div><div className="explore-grid"><section><span className="eyebrow">PROJECT MAP</span><h2>student-task-manager</h2>{["src/components","src/context","src/pages","src/services","tests","public"].map((x,i)=><div className="map-row" key={x}><Icon name="folder"/><span>{x}</span><b>{[3,1,2,1,1,1][i]} files</b></div>)}</section><section><span className="eyebrow">OPEN FILES</span><h2>Free workspace</h2><p>Browse, edit, search, use Git, and debug without changing the active learning step.</p><div className="explore-cards">{["TaskForm.tsx","TaskContext.tsx","TaskForm.test.tsx"].map(x=><button key={x}><span className="file-glyph">TS</span><strong>{x}</strong><small>Open in editor</small></button>)}</div><div className="explore-terminal"><span>TERMINAL</span><code>student-task-manager % <i>|</i></code></div></section></div></div>;
}

function ReviewMode({ open }: {open:(o:Overlay)=>void}) {
  return <div className="mode-placeholder review-mode"><div className="review-hero"><span className="eyebrow copper">STEP 2 REVIEW</span><h1>Detect an empty title</h1><p>Review the implementation, evidence, and your reasoning before continuing.</p><div className="review-score"><strong>3/4</strong><span>Evidence verified</span></div></div><div className="review-grid"><section><span className="eyebrow">CODE DIFF</span><h3>One condition changed</h3><pre><del>- if (title === &quot;&quot;) {"{"}</del>{"\n"}<ins>+ if (title.trim() === &quot;&quot;) {"{"}</ins></pre><Button onClick={()=>open("git")}>Open Change Review</Button></section><section><span className="eyebrow">CONCEPTS PRACTICED</span>{["String trim","Conditional logic","Early return","Form events"].map(x=><div className="review-concept" key={x}><Icon name="check"/>{x}<span>Applied</span></div>)}</section><section className="reflection"><span className="eyebrow">REFLECTION</span><h3>Before moving forward</h3><p>Why should validation happen before <code>addTask()</code>?</p>{["To prevent invalid data from reaching state","To change the visual design","To speed up the computer","I am not sure yet"].map((x,i)=><label key={x}><input type="radio" name="r" defaultChecked={i===0}/><i/>{x}</label>)}<textarea placeholder="Explain what trim() does in your own words…"/><Button variant="primary">Submit Reflection</Button></section></div></div>;
}

export default function App() {
  const [mode, setMode] = useState<Mode>("Learn");
  const [overlay, setOverlay] = useState<Overlay>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOverlay("actions"); }
      if (e.key === "Escape") setOverlay(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const open = (o: Overlay) => setOverlay(o);
  return (
    <div className="app-shell">
      <SessionHeader mode={mode} setMode={setMode} open={open} />
      {mode === "Learn" && <div className="workspace"><JourneyRail open={open}/><CodeWorkspace open={open}/><MentorBoard open={open}/><EvidenceDock open={open}/></div>}
      {mode === "Explore" && <ExploreMode/>}
      {mode === "Review" && <ReviewMode open={open}/>}
      {overlay === "project" && <ProjectDrawer close={()=>open(null)}/>}
      {overlay === "concept" && <ConceptModal close={()=>open(null)}/>}
      {overlay === "actions" && <ActionFinder close={()=>open(null)} open={open}/>}
      {overlay === "settings" && <Settings close={()=>open(null)}/>}
      {overlay === "portfolio" && <Portfolio close={()=>open(null)}/>}
      {overlay === "git" && <GitReview close={()=>open(null)}/>}
      {overlay === "investigate" && <Investigation close={()=>open(null)}/>}
      {overlay === "completion" && <Completion close={()=>open(null)}/>}
      {overlay === "welcome" && <Welcome close={()=>open(null)}/>}
    </div>
  );
}
