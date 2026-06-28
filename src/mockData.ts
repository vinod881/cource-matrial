export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semester: string; // "Semester 1" to "Semester 8"
}

export interface Material {
  id: string;
  title: string;
  subjectId: string;
  departmentId: string;
  semester: string;
  category: string; // "Official Syllabus" | "Lecture Notes" | "PPT Presentations" | "Assignments" | "Lab Manuals" | "Previous Year Question Papers" | "Reference Materials"
  description: string;
  uploadedBy: string; // Name of uploader
  uploadedByRole: 'admin' | 'faculty' | 'student';
  uploadedByEmail: string;
  uploadDate: string;
  fileContent: string; // Simulated content of the file
  fileName: string;
  fileSize: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  departmentId?: string; // For students/faculty
  semester?: string; // For students
  assignedSubjects?: string[]; // Subject IDs (for faculty)
  status?: 'approved' | 'pending' | 'rejected';
}

// Initial mock data
export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'dep-1', name: 'Computer Science & Engineering', code: 'CSE' },
  { id: 'dep-2', name: 'Information Technology', code: 'IT' },
  { id: 'dep-3', name: 'Electronics & Communication', code: 'ECE' },
  { id: 'dep-4', name: 'Electrical & Electronics', code: 'EEE' },
  { id: 'dep-5', name: 'Mechanical Engineering', code: 'ME' }
];

export const DEFAULT_SUBJECTS: Subject[] = [
  // CSE Semester 3
  { id: 'sub-1', name: 'Data Structures & Algorithms', code: 'CS301', departmentId: 'dep-1', semester: 'Semester 3' },
  { id: 'sub-2', name: 'Discrete Mathematics', code: 'CS302', departmentId: 'dep-1', semester: 'Semester 3' },
  { id: 'sub-3', name: 'Digital Electronics & Logic', code: 'CS303', departmentId: 'dep-1', semester: 'Semester 3' },
  // CSE Semester 4
  { id: 'sub-4', name: 'Operating Systems', code: 'CS401', departmentId: 'dep-1', semester: 'Semester 4' },
  { id: 'sub-5', name: 'Database Management Systems', code: 'CS402', departmentId: 'dep-1', semester: 'Semester 4' },
  // CSE Semester 5
  { id: 'sub-6', name: 'Computer Networks', code: 'CS501', departmentId: 'dep-1', semester: 'Semester 5' },
  { id: 'sub-7', name: 'Design & Analysis of Algorithms', code: 'CS502', departmentId: 'dep-1', semester: 'Semester 5' },
  // CSE Semester 6
  { id: 'sub-8', name: 'Web Technologies', code: 'CS601', departmentId: 'dep-1', semester: 'Semester 6' },
  { id: 'sub-9', name: 'Artificial Intelligence', code: 'CS602', departmentId: 'dep-1', semester: 'Semester 6' },
  
  // IT Semester 3
  { id: 'sub-10', name: 'Data Structures & OOPs', code: 'IT301', departmentId: 'dep-2', semester: 'Semester 3' },
  { id: 'sub-11', name: 'Analog & Digital Circuits', code: 'IT302', departmentId: 'dep-2', semester: 'Semester 3' },
  
  // ECE Semester 3
  { id: 'sub-12', name: 'Network Analysis & Synthesis', code: 'EC301', departmentId: 'dep-3', semester: 'Semester 3' },
  { id: 'sub-13', name: 'Electronic Devices & Circuits', code: 'EC302', departmentId: 'dep-3', semester: 'Semester 3' }
];

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    title: 'Syllabus - Computer Science & Engineering (2024 Scheme)',
    subjectId: 'sub-1',
    departmentId: 'dep-1',
    semester: 'Semester 3',
    category: 'Official Syllabus',
    description: 'The official course syllabus and curriculum guidelines for the CSE Department, effective from the academic year 2024-2025.',
    uploadedBy: 'Dr. Ramesh Kumar (HOD)',
    uploadedByRole: 'admin',
    uploadedByEmail: 'admin@college.edu',
    uploadDate: '2026-05-10',
    fileContent: 'Official Syllabus details: Core modules include Linked Lists, Trees, Graphs, Sorting, Searching, and Hashing.',
    fileName: 'CSE_Scheme_2024_Syllabus.pdf',
    fileSize: '1.2 MB',
    status: 'approved'
  },
  {
    id: 'mat-2',
    title: 'Lecture Notes: Introduction to Tree Structures',
    subjectId: 'sub-1',
    departmentId: 'dep-1',
    semester: 'Semester 3',
    category: 'Lecture Notes',
    description: 'Comprehensive hand-written and digital lecture notes covering Binary Trees, BSTs, AVL Trees, and basic tree traversals (Inorder, Preorder, Postorder).',
    uploadedBy: 'Prof. Anjali Sharma',
    uploadedByRole: 'faculty',
    uploadedByEmail: 'faculty@college.edu',
    uploadDate: '2026-06-01',
    fileContent: 'Tree Lecture Notes: AVL Trees are self-balancing binary search trees where the difference in heights of left and right subtrees cannot exceed 1.',
    fileName: 'Data_Structures_Trees_Unit_3.pdf',
    fileSize: '4.8 MB',
    status: 'approved'
  },
  {
    id: 'mat-3',
    title: 'Computer Networks - OSI Reference Model PPT',
    subjectId: 'sub-6',
    departmentId: 'dep-1',
    semester: 'Semester 5',
    category: 'PPT Presentations',
    description: 'Visual slides covering the 7 layers of the OSI model, detailing encapsulation, flow control, error checking, and common protocols in each layer.',
    uploadedBy: 'Prof. Anjali Sharma',
    uploadedByRole: 'faculty',
    uploadedByEmail: 'faculty@college.edu',
    uploadDate: '2026-06-15',
    fileContent: 'OSI Model PPT Content: 1. Physical 2. Data Link 3. Network 4. Transport 5. Session 6. Presentation 7. Application.',
    fileName: 'OSI_7_Layers_Visualized.pptx',
    fileSize: '8.4 MB',
    status: 'approved'
  },
  {
    id: 'mat-4',
    title: 'Operating Systems - Semester End Exam Paper 2025',
    subjectId: 'sub-4',
    departmentId: 'dep-1',
    semester: 'Semester 4',
    category: 'Previous Year Question Papers',
    description: 'Previous year question paper for Operating Systems course, including descriptive answers guidelines and marks weightage.',
    uploadedBy: 'Dr. Ramesh Kumar (HOD)',
    uploadedByRole: 'admin',
    uploadedByEmail: 'admin@college.edu',
    uploadDate: '2026-06-18',
    fileContent: 'OS Question Paper 2025: Section A - Process Synchronization, Dining Philosophers. Section B - Bankers Algorithm, Page Replacement.',
    fileName: 'OS_Exam_Paper_May_2025.pdf',
    fileSize: '720 KB',
    status: 'approved'
  },
  {
    id: 'mat-5',
    title: 'Digital Electronics Lab Manual',
    subjectId: 'sub-3',
    departmentId: 'dep-1',
    semester: 'Semester 3',
    category: 'Lab Manuals',
    description: 'Lab instructions manual containing truth tables, circuit diagrams, and procedure details for logic gates, multiplexers, and flip-flops.',
    uploadedBy: 'Prof. Anjali Sharma',
    uploadedByRole: 'faculty',
    uploadedByEmail: 'faculty@college.edu',
    uploadDate: '2026-06-20',
    fileContent: 'Digital Electronics Lab: Experiment 1: Verify truth tables of AND, OR, NOT, NAND, NOR, XOR, XNOR gates.',
    fileName: 'Digital_Logic_Lab_Manual.pdf',
    fileSize: '3.1 MB',
    status: 'approved'
  },
  {
    id: 'mat-6',
    title: 'Self-Study Notes: Graph Traversals DFS & BFS',
    subjectId: 'sub-1',
    departmentId: 'dep-1',
    semester: 'Semester 3',
    category: 'Lecture Notes',
    description: 'Student-uploaded study guide explaining Depth First Search (DFS) and Breadth First Search (BFS) with clear diagrammatic step-by-step traces.',
    uploadedBy: 'Amit Patel (Student)',
    uploadedByRole: 'student',
    uploadedByEmail: 'student@college.edu',
    uploadDate: '2026-06-25',
    fileContent: 'Graph Traversals: DFS uses Stack (LIFO) or recursion. BFS uses Queue (FIFO) and is optimal for shortest path on unweighted graphs.',
    fileName: 'DFS_BFS_Student_Revision_Notes.pdf',
    fileSize: '1.5 MB',
    status: 'pending' // Pending approval!
  }
];

export const DEFAULT_USERS: { [email: string]: { password: string; info: User } } = {
  'admin@college.edu': {
    password: 'admin123',
    info: {
      id: 'usr-1',
      name: 'Dr. Ramesh Kumar',
      email: 'admin@college.edu',
      role: 'admin',
      status: 'approved'
    }
  },
  'faculty@college.edu': {
    password: 'faculty123',
    info: {
      id: 'usr-2',
      name: 'Prof. Anjali Sharma',
      email: 'faculty@college.edu',
      role: 'faculty',
      departmentId: 'dep-1',
      assignedSubjects: ['sub-1', 'sub-2', 'sub-3', 'sub-5', 'sub-6'],
      status: 'approved'
    }
  },
  'student@college.edu': {
    password: 'student123',
    info: {
      id: 'usr-3',
      name: 'Amit Patel',
      email: 'student@college.edu',
      role: 'student',
      departmentId: 'dep-1',
      semester: 'Semester 3',
      status: 'approved'
    }
  },
  'student2@college.edu': {
    password: 'student123',
    info: {
      id: 'usr-4',
      name: 'Sara Khan',
      email: 'student2@college.edu',
      role: 'student',
      departmentId: 'dep-3',
      semester: 'Semester 3',
      status: 'approved'
    }
  }
};

export const getStoredData = () => {
  const getOrSet = (key: string, defaultValue: any) => {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(val);
    } catch {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  };

  return {
    departments: getOrSet('cms_departments', DEFAULT_DEPARTMENTS) as Department[],
    subjects: getOrSet('cms_subjects', DEFAULT_SUBJECTS) as Subject[],
    materials: getOrSet('cms_materials', DEFAULT_MATERIALS) as Material[],
    users: getOrSet('cms_users', DEFAULT_USERS) as { [email: string]: { password: string; info: User } }
  };
};

export const saveStoredData = (data: {
  departments?: Department[];
  subjects?: Subject[];
  materials?: Material[];
  users?: { [email: string]: { password: string; info: User } };
}) => {
  if (data.departments) localStorage.setItem('cms_departments', JSON.stringify(data.departments));
  if (data.subjects) localStorage.setItem('cms_subjects', JSON.stringify(data.subjects));
  if (data.materials) localStorage.setItem('cms_materials', JSON.stringify(data.materials));
  if (data.users) localStorage.setItem('cms_users', JSON.stringify(data.users));
};
