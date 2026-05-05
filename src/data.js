export const appData = {
  user: {
    name: "Arjun Sharma",
    grade: "2nd Year B.Tech",
    subjects: [
      { id: "s1", name: "Data Structures", color: "#6C63FF" },
      { id: "s2", name: "DBMS", color: "#FF6584" },
      { id: "s3", name: "Operating Systems", color: "#43B89C" },
      { id: "s4", name: "Computer Networks", color: "#F9A825" },
      { id: "s5", name: "Software Engineering", color: "#EF5350" },
      { id: "s6", name: "Mathematics III", color: "#29B6F6" },
    ],
  },
  assignments: [
    {
      id: "a1", title: "Binary Search Tree Implementation", subject_id: "s1",
      description: "Implement BST with insert, delete, and traversal methods in C++.",
      difficulty: "Hard", deadline: "2026-04-23T23:59:00", added_via: "WhatsApp",
      status: "in_progress", progress_percent: 40, submitted: false,
      tags: ["coding", "lab"], notes: "Sir said focus on edge cases for deletion",
    },
    {
      id: "a2", title: "ER Diagram – Library Management System", subject_id: "s2",
      description: "Design a complete ER diagram for a Library Management System.",
      difficulty: "Medium", deadline: "2026-04-24T11:00:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["diagram", "theory"], notes: "Submit via LMS portal only",
    },
    {
      id: "a3", title: "Process Scheduling Algorithms Report", subject_id: "s3",
      description: "Write a comparative report on FCFS, SJF, Round Robin, and Priority Scheduling.",
      difficulty: "Hard", deadline: "2026-04-24T23:59:00", added_via: "WhatsApp",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["report", "theory"], notes: "At least 8 pages. Handwritten Gantt charts required",
    },
    {
      id: "a4", title: "Math III – Fourier Series Assignment", subject_id: "s6",
      description: "Solve problems 3.1 to 3.15 on Fourier Series and Transforms.",
      difficulty: "Medium", deadline: "2026-04-25T10:00:00", added_via: "Verbal",
      status: "in_progress", progress_percent: 60, submitted: false,
      tags: ["mathematics", "handwritten"], notes: "Handwritten only. Show all steps.",
    },
    {
      id: "a5", title: "Socket Programming Mini Project", subject_id: "s4",
      description: "Build a client-server chat app using TCP sockets in Python. Demo required.",
      difficulty: "Hard", deadline: "2026-04-26T23:59:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["coding", "project", "demo"], notes: "Demo in lab on 27th. Code + PPT both required.",
    },
    {
      id: "a6", title: "SRS Document – Group Project", subject_id: "s5",
      description: "Prepare a complete Software Requirements Specification document.",
      difficulty: "Medium", deadline: "2026-04-27T23:59:00", added_via: "LMS",
      status: "in_progress", progress_percent: 25, submitted: false,
      tags: ["document", "group"], notes: "Team of 4. Riya is handling use case diagrams.",
    },
    {
      id: "a7", title: "DBMS Lab – SQL Queries Practice File", subject_id: "s2",
      description: "Submit compiled file of all SQL queries from lab sessions 1–6.",
      difficulty: "Easy", deadline: "2026-04-28T09:00:00", added_via: "WhatsApp",
      status: "in_progress", progress_percent: 70, submitted: false,
      tags: ["lab", "SQL"], notes: "Already have sessions 1-4 done",
    },
    {
      id: "a8", title: "CN Unit 3 Quiz", subject_id: "s4",
      description: "Online MCQ quiz on Network Layer, IP Addressing, Subnetting, Routing Protocols.",
      difficulty: "Medium", deadline: "2026-04-29T14:00:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["quiz", "online"], notes: "30 questions, 45 minutes. One attempt only.",
    },
    {
      id: "a9", title: "OS Mid-Sem Viva Preparation", subject_id: "s3",
      description: "Prepare for viva covering Units 1–3: Process, Memory, and File Systems.",
      difficulty: "Hard", deadline: "2026-04-30T09:00:00", added_via: "Verbal",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["viva", "exam"], notes: "Sir specifically mentioned deadlock and paging",
    },
    {
      id: "a10", title: "DSA Assignment – Graph Algorithms", subject_id: "s1",
      description: "Implement BFS, DFS, Dijkstra's and Prim's. Submit code + explanation doc.",
      difficulty: "Hard", deadline: "2026-05-02T23:59:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["coding", "algorithms"], notes: "Can use either C++ or Java",
    },
  ],
  alerts: [
    {
      type: "clustering_alert",
      message: "3 deadlines fall between Apr 23–24. High risk period! 🚨",
      affected_ids: ["a1", "a2", "a3"], severity: "high",
    },
    {
      type: "not_started_warning",
      message: "ER Diagram is due tomorrow and hasn't been started yet.",
      affected_ids: ["a2"], severity: "high",
    },
  ],
  today_focus: {
    date: "2026-04-22",
    recommended: ["a1", "a2"],
    message: "Focus on BST Implementation first, then start the ER Diagram 👆",
  },
  weekly_heatmap: [
    { date: "2026-04-22", day: "Wed", load: "high", count: 2 },
    { date: "2026-04-23", day: "Thu", load: "critical", count: 3 },
    { date: "2026-04-24", day: "Fri", load: "high", count: 2 },
    { date: "2026-04-25", day: "Sat", load: "medium", count: 1 },
    { date: "2026-04-26", day: "Sun", load: "high", count: 2 },
    { date: "2026-04-27", day: "Mon", load: "medium", count: 1 },
    { date: "2026-04-28", day: "Tue", load: "low", count: 1 },
  ],
};

export const getSubject = (subjects, id) => subjects.find(s => s.id === id);

export const formatCountdown = (deadline) => {
  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due - now;
  if (diffMs < 0) return { text: "Overdue", color: "#EF5350", isOverdue: true, isUrgent: false };
  const diffH = diffMs / 3600000;
  const diffD = diffMs / 86400000;
  if (diffH < 24) {
    const h = Math.ceil(diffH);
    return { text: `Due in ${h} hour${h !== 1 ? 's' : ''}`, color: "#F9A825", isOverdue: false, isUrgent: true };
  }
  if (diffD < 2) return { text: "Due tomorrow", color: "#F9A825", isOverdue: false, isUrgent: false };
  return { text: `Due in ${Math.ceil(diffD)} days`, color: "#43B89C", isOverdue: false, isUrgent: false };
};

export const difficultyConfig = {
  Easy: { color: "#43B89C", bg: "rgba(67,184,156,0.15)" },
  Medium: { color: "#F9A825", bg: "rgba(249,168,37,0.15)" },
  Hard: { color: "#EF5350", bg: "rgba(239,83,80,0.15)" },
};

export const addedViaIcon = { WhatsApp: "💬", LMS: "🖥️", Verbal: "🗣️" };

export const loadColor = { low: "#43B89C", medium: "#F9A825", high: "#EF5350", critical: "#EF5350" };
export const loadHeight = { low: "30%", medium: "55%", high: "78%", critical: "100%" };
