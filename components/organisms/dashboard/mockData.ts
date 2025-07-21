export const mockProjects = [
  {
    id: "1",
    name: "Project Alpha",
    status: "In Progress",
    progress: 30,
    phase: "Phase 1",
    documents: [{ name: "Document1.docx" }, { name: "Document2.docx" }],
    chat: [
      { from: "user", text: "Mensaje de usuario en Project Alpha" },
      { from: "admin", text: "Respuesta admin en Project Alpha" },
    ],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: "2024-05-14",
    details: Array.from({ length: 4 }, (_, i) => ({
      description: `Detalle ${i + 1} de Project Alpha. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      documents: [{ name: `AlphaDoc${i + 1}-A.pdf` }, { name: `AlphaDoc${i + 1}-B.pdf` }],
      date: `2024-05-${14 + i}`,
    })),
  },
  {
    id: "2",
    name: "Project Beta",
    status: "Completed",
    progress: 100,
    phase: "Phase 3",
    documents: [{ name: "BetaDoc1.pdf" }, { name: "BetaDoc2.pdf" }],
    chat: [
      { from: "user", text: "Mensaje de usuario en Project Beta" },
      { from: "admin", text: "Respuesta admin en Project Beta" },
    ],
    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "2024-05-10",
    details: Array.from({ length: 4 }, (_, i) => ({
      description: `Detalle ${i + 1} de Project Beta. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      documents: [{ name: `BetaDoc${i + 1}-A.pdf` }, { name: `BetaDoc${i + 1}-B.pdf` }],
      date: `2024-05-${10 + i}`,
    })),
  },
  // 8 más
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `${i + 3}`,
    name: `Project ${String.fromCharCode(67 + i)}`,
    status: i % 2 === 0 ? "In Progress" : "Completed",
    progress: Math.floor(Math.random() * 100),
    phase: `Phase ${1 + (i % 3)}`,
    documents: [{ name: `Doc${i + 1}.pdf` }],
    chat: [
      { from: "user", text: `Mensaje de usuario en Project ${String.fromCharCode(67 + i)}` },
      { from: "admin", text: `Respuesta admin en Project ${String.fromCharCode(67 + i)}` },
    ],
    description: `Descripción del proyecto ${String.fromCharCode(67 + i)}.`,
    date: `2024-05-${11 + i}`,
    details: Array.from({ length: 4 }, (_, j) => ({
      description: `Detalle ${j + 1} de Project ${String.fromCharCode(67 + i)}.`,
      documents: [{ name: `Doc${i + 1}-${j + 1}-A.pdf` }, { name: `Doc${i + 1}-${j + 1}-B.pdf` }],
      date: `2024-05-${11 + i + j}`,
    })),
  })),
];

export const mockRequests = [
  {
    id: "a",
    name: "Request Uno",
    status: "Lead",
    service: "Web Design",
    plan: "Basic",
    chat: [
      { from: "user", text: "Mensaje de usuario en Request Uno" },
      { from: "admin", text: "Respuesta admin en Request Uno" },
    ],
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    date: "2024-05-12",
    estimate: {
      title: "Estimate for Request Uno",
      items: [
        { name: "UI/UX Design", value: 1200 },
        { name: "Frontend Development", value: 1800 },
      ],
    },
    invoice: {
      title: "Invoice for Request Uno",
      invoiceNumber: "INV-2023-101",
      dueDate: "2024-06-01",
      items: [
        { name: "UI/UX Design", value: 1200 },
        { name: "Frontend Development", value: 1800 },
      ],
    },
  },
  {
    id: "b",
    name: "Request Dos",
    status: "Lead",
    service: "SEO",
    plan: "Premium",
    chat: [
      { from: "user", text: "Mensaje de usuario en Request Dos" },
      { from: "admin", text: "Respuesta admin en Request Dos" },
    ],
    description: "Duis aute irure dolor in reprehenderit in voluptate velit.",
    date: "2024-05-11",
    estimate: {
      title: "Estimate for Request Dos",
      items: [
        { name: "SEO Audit", value: 900 },
        { name: "Keyword Research", value: 600 },
      ],
    },
    invoice: {
      title: "Invoice for Request Dos",
      invoiceNumber: "INV-2023-102",
      dueDate: "2024-06-02",
      items: [
        { name: "SEO Audit", value: 900 },
        { name: "Keyword Research", value: 600 },
      ],
    },
  },
  // 8 más
  ...Array.from({ length: 8 }, (_, i) => {
    const char = String.fromCharCode(99 + i);
    return {
      id: char,
      name: `Request ${String.fromCharCode(67 + i)}`,
      status: "Lead",
      service: i % 2 === 0 ? "Branding" : "SEO",
      plan: i % 2 === 0 ? "Standard" : "Premium",
      chat: [
        { from: "user", text: `Mensaje de usuario en Request ${String.fromCharCode(67 + i)}` },
        { from: "admin", text: `Respuesta admin en Request ${String.fromCharCode(67 + i)}` },
      ],
      description: `Descripción del request ${String.fromCharCode(67 + i)}.`,
      date: `2024-05-${13 + i}`,
      estimate: {
        title: `Estimate for Request ${String.fromCharCode(67 + i)}`,
        items: [
          { name: `Service A${i + 1}`, value: 1000 + i * 100 },
          { name: `Service B${i + 1}`, value: 1500 + i * 120 },
        ],
      },
      invoice: {
        title: `Invoice for Request ${String.fromCharCode(67 + i)}`,
        invoiceNumber: `INV-2023-10${i + 3}`,
        dueDate: `2024-06-${3 + i}`,
        items: [
          { name: `Service A${i + 1}`, value: 1000 + i * 100 },
          { name: `Service B${i + 1}`, value: 1500 + i * 120 },
        ],
      },
    };
  }),
];
