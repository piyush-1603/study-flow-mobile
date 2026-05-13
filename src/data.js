const rawAppData = {
  user: {
    name: "Piyush",
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
      difficulty: "Hard", deadline: "2026-05-06T23:59:00", added_via: "WhatsApp",
      status: "in_progress", progress_percent: 40, submitted: false,
      tags: ["coding", "lab"], notes: "Sir said focus on edge cases for deletion",
    },
    {
      id: "a2", title: "ER Diagram – Library Management System", subject_id: "s2",
      description: "Design a complete ER diagram for a Library Management System.",
      difficulty: "Medium", deadline: "2026-05-06T11:00:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["diagram", "theory"], notes: "Submit via LMS portal only",
    },
    {
      id: "a3", title: "Process Scheduling Algorithms Report", subject_id: "s3",
      description: "Write a comparative report on FCFS, SJF, Round Robin, and Priority Scheduling.",
      difficulty: "Hard", deadline: "2026-05-07T23:59:00", added_via: "WhatsApp",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["report", "theory"], notes: "At least 8 pages. Handwritten Gantt charts required",
    },
    {
      id: "a4", title: "Math III – Fourier Series Assignment", subject_id: "s6",
      description: "Solve problems 3.1 to 3.15 on Fourier Series and Transforms.",
      difficulty: "Medium", deadline: "2026-05-07T10:00:00", added_via: "Verbal",
      status: "in_progress", progress_percent: 60, submitted: false,
      tags: ["mathematics", "handwritten"], notes: "Handwritten only. Show all steps.",
    },
    {
      id: "a5", title: "Socket Programming Mini Project", subject_id: "s4",
      description: "Build a client-server chat app using TCP sockets in Python. Demo required.",
      difficulty: "Hard", deadline: "2026-05-08T23:59:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["coding", "project", "demo"], notes: "Demo in lab on 9th. Code + PPT both required.",
    },
    {
      id: "a6", title: "SRS Document – Group Project", subject_id: "s5",
      description: "Prepare a complete Software Requirements Specification document.",
      difficulty: "Medium", deadline: "2026-05-09T23:59:00", added_via: "LMS",
      status: "in_progress", progress_percent: 25, submitted: false,
      tags: ["document", "group"], notes: "Team of 4. Riya is handling use case diagrams.",
    },
    {
      id: "a7", title: "DBMS Lab – SQL Queries Practice File", subject_id: "s2",
      description: "Submit compiled file of all SQL queries from lab sessions 1–6.",
      difficulty: "Easy", deadline: "2026-05-10T09:00:00", added_via: "WhatsApp",
      status: "in_progress", progress_percent: 70, submitted: false,
      tags: ["lab", "SQL"], notes: "Already have sessions 1-4 done",
    },
    {
      id: "a8", title: "CN Unit 3 Quiz", subject_id: "s4",
      description: "Online MCQ quiz on Network Layer, IP Addressing, Subnetting, Routing Protocols.",
      difficulty: "Medium", deadline: "2026-05-11T14:00:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["quiz", "online"], notes: "30 questions, 45 minutes. One attempt only.",
    },
    {
      id: "a9", title: "OS Mid-Sem Viva Preparation", subject_id: "s3",
      description: "Prepare for viva covering Units 1–3: Process, Memory, and File Systems.",
      difficulty: "Hard", deadline: "2026-05-13T09:00:00", added_via: "Verbal",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["viva", "exam"], notes: "Sir specifically mentioned deadlock and paging",
    },
    {
      id: "a10", title: "DSA Assignment – Graph Algorithms", subject_id: "s1",
      description: "Implement BFS, DFS, Dijkstra's and Prim's. Submit code + explanation doc.",
      difficulty: "Hard", deadline: "2026-05-15T23:59:00", added_via: "LMS",
      status: "not_started", progress_percent: 0, submitted: false,
      tags: ["coding", "algorithms"], notes: "Can use either C++ or Java",
    },
    // --- Completed tasks ---
    {
      id: "a11", title: "Linked List Operations Lab", subject_id: "s1",
      description: "Implement singly and doubly linked list with all operations in C++.",
      difficulty: "Medium", deadline: "2026-05-01T23:59:00", added_via: "WhatsApp",
      status: "completed", progress_percent: 100, submitted: true,
      tags: ["coding", "lab"], notes: "Submitted on time. Got full marks.",
    },
    {
      id: "a12", title: "Normalization & SQL Joins Worksheet", subject_id: "s2",
      description: "Solve 20 problems on 1NF, 2NF, 3NF, BCNF and write SQL join queries.",
      difficulty: "Easy", deadline: "2026-04-30T09:00:00", added_via: "LMS",
      status: "completed", progress_percent: 100, submitted: true,
      tags: ["theory", "SQL"], notes: "Covered in last week's tutorial session",
    },
    {
      id: "a13", title: "Linux Commands & Shell Scripting Lab", subject_id: "s3",
      description: "Complete lab exercises on file management, process control, and write 5 shell scripts.",
      difficulty: "Easy", deadline: "2026-05-02T23:59:00", added_via: "Verbal",
      status: "completed", progress_percent: 100, submitted: true,
      tags: ["lab", "coding"], notes: "Fun lab. Finished early.",
    },
  ],
  alerts: [
    {
      type: "clustering_alert",
      message: "3 deadlines fall between May 6–7. High risk period! 🚨",
      affected_ids: ["a1", "a2", "a3"], severity: "high",
    },
    {
      type: "not_started_warning",
      message: "ER Diagram is due tomorrow and hasn't been started yet.",
      affected_ids: ["a2"], severity: "high",
    },
  ],
  today_focus: {
    date: "2026-05-05",
    recommended: ["a1", "a2"],
    message: "Focus on BST Implementation first, then start the ER Diagram 👆",
  },
};

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeekMonday(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function daysBetween(left, right) {
  return Math.round((left - right) / 86400000);
}

function remapDeadlineToTwoWeeks(isoDateTime, minDate, maxDate, windowStart) {
  const [datePart, timePart = "00:00:00"] = isoDateTime.split("T");
  const currentDate = new Date(`${datePart}T00:00:00`);
  const totalSpan = Math.max(1, daysBetween(maxDate, minDate));
  const relativeOffset = daysBetween(currentDate, minDate);
  const mappedOffset = Math.round((relativeOffset / totalSpan) * 13);
  const clampedOffset = Math.min(13, Math.max(0, mappedOffset));
  const remappedDate = addDays(windowStart, clampedOffset);
  return `${formatLocalDate(remappedDate)}T${timePart}`;
}

function buildClusteringAlertMessage(assignments, affectedIds) {
  const affectedDeadlines = assignments
    .filter((a) => affectedIds.includes(a.id))
    .map((a) => new Date(a.deadline))
    .sort((a, b) => a - b);

  if (affectedDeadlines.length === 0) {
    return "Multiple deadlines are clustered. High risk period! 🚨";
  }

  const monthName = affectedDeadlines[0].toLocaleString("en-US", { month: "short" });
  const firstDay = affectedDeadlines[0].getDate();
  const lastDay = affectedDeadlines[affectedDeadlines.length - 1].getDate();

  if (firstDay === lastDay) {
    return `${affectedDeadlines.length} deadlines fall on ${monthName} ${firstDay}. High risk period! 🚨`;
  }

  return `${affectedDeadlines.length} deadlines fall between ${monthName} ${firstDay}-${lastDay}. High risk period! 🚨`;
}

function buildRelativeAppData(data) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const windowStart = startOfWeekMonday(today);

  const allDeadlineDates = data.assignments.map((assignment) => new Date(assignment.deadline));
  const minDate = allDeadlineDates.reduce((min, current) => (current < min ? current : min), allDeadlineDates[0]);
  const maxDate = allDeadlineDates.reduce((max, current) => (current > max ? current : max), allDeadlineDates[0]);

  const assignments = data.assignments.map((assignment) => ({
    ...assignment,
    deadline: remapDeadlineToTwoWeeks(assignment.deadline, minDate, maxDate, windowStart),
  }));

  const alerts = data.alerts.map((alert) => {
    if (alert.type !== "clustering_alert") return alert;
    return {
      ...alert,
      message: buildClusteringAlertMessage(assignments, alert.affected_ids),
    };
  });

  return {
    ...data,
    assignments,
    alerts,
    today_focus: {
      ...data.today_focus,
      date: formatLocalDate(today),
    },
  };
}

export const appData = buildRelativeAppData(rawAppData);

export function buildWeeklyHeatmap(assignments) {
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    const dateStr = formatLocalDate(d);
    const count = assignments.filter(a => {
      if (a.submitted) return false;
      const dl = new Date(a.deadline);
      return dl.getFullYear() === d.getFullYear() &&
             dl.getMonth() === d.getMonth() &&
             dl.getDate() === d.getDate();
    }).length;

    let load = 'none';
    if (count === 1) load = 'low';
    else if (count === 2) load = 'medium';
    else if (count >= 3) load = 'critical';

    week.push({ date: dateStr, day: DAY_NAMES[d.getDay()], load, count });
  }
  return week;
}

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
