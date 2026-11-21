// ===== EDIT THESE =====
const CONFIG = {
  name: "Abdellah",
  roles: [
    "Networking student @ ENSEEIHT",
    "Future ethical hacker",
    "CTF player",
    "Cybersecurity enthusiast",
  ],
  email: "abdellahettaouil15@gmail.com",
  linkedin: "https://www.linkedin.com/in/abdellah-ettaouil-609459386/",
  github: "https://github.com/ABDELLAH20-AI",
};
// ======================

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Boot screen ---------- */
const bootLines = [
  "[ OK ] Initialising secure shell...",
  "[ OK ] Loading profile: " + CONFIG.name.toLowerCase(),
  "[ OK ] Decrypting portfolio data...",
  "[ OK ] Mounting /education /skills /projects",
  "[ OK ] Access granted. Welcome.",
];
const boot = document.getElementById("boot");
const bootText = document.getElementById("boot-text");
const seenBoot = (() => { try { return sessionStorage.getItem("booted"); } catch { return null; } })();
if (seenBoot || matchMedia("(prefers-reduced-motion: reduce)").matches) {
  boot.classList.add("hidden");
} else {
  let i = 0;
  const step = () => {
    if (i < bootLines.length) {
      bootText.textContent += bootLines[i++] + "\n";
      setTimeout(step, 220);
    } else {
      setTimeout(() => boot.classList.add("hidden"), 350);
      try { sessionStorage.setItem("booted", "1"); } catch {}
    }
  };
  step();
  boot.addEventListener("click", () => boot.classList.add("hidden"));
}

/* ---------- Typing effect ---------- */
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;
function typeLoop() {
  const word = CONFIG.roles[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);
  if (!deleting && charIdx < word.length) charIdx++;
  else if (deleting && charIdx > 0) charIdx--;
  else if (!deleting) { deleting = true; return setTimeout(typeLoop, 1600); }
  else { deleting = false; roleIdx = (roleIdx + 1) % CONFIG.roles.length; }
  setTimeout(typeLoop, deleting ? 40 : 85);
}
typeLoop();

/* ---------- Matrix rain ---------- */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
const chars = "01アイウエオカキクケコ$#@%&*<>/\\{}[]ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let drops = [];
const fontSize = 16;
let rainColor = "#33ff66";
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  drops = Array(Math.ceil(canvas.width / fontSize)).fill(0).map(() => Math.random() * -50);
}
resize();
addEventListener("resize", resize);
function rain() {
  ctx.fillStyle = "rgba(5, 8, 5, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = rainColor;
  ctx.font = fontSize + "px monospace";
  drops.forEach((y, x) => {
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x * fontSize, y * fontSize);
    drops[x] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
  });
}
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(() => rainOn && rain(), 55);

/* ---------- Mobile menu ---------- */
const nav = document.getElementById("nav");
document.getElementById("menu-toggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* ---------- Reveal + skill bars + active nav ---------- */
document.querySelectorAll("section:not(.hero)").forEach(s => s.classList.add("reveal"));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    e.target.querySelectorAll(".skill").forEach(s => {
      s.querySelector(".bar i").style.width = s.dataset.level + "%";
    });
    const link = nav.querySelector(`a[href="#${e.target.id}"]`);
    nav.querySelectorAll("a").forEach(a => a.classList.toggle("active", a === link));
  });
}, { threshold: 0.2 });
document.querySelectorAll("section").forEach(s => io.observe(s));

/* ---------- Interactive terminals ---------- */
const sections = ["about", "education", "skills", "projects", "experience", "reflection", "contact"];
const aliases = { career_plan: "reflection", "career_plan.txt": "reflection" };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
const cmdHistory = [];
let rainOn = true;

function sectionText(id) {
  const el = document.getElementById(id);
  const body = el.querySelector(".window-body, .timeline, .grid");
  if (!body) return "";
  if (body._fullText && body.classList.contains("typing-pending")) return body._fullText.trim();
  const clone = body.cloneNode(true);
  clone.querySelectorAll(".mini-out, .term-input").forEach(n => n.remove());
  return clone.innerText.trim();
}
const resolve = arg => {
  const a = (arg || "").replace(/\/$/, "").replace(/^~\//, "");
  return aliases[a] || a.replace(/\.(txt|log|sh|md)$/, "");
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* CTF: answers are stored base64-encoded so they aren't readable at a glance */
const CTF = [
  { name: "Base64", task: "Decode this message:\n  ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259\nHint: try 'base64 -d <text>'.",
    ans: "ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259" },
  { name: "ROT13", task: "This one is rotated:\n  synt{ebg13_vf_whfg_n_ebgngvba}\nHint: try 'rot13 <text>'.",
    ans: "ZmxhZ3tyb3QxM19pc19qdXN0X2Ffcm90YXRpb259" },
  { name: "Recon", task: "A flag is hidden in this page's source code.\nHint: real hackers always read the source (Ctrl+U, or right click > View source).",
    ans: "ZmxhZ3t2MWV3X3MwdXJjM18xc190aDNfZjFyc3Rfc3QzcH0=" },
];
const ctfLevel = () => Number(store.get("ctf") || 0);

const commands = {
  help: (a, t) => t.print(
    "General:   help, whoami, ls, cd <dir>, cat <file>, pwd, clear, history, echo, date\n" +
    "Portfolio: hire, contact, skills, projects, cv, neofetch\n" +
    "Hacking:   nmap [host], ping [host], hack, ctf, submit <flag>, base64 -d <text>, rot13 <text>\n" +
    "Fun:       matrix (toggle rain), theme <green|amber|cyan>, sudo, exit\n" +
    "Tip: use the up/down arrows for history and Tab to autocomplete."),
  whoami: (a, t) => t.print(`${CONFIG.name.toLowerCase()}: ${CONFIG.roles[0]}, ${CONFIG.roles[1].toLowerCase()}.`),
  pwd: (a, t) => t.print("/home/abdellah" + (t.cwd ? "/" + t.cwd : "")),
  ls: (a, t) => {
    const dir = resolve(a) || t.cwd;
    if (!dir) return t.print(sections.map(s => s + "/").join("  ") + "  cv.pdf");
    if (!sections.includes(dir)) return t.print(`ls: cannot access '${a}': No such directory`, "err");
    if (dir === "projects") return t.print([...document.querySelectorAll("#projects .file")].map(f => f.textContent).join("\n"));
    t.print(`${dir}.txt`);
  },
  cd: (a, t) => {
    const id = resolve(a);
    if (!id || id === "~" || id === "home" || id === "..") { t.cwd = ""; t.setPrompt(); return document.getElementById("home").scrollIntoView(); }
    if (!sections.includes(id)) return t.print(`cd: ${a}: No such directory`, "err");
    t.cwd = id; t.setPrompt();
    document.getElementById(id).scrollIntoView();
    t.print(`moved to ~/${id}`);
  },
  cat: (a, t) => {
    const id = resolve(a) || t.cwd;
    if (!id) return t.print("usage: cat <file>   (try 'ls')", "err");
    if (id === "flag") return t.print("Nice try! Flags are earned. Type 'ctf'.", "err");
    sections.includes(id) ? t.print(sectionText(id)) : t.print(`cat: ${a}: No such file`, "err");
  },
  skills: (a, t) => {
    document.querySelectorAll(".skill").forEach(s => {
      const bar = s.querySelector(".bar i");
      const n = s.dataset.level;
      t.print(`[${"#".repeat(Math.round(n / 10)).padEnd(10, ".")}] ${n}%  ${s.querySelector("span").textContent}`);
      bar.style.width = "0"; setTimeout(() => bar.style.width = n + "%", 50);
    });
  },
  projects: (a, t) => t.print([...document.querySelectorAll("#projects .card h3")].map((h, i) => `${i + 1}. ${h.textContent}`).join("\n")),
  cv: (a, t) => t.print("cv.pdf: coming soon. Meanwhile, type 'contact' or 'hire'."),
  hire: (a, t) => t.print("Looking for:\n  - Internship, 2 months minimum, from late April 2027\n  - Alternance (work-study) for 2027-2028\nFields: cybersecurity, SOC, network security, pentest\n\nType 'contact' to reach me."),
  contact: (a, t) => t.print(`email:    ${CONFIG.email}\nlinkedin: ${CONFIG.linkedin}\ngithub:   ${CONFIG.github}`),
  date: (a, t) => t.print(new Date().toString()),
  echo: (a, t) => t.print(a),
  history: (a, t) => t.print(cmdHistory.map((c, i) => `${String(i + 1).padStart(4)}  ${c}`).join("\n") || "(empty)"),
  clear: (a, t) => { t.out.innerHTML = ""; },
  exit: (a, t) => { t.out.innerHTML = ""; t.print("logout. (refresh to log back in ;)"); },
  neofetch: (a, t) => t.print(
    "   ___     abdellah@enseeiht\n" +
    "  /   \\    -----------------\n" +
    " | 0 0 |   OS: AbdellahOS 2.0 (hacker edition)\n" +
    " |  ^  |   School: ENSEEIHT, Toulouse INP\n" +
    " | '-' |   Major: Networks (Réseaux), year 2\n" +
    "           Prev: CPGE Al Qalam\n" +
    "           Langs: Python, Java, C, Ada\n" +
    "  \\___/    Goal: ethical hacker\n" +
    "           Shell: portfolio-sh\n" +
    `           CTF progress: ${ctfLevel()}/${CTF.length}\n` +
    "           Coffee: critical levels"),
  nmap: async (a, t) => {
    const host = a || "abdellah20-ai.github.io";
    t.print(`Starting Nmap 7.95 ( https://nmap.org )\nScanning ${host} ...`);
    await sleep(700);
    t.print("PORT     STATE   SERVICE\n22/tcp   closed  ssh\n80/tcp   open    http\n443/tcp  open    https\n1337/tcp open    motivation (100%)");
    await sleep(300);
    t.print("Nmap done: 1 IP address (1 host up) scanned in 0.70 seconds");
  },
  ping: async (a, t) => {
    const host = a || "enseeiht.fr";
    t.print(`PING ${host}: 56 data bytes`);
    for (let i = 0; i < 4; i++) { await sleep(350); t.print(`64 bytes from ${host}: icmp_seq=${i} ttl=56 time=${(8 + Math.random() * 6).toFixed(1)} ms`); }
    t.print(`--- ${host} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss`);
  },
  hack: async (a, t) => {
    const steps = ["Bypassing firewall", "Injecting payload", "Escalating privileges", "Downloading secret_plans.zip"];
    for (const s of steps) {
      t.print(`${s} ...`);
      await sleep(400);
      t.print("[" + "█".repeat(20) + "] 100%");
    }
    await sleep(300);
    t.print("Just kidding. Real ethical hackers only test systems they have permission to test. Type 'ctf' for a legal challenge.", "ok");
  },
  ctf: (a, t) => {
    const lvl = ctfLevel();
    if (lvl >= CTF.length) return t.print("You've captured all the flags. Respect. Now go connect with me on LinkedIn: type 'contact'.", "ok");
    t.print(`=== CTF challenge ${lvl + 1}/${CTF.length}: ${CTF[lvl].name} ===\n${CTF[lvl].task}\nSubmit with: submit flag{...}`);
  },
  submit: (a, t) => {
    const lvl = ctfLevel();
    if (lvl >= CTF.length) return t.print("All flags already captured!", "ok");
    if (!a) return t.print("usage: submit flag{...}", "err");
    if (btoa(a.trim()) === CTF[lvl].ans) {
      store.set("ctf", lvl + 1);
      t.print(`Correct! Flag ${lvl + 1}/${CTF.length} captured.`, "ok");
      lvl + 1 < CTF.length ? t.print("Type 'ctf' for the next challenge.") : t.print("All flags captured. You'd make a good pentester!", "ok");
    } else t.print("Wrong flag. Keep trying!", "err");
  },
  base64: (a, t) => {
    const m = a.match(/^-d\s+(.+)/);
    try { t.print(m ? atob(m[1].trim()) : btoa(a)); } catch { t.print("base64: invalid input", "err"); }
  },
  rot13: (a, t) => t.print(a.replace(/[a-z]/gi, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26))),
  matrix: (a, t) => { rainOn = !rainOn; canvas.style.display = rainOn ? "" : "none"; t.print(`matrix rain ${rainOn ? "on" : "off"}`); },
  theme: (a, t) => {
    const themes = { green: ["#33ff66", "#1f9e44"], amber: ["#ffb000", "#a87400"], cyan: ["#29e0ff", "#1a8fa6"] };
    const th = themes[(a || "").toLowerCase()];
    if (!th) return t.print("usage: theme <green|amber|cyan>", "err");
    document.documentElement.style.setProperty("--green", th[0]);
    document.documentElement.style.setProperty("--green-dim", th[1]);
    rainColor = th[0];
    store.set("theme", a.toLowerCase());
    t.print(`theme set to ${a}`);
  },
  sudo: (a, t) => t.print("abdellah is not in the sudoers file. This incident will be reported. ;)", "err"),
  python: (a, t) => t.print(">>> print('Hello from Abdellah')\nHello from Abdellah"),
  rm: (a, t) => t.print(a.includes("-rf") ? "Nope. Not today. 🙂" : "rm: permission denied", "err"),
  ssh: (a, t) => t.print(`ssh: connect to host ${a || "localhost"} port 22: Connection refused (good security!)`, "err"),
};
commands.ll = commands.ls;
commands.dir = commands.ls;
commands.man = commands.help;

function createShell(out, form, input, label, cwd) {
  const t = { out, cwd, histPos: 0 };
  t.setPrompt = () => { label.textContent = `guest@abdellah:~${t.cwd ? "/" + t.cwd : ""}$`; };
  t.print = (text, cls = "") => {
    const div = document.createElement("div");
    div.className = "term-line" + (cls ? " " + cls : "");
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  };
  t.setPrompt();
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    cmdHistory.push(raw);
    t.histPos = cmdHistory.length;
    t.print(`${label.textContent} ${raw}`, "cmd");
    const [cmd, ...args] = raw.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (!fn) return t.print(`command not found: ${cmd}. Type 'help'.`, "err");
    input.disabled = true;
    try { await fn(args.join(" "), t); } finally { input.disabled = false; input.focus(); }
  });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && t.histPos > 0) { input.value = cmdHistory[--t.histPos]; e.preventDefault(); }
    else if (e.key === "ArrowDown") { t.histPos = Math.min(cmdHistory.length, t.histPos + 1); input.value = cmdHistory[t.histPos] || ""; }
    else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.value.split(" ");
      const pool = parts.length === 1 ? Object.keys(commands) : [...sections, "flag"];
      const match = pool.filter(c => c.startsWith(parts[parts.length - 1]));
      if (match.length === 1) { parts[parts.length - 1] = match[0]; input.value = parts.join(" ") + " "; }
      else if (match.length > 1) t.print(match.join("  "));
    }
  });
  return t;
}

/* Main terminal */
const mainShell = createShell(
  document.getElementById("term-out"), document.getElementById("term-form"),
  document.getElementById("term-cmd"), document.querySelector("#term-form label"), "");
mainShell.print(`Welcome to ${CONFIG.name.toLowerCase()}-os v2.0`);
mainShell.print("Type 'help' to see commands, or 'ctf' to try a small hacking challenge.");
mainShell.print("Click here and start typing.");
document.getElementById("terminal").addEventListener("click", e => {
  if (e.target.tagName !== "A") document.getElementById("term-cmd").focus();
});

/* Typewriter: section headings and terminal windows type themselves out when they scroll into view */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function prepareTyping(el) {
  el._fullText = el.innerText;
  el.style.minHeight = el.offsetHeight + "px";
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (!n.textContent.trim() && !/\S/.test(n.textContent)) { nodes.push({ n, text: n.textContent, ws: true }); continue; }
    nodes.push({ n, text: n.textContent.replace(/\s+/g, " ") });
  }
  nodes.forEach(o => { if (!o.ws) o.n.textContent = ""; });
  el.classList.add("typing-pending");
  return nodes;
}
function typeOut(el, nodes, speed) {
  return new Promise(resolve => {
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.textContent = "█";
    const total = nodes.reduce((s, o) => s + (o.ws ? 0 : o.text.length), 0);
    const perTick = Math.max(1, Math.ceil(total / (speed / 16)));
    let i = 0, pos = 0, done = false;
    el.classList.remove("typing-pending");
    const finish = () => {
      if (done) return;
      done = true;
      nodes.forEach(o => { if (!o.ws) o.n.textContent = o.text; });
      cursor.remove();
      el.style.minHeight = "";
      resolve();
    };
    el.addEventListener("click", finish, { once: true });
    (function tick() {
      if (done) return;
      let budget = perTick;
      while (budget > 0 && i < nodes.length) {
        const o = nodes[i];
        if (o.ws) { i++; pos = 0; continue; }
        const take = Math.min(budget, o.text.length - pos);
        pos += take; budget -= take;
        o.n.textContent = o.text.slice(0, pos);
        o.n.after(cursor);
        if (pos >= o.text.length) { i++; pos = 0; }
      }
      if (i >= nodes.length) return setTimeout(finish, 400);
      setTimeout(tick, 16);
    })();
  });
}
if (!reduceMotion) {
  document.querySelectorAll("main section:not(.hero)").forEach(sec => {
    const heading = sec.querySelector("h2");
    const bodies = [...sec.querySelectorAll(".window:not(.terminal) .window-body")];
    const jobs = [];
    if (heading) jobs.push([heading, prepareTyping(heading), 700]);
    bodies.forEach(b => jobs.push([b, prepareTyping(b), Math.min(3500, 900 + b.textContent.length * 4)]));
    // restore lengths for speed calc (textContent is empty now), use stored text
    jobs.forEach(j => { if (j[0] !== heading) j[2] = Math.min(6000, 1200 + j[1].reduce((s, o) => s + o.text.length, 0) * 6); });
    const obs = new IntersectionObserver(async entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      obs.disconnect();
      if (jobs[0] && jobs[0][0] === heading) await typeOut(...jobs[0]);
      await Promise.all(jobs.filter(j => j[0] !== heading).map(j => typeOut(...j)));
    }, { threshold: 0.15 });
    obs.observe(sec);
  });
}

/* Restore saved theme */
const savedTheme = store.get("theme");
if (savedTheme && savedTheme !== "green") commands.theme(savedTheme, { print() {} });
