
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
dayAfterTomorrow.setHours(14, 0, 0, 0);

export const leadOptions = [
  {
    id: "L001",
    name: "Rahul Sharma",
    company: "Tech Solutions",
    email: "rahul@example.com",
    phone: "9876543210",
    status: "New",
  },
  {
    id: "L002",
    name: "Priya Patel",
    company: "Bright Enterprises",
    email: "priya@example.com",
    phone: "9876543211",
    status: "Contacted",
  },
  {
    id: "L003",
    name: "Amit Shah",
    company: "Shah Industries",
    email: "amit@example.com",
    phone: "9876543212",
    status: "Qualified",
  },
  {
    id: "L004",
    name: "Neha Desai",
    company: "Global Business",
    email: "neha@example.com",
    phone: "9876543213",
    status: "New",
  },
  {
    id: "L005",
    name: "Karan Mehta",
    company: "Mehta Enterprises",
    email: "karan@example.com",
    phone: "9876543214",
    status: "Contacted",
  },
];

export const teamMembers = [
  "Hasti",
  "Rahul",
  "Priya",
  "Amit",
];

export const initialFollowUps = [
  {
    id: "F001",
    leadId: "L001",
    title: "Initial customer call",
    type: "Call",
    assignedTo: "Hasti",
    dueDate: tomorrow.toISOString(),
    priority: "High",
    notes: "Discuss customer requirements and budget.",
    status: "Pending",
    createdAt: new Date().toISOString(),
    history: [
      {
        id: "H001",
        action: "Created",
        details: "Initial follow-up scheduled.",
        date: new Date().toISOString(),
      },
    ],
  },
  {
    id: "F002",
    leadId: "L002",
    title: "Send product proposal",
    type: "Email",
    assignedTo: "Rahul",
    dueDate: dayAfterTomorrow.toISOString(),
    priority: "Medium",
    notes: "Send pricing and product details.",
    status: "Pending",
    createdAt: new Date().toISOString(),
    history: [
      {
        id: "H002",
        action: "Created",
        details: "Product proposal follow-up scheduled.",
        date: new Date().toISOString(),
      },
    ],
  },
  {
    id: "F003",
    leadId: "L003",
    title: "Product demonstration",
    type: "Meeting",
    assignedTo: "Priya",
    dueDate: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    priority: "Low",
    notes: "Arrange a product demo with the customer.",
    status: "Pending",
    createdAt: new Date().toISOString(),
    history: [
      {
        id: "H003",
        action: "Created",
        details: "Product demonstration scheduled.",
        date: new Date().toISOString(),
      },
    ],
  },
];
