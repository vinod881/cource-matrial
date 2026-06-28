import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  FolderOpen,
  FileText,
  CheckCircle,
  Plus,
  Search,
  Trash2,
  Edit,
  Download,
  LogOut,
  Sun,
  Moon,
  Menu,
  Clock,
  Check,
  Book,
  File,
  Sliders,
  User,
  Layers,
  ShieldCheck,
  Mail,
  Lock,
  PlusCircle,
  Eye,
  Calendar,
  Bell,
  X
} from 'lucide-react';
import type {
  Department,
  Subject,
  Material,
  User as UserType
} from './mockData';
import {
  getStoredData,
  saveStoredData
} from './mockData';
import {
  loadAllDataFromFirestore,
  saveDepartmentFirestore,
  saveSubjectFirestore,
  saveMaterialFirestore,
  saveUserFirestore,
  deleteDepartmentFirestore,
  deleteSubjectFirestore,
  deleteMaterialFirestore,
  deleteUserFirestore
} from './firebase';

function App() {
  const generateDeptCode = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length > 1) {
      return words.map(w => w[0]).join('').toUpperCase().substring(0, 5);
    }
    return name.trim().toUpperCase().substring(0, 4);
  };

  const generateSubjectCode = (name: string) => {
    const words = name.trim().split(/\s+/);
    let code = '';
    if (words.length > 1) {
      code = words.map(w => w[0]).join('').toUpperCase().substring(0, 3);
    } else {
      code = name.trim().toUpperCase().substring(0, 3);
    }
    return `${code}${Math.floor(100 + Math.random() * 900)}`;
  };

  // --- Core States ---
  const [data, setData] = useState(getStoredData());
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('cms_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('cms_theme') || 'light';
    return saved as 'light' | 'dark';
  });

  // Fetch data from Firestore on component mount
  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        const dbData = await loadAllDataFromFirestore();
        setData(dbData);
        saveStoredData(dbData);
      } catch (err) {
        console.error("Failed to load Firebase data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDatabase();
  }, []);

  // Sync state across browser tabs/windows (local storage events)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'cms_materials' || 
        e.key === 'cms_departments' || 
        e.key === 'cms_subjects' || 
        e.key === 'cms_users'
      ) {
        setData(getStoredData());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Refetch latest Firestore/local data when the window/tab gains focus
  useEffect(() => {
    const handleFocus = async () => {
      try {
        const dbData = await loadAllDataFromFirestore();
        setData(dbData);
        saveStoredData(dbData);
      } catch (err) {
        console.error("Failed to sync on window focus:", err);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);

  // --- Auth Form State ---
  const [isRegistering, setIsRegistering] = useState(false);
  const [authRole, setAuthRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authDept, setAuthDept] = useState('');
  const [authSem, setAuthSem] = useState('Semester 3');

  // --- Profile State ---
  const [profileName, setProfileName] = useState('');
  const [profilePassword, setProfilePassword] = useState('');

  // --- Student Portal Filter States ---
  const [studentSearch, setStudentSearch] = useState('');
  const [studentSelectedDept, setStudentSelectedDept] = useState('');
  const [studentSelectedSem, setStudentSelectedSem] = useState('');
  const [studentSelectedSubject, setStudentSelectedSubject] = useState('');
  const [studentSelectedCategory, setStudentSelectedCategory] = useState('');

  // --- Faculty Filter States ---
  const [facultySearch, setFacultySearch] = useState('');
  const [facultySelectedCategory, setFacultySelectedCategory] = useState('');

  // --- Admin Filter States ---
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSelectedDept, setAdminSelectedDept] = useState('');
  const [adminSelectedSem, setAdminSelectedSem] = useState('');
  const [adminSelectedCategory, setAdminSelectedCategory] = useState('');

  // --- Modals State ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // --- Form Input States (for Create/Edit) ---
  // Material Form
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('');
  const [matDept, setMatDept] = useState('');
  const [matSem, setMatSem] = useState('Semester 3');
  const [matCategory, setMatCategory] = useState('Lecture Notes');
  const [matDesc, setMatDesc] = useState('');
  const [matFileName, setMatFileName] = useState('');
  const [matFileContent, setMatFileContent] = useState('');
  const [matFileSize, setMatFileSize] = useState('');
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Subject Form
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subDept, setSubDept] = useState('');
  const [subSem, setSubSem] = useState('Semester 1');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Department Form
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Faculty Form
  const [facName, setFacName] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facPassword, setFacPassword] = useState('');
  const [facDept, setFacDept] = useState('');
  const [facAssignedSubjects, setFacAssignedSubjects] = useState<string[]>([]);
  const [editingFaculty, setEditingFaculty] = useState<UserType | null>(null);

  // Student Form
  const [studName, setStudName] = useState('');
  const [studEmail, setStudEmail] = useState('');
  const [studPassword, setStudPassword] = useState('');
  const [studDept, setStudDept] = useState('');
  const [studSem, setStudSem] = useState('Semester 1');
  const [editingStudent, setEditingStudent] = useState<UserType | null>(null);

  // Custom Options States
  const [customAuthDept, setCustomAuthDept] = useState('');
  const [customMatDept, setCustomMatDept] = useState('');
  const [customMatSubject, setCustomMatSubject] = useState('');
  const [customSubDept, setCustomSubDept] = useState('');
  const [customFacDept, setCustomFacDept] = useState('');
  const [customStudDept, setCustomStudDept] = useState('');

  // --- Effects ---
  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('cms_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Set default filters on login
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfilePassword('');
      if (currentUser.role === 'student') {
        setStudentSelectedDept(currentUser.departmentId || '');
        setStudentSelectedSem(currentUser.semester || 'Semester 3');
      }
    }
  }, [currentUser]);

  // Sync state to local storage and Firestore
  const syncData = (newData: typeof data) => {
    // 1. Sync state and local storage fallback
    setData(newData);
    saveStoredData(newData);

    // 2. Perform background synchronization to Firestore
    try {
      // Compare Departments
      if (newData.departments !== data.departments) {
        const addedOrUpdated = newData.departments.filter(d => !data.departments.includes(d));
        addedOrUpdated.forEach(d => saveDepartmentFirestore(d));
        
        const deleted = data.departments.filter(d => !newData.departments.some(nd => nd.id === d.id));
        deleted.forEach(d => deleteDepartmentFirestore(d.id));
      }

      // Compare Subjects
      if (newData.subjects !== data.subjects) {
        const addedOrUpdated = newData.subjects.filter(s => !data.subjects.includes(s));
        addedOrUpdated.forEach(s => saveSubjectFirestore(s));
        
        const deleted = data.subjects.filter(s => !newData.subjects.some(ns => ns.id === s.id));
        deleted.forEach(s => deleteSubjectFirestore(s.id));
      }

      // Compare Materials
      if (newData.materials !== data.materials) {
        const addedOrUpdated = newData.materials.filter(m => !data.materials.includes(m));
        addedOrUpdated.forEach(m => saveMaterialFirestore(m));
        
        const deleted = data.materials.filter(m => !newData.materials.some(nm => nm.id === m.id));
        deleted.forEach(m => deleteMaterialFirestore(m.id));
      }

      // Compare Users
      if (newData.users !== data.users) {
        // Find added or updated users
        Object.entries(newData.users).forEach(([email, entry]) => {
          const oldEntry = data.users[email];
          if (!oldEntry || oldEntry.password !== entry.password || JSON.stringify(oldEntry.info) !== JSON.stringify(entry.info)) {
            saveUserFirestore(entry.info, entry.password);
          }
        });

        // Find deleted users
        Object.keys(data.users).forEach(email => {
          if (!newData.users[email]) {
            deleteUserFirestore(email);
          }
        });
      }
    } catch (err) {
      console.error("Firestore sync warning:", err);
    }
  };

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // File Download Simulation
  const downloadMaterial = (material: Material) => {
    const text = `--- COLLEGE COURSE MATERIAL PORTAL ---
Title: ${material.title}
Subject: ${data.subjects.find((s) => s.id === material.subjectId)?.name || 'N/A'} (${material.semester})
Department: ${data.departments.find((d) => d.id === material.departmentId)?.name || 'N/A'}
Category: ${material.category}
Uploaded By: ${material.uploadedBy}
Upload Date: ${material.uploadDate}
Description: ${material.description}

[SIMULATED FILE BODY CONTENT]
${material.fileContent || 'No additional content provided.'}
-------------------------------------`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = material.fileName || `${material.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded: ${material.fileName}`, 'success');
  };

  // --- Authentication Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    const emailLower = authEmail.toLowerCase().trim();
    if (emailLower === 'admin@gmail.com' && authPassword === 'admin@123') {
      const adminUser: UserType = {
        id: 'usr-admin-hardcoded',
        name: 'Dr. Ramesh Kumar (Admin)',
        email: 'admin@gmail.com',
        role: 'admin',
        status: 'approved'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('cms_current_user', JSON.stringify(adminUser));
      setCurrentTab('dashboard');
      showToast('Welcome back, Administrator!', 'success');
      setAuthEmail('');
      setAuthPassword('');
      return;
    }

    const userEntry = data.users[emailLower];
    if (!userEntry || userEntry.password !== authPassword) {
      showToast('Invalid email or password.', 'error');
      return;
    }

    const loggedInUser = userEntry.info;
    if (loggedInUser.role !== authRole) {
      showToast(`Selected role (${authRole}) does not match your credentials.`, 'error');
      return;
    }

    if (loggedInUser.role === 'faculty' && loggedInUser.status === 'pending') {
      showToast('Your faculty account is pending approval by the administrator.', 'warning');
      return;
    }

    if (loggedInUser.role === 'faculty' && loggedInUser.status === 'rejected') {
      showToast('Your faculty registration request has been rejected.', 'error');
      return;
    }

    setCurrentUser(loggedInUser);
    localStorage.setItem('cms_current_user', JSON.stringify(loggedInUser));
    setCurrentTab('dashboard');
    showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    
    // Clear login form
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName || !authEmail || !authPassword || !authDept) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const emailKey = authEmail.toLowerCase().trim();
    if (data.users[emailKey]) {
      showToast('User with this email already exists.', 'error');
      return;
    }

    let finalDeptId = authDept;
    let updatedDepartments = [...data.departments];
    if (authDept === 'other') {
      if (!customAuthDept.trim()) {
        showToast('Please enter the custom department name.', 'error');
        return;
      }
      const existing = data.departments.find(
        (d) => d.name.toLowerCase() === customAuthDept.trim().toLowerCase()
      );
      if (existing) {
        finalDeptId = existing.id;
      } else {
        const newDeptId = `dep-${Date.now()}`;
        const newDept = {
          id: newDeptId,
          name: customAuthDept.trim(),
          code: generateDeptCode(customAuthDept)
        };
        updatedDepartments.push(newDept);
        finalDeptId = newDeptId;
      }
    }

    const isFaculty = authRole === 'faculty';
    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      name: authName,
      email: authEmail,
      role: authRole as 'student' | 'faculty',
      departmentId: finalDeptId,
      semester: authRole === 'student' ? authSem : undefined,
      assignedSubjects: isFaculty ? [] : undefined,
      status: 'approved'
    };

    const newUsers = {
      ...data.users,
      [emailKey]: {
        password: authPassword,
        info: newUser
      }
    };

    syncData({ ...data, departments: updatedDepartments, users: newUsers });

    showToast('Registration successful! Please sign in with your credentials.', 'success');

    // Reset fields and open login page
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setCustomAuthDept('');
    setIsRegistering(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cms_current_user');
    setCurrentTab('dashboard');
    showToast('Logged out successfully.', 'info');
  };

  // --- Profile Handlers ---
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!profileName) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    const emailKey = currentUser.email.toLowerCase();
    const updatedUser: UserType = {
      ...currentUser,
      name: profileName
    };

    const currentPassword = data.users[emailKey]?.password || 'student123';
    const newPassword = profilePassword ? profilePassword : currentPassword;

    const newUsers = {
      ...data.users,
      [emailKey]: {
        password: newPassword,
        info: updatedUser
      }
    };

    syncData({ ...data, users: newUsers });
    setCurrentUser(updatedUser);
    localStorage.setItem('cms_current_user', JSON.stringify(updatedUser));
    showToast('Profile updated successfully!', 'success');
    setProfilePassword('');
  };

  // --- Material Upload/Edit Handlers ---
  const handleOpenUploadModal = (material: Material | null = null) => {
    setCustomMatDept('');
    setCustomMatSubject('');
    if (material) {
      setEditingMaterial(material);
      setMatTitle(material.title);
      setMatSubject(material.subjectId);
      setMatDept(material.departmentId);
      setMatSem(material.semester);
      setMatCategory(material.category);
      setMatDesc(material.description);
      setMatFileName(material.fileName);
      setMatFileContent(material.fileContent);
      setMatFileSize(material.fileSize || '');
    } else {
      setEditingMaterial(null);
      setMatTitle('');
      // set subject default based on first available subject
      const availableSubjects = currentUser?.role === 'faculty'
        ? data.subjects.filter((s) => currentUser.assignedSubjects?.includes(s.id))
        : data.subjects;
      setMatSubject(availableSubjects[0]?.id || '');
      setMatDept(currentUser?.departmentId || data.departments[0]?.id || '');
      setMatSem(currentUser?.semester || 'Semester 3');
      setMatCategory('Lecture Notes');
      setMatDesc('');
      setMatFileName('');
      setMatFileContent('');
      setMatFileSize('');
    }
    setIsUploadModalOpen(true);
  };

  // Form handle for file upload selection (mocked)
  const handleMockFileSelected = (category: string) => {
    const extMap: { [key: string]: string } = {
      'Official Syllabus': 'pdf',
      'Lecture Notes': 'pdf',
      'PPT Presentations': 'pptx',
      'Assignments': 'pdf',
      'Lab Manuals': 'pdf',
      'Previous Year Question Papers': 'pdf',
      'Reference Materials': 'pdf'
    };
    const ext = extMap[category] || 'txt';
    const cleanTitle = matTitle ? matTitle.trim().replace(/\s+/g, '_') : 'Material';
    setMatFileName(`${cleanTitle}_document.${ext}`);
    setMatFileContent(`Simulated content body for course category: ${category}. This contains class definitions, diagrams description, and review questions.`);
    setMatFileSize(`${(Math.random() * 5 + 0.5).toFixed(1)} MB`);
  };

  const handleRealFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMatFileName(file.name);
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      setMatFileSize(sizeStr);
      setMatFileContent(`Real attached document: ${file.name}. Size: ${sizeStr}.`);
    }
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!matTitle || !matSubject || !matDept || !matSem || !matCategory) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    let finalDeptId = matDept;
    let updatedDepartments = [...data.departments];
    if (matDept === 'other') {
      if (!customMatDept.trim()) {
        showToast('Please enter the custom department name.', 'error');
        return;
      }
      const existing = data.departments.find(
        (d) => d.name.toLowerCase() === customMatDept.trim().toLowerCase()
      );
      if (existing) {
        finalDeptId = existing.id;
      } else {
        const newDeptId = `dep-${Date.now()}`;
        const newDept = {
          id: newDeptId,
          name: customMatDept.trim(),
          code: generateDeptCode(customMatDept)
        };
        updatedDepartments.push(newDept);
        finalDeptId = newDeptId;
      }
    }

    let finalSubjectId = matSubject;
    let updatedSubjects = [...data.subjects];
    if (matSubject === 'other') {
      if (!customMatSubject.trim()) {
        showToast('Please enter the custom subject name.', 'error');
        return;
      }
      const existing = data.subjects.find(
        (s) => s.name.toLowerCase() === customMatSubject.trim().toLowerCase() && s.departmentId === finalDeptId
      );
      if (existing) {
        finalSubjectId = existing.id;
      } else {
        const newSubId = `sub-${Date.now()}`;
        const newSub = {
          id: newSubId,
          name: customMatSubject.trim(),
          code: generateSubjectCode(customMatSubject),
          departmentId: finalDeptId,
          semester: matSem
        };
        updatedSubjects.push(newSub);
        finalSubjectId = newSubId;
      }
    }

    let finalFileName = matFileName;
    let finalFileContent = matFileContent;
    
    if (!finalFileName) {
      const extMap: { [key: string]: string } = {
        'Official Syllabus': 'pdf',
        'Lecture Notes': 'pdf',
        'PPT Presentations': 'pptx',
        'Assignments': 'pdf',
        'Lab Manuals': 'pdf',
        'Previous Year Question Papers': 'pdf',
        'Reference Materials': 'pdf'
      };
      const ext = extMap[matCategory] || 'pdf';
      finalFileName = `${matTitle.trim().replace(/\s+/g, '_')}_document.${ext}`;
      finalFileContent = `Simulated document contents for subject study: ${matTitle}. Key theories and formulas overview.`;
    }

    let finalFileSize = matFileSize || `${(Math.random() * 5 + 0.5).toFixed(1)} MB`;

    if (editingMaterial) {
      // Edit mode
      const updatedMaterials = data.materials.map((m) => {
        if (m.id === editingMaterial.id) {
          return {
            ...m,
            title: matTitle,
            subjectId: finalSubjectId,
            departmentId: finalDeptId,
            semester: matSem,
            category: matCategory,
            description: matDesc,
            fileName: finalFileName,
            fileContent: finalFileContent,
            fileSize: finalFileSize
          };
        }
        return m;
      });
      syncData({
        ...data,
        departments: updatedDepartments,
        subjects: updatedSubjects,
        materials: updatedMaterials
      });
      showToast('Material updated successfully!', 'success');
    } else {
      // Create mode
      const newMaterial: Material = {
        id: `mat-${Date.now()}`,
        title: matTitle,
        subjectId: finalSubjectId,
        departmentId: finalDeptId,
        semester: matSem,
        category: matCategory,
        description: matDesc,
        uploadedBy: currentUser.name,
        uploadedByRole: currentUser.role,
        uploadedByEmail: currentUser.email,
        uploadDate: new Date().toISOString().split('T')[0],
        fileContent: finalFileContent,
        fileName: finalFileName,
        fileSize: finalFileSize,
        status: currentUser.role === 'student' ? 'pending' : 'approved'
      };

      const updatedMaterials = [newMaterial, ...data.materials];
      syncData({
        ...data,
        departments: updatedDepartments,
        subjects: updatedSubjects,
        materials: updatedMaterials
      });
      
      if (currentUser.role === 'student') {
        showToast('Material uploaded successfully. Pending Administrator approval!', 'info');
      } else {
        showToast('Material published successfully!', 'success');
      }
    }

    setIsUploadModalOpen(false);
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const updatedMaterials = data.materials.filter((m) => m.id !== id);
      syncData({ ...data, materials: updatedMaterials });
      showToast('Material deleted successfully.', 'success');
    }
  };

  // --- Admin Materials Approvals ---
  const handleApproveMaterial = (id: string) => {
    const updatedMaterials = data.materials.map((m) => {
      if (m.id === id) {
        return { ...m, status: 'approved' as const };
      }
      return m;
    });
    syncData({ ...data, materials: updatedMaterials });
    showToast('Material request approved.', 'success');
  };

  const handleRejectMaterial = (id: string) => {
    const updatedMaterials = data.materials.map((m) => {
      if (m.id === id) {
        return { ...m, status: 'rejected' as const };
      }
      return m;
    });
    syncData({ ...data, materials: updatedMaterials });
    showToast('Material request rejected.', 'warning');
  };

  // --- Admin CRUD Handlers ---

  // Departments
  const handleOpenDeptModal = (dept: Department | null = null) => {
    if (dept) {
      setEditingDept(dept);
      setDeptName(dept.name);
      setDeptCode(dept.code);
    } else {
      setEditingDept(null);
      setDeptName('');
      setDeptCode('');
    }
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (editingDept) {
      const updatedDepts = data.departments.map((d) => 
        d.id === editingDept.id ? { ...d, name: deptName, code: deptCode.toUpperCase() } : d
      );
      syncData({ ...data, departments: updatedDepts });
      showToast('Department updated successfully!', 'success');
    } else {
      const newDept: Department = {
        id: `dep-${Date.now()}`,
        name: deptName,
        code: deptCode.toUpperCase()
      };
      syncData({ ...data, departments: [...data.departments, newDept] });
      showToast('Department created successfully!', 'success');
    }
    setIsDeptModalOpen(false);
  };

  const handleDeleteDept = (id: string) => {
    if (window.confirm('Deleting a department will affect associated subjects and files. Confirm delete?')) {
      const updatedDepts = data.departments.filter((d) => d.id !== id);
      syncData({ ...data, departments: updatedDepts });
      showToast('Department deleted.', 'success');
    }
  };

  // Subjects
  const handleOpenSubjectModal = (sub: Subject | null = null) => {
    setCustomSubDept('');
    if (sub) {
      setEditingSubject(sub);
      setSubName(sub.name);
      setSubCode(sub.code);
      setSubDept(sub.departmentId);
      setSubSem(sub.semester);
    } else {
      setEditingSubject(null);
      setSubName('');
      setSubCode('');
      setSubDept(data.departments[0]?.id || '');
      setSubSem('Semester 1');
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCode || !subDept || !subSem) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    let finalDeptId = subDept;
    let updatedDepartments = [...data.departments];
    if (subDept === 'other') {
      if (!customSubDept.trim()) {
        showToast('Please enter the custom department name.', 'error');
        return;
      }
      const existing = data.departments.find(
        (d) => d.name.toLowerCase() === customSubDept.trim().toLowerCase()
      );
      if (existing) {
        finalDeptId = existing.id;
      } else {
        const newDeptId = `dep-${Date.now()}`;
        const newDept = {
          id: newDeptId,
          name: customSubDept.trim(),
          code: generateDeptCode(customSubDept)
        };
        updatedDepartments.push(newDept);
        finalDeptId = newDeptId;
      }
    }

    if (editingSubject) {
      const updatedSubjects = data.subjects.map((s) => 
        s.id === editingSubject.id ? { ...s, name: subName, code: subCode.toUpperCase(), departmentId: finalDeptId, semester: subSem } : s
      );
      syncData({
        ...data,
        departments: updatedDepartments,
        subjects: updatedSubjects
      });
      showToast('Subject updated successfully!', 'success');
    } else {
      const newSub: Subject = {
        id: `sub-${Date.now()}`,
        name: subName,
        code: subCode.toUpperCase(),
        departmentId: finalDeptId,
        semester: subSem
      };
      syncData({
        ...data,
        departments: updatedDepartments,
        subjects: [...data.subjects, newSub]
      });
      showToast('Subject created successfully!', 'success');
    }
    setIsSubjectModalOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm('Delete this subject? This might leave orphaned course materials.')) {
      const updatedSubjects = data.subjects.filter((s) => s.id !== id);
      syncData({ ...data, subjects: updatedSubjects });
      showToast('Subject deleted.', 'success');
    }
  };

  // Faculty CRUD
  const handleOpenFacultyModal = (faculty: UserType | null = null) => {
    setCustomFacDept('');
    if (faculty) {
      setEditingFaculty(faculty);
      setFacName(faculty.name);
      setFacEmail(faculty.email);
      setFacPassword(''); // keep empty to keep existing password unless changed
      setFacDept(faculty.departmentId || '');
      setFacAssignedSubjects(faculty.assignedSubjects || []);
    } else {
      setEditingFaculty(null);
      setFacName('');
      setFacEmail('');
      setFacPassword('');
      setFacDept(data.departments[0]?.id || '');
      setFacAssignedSubjects([]);
    }
    setIsFacultyModalOpen(true);
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName || !facEmail || (!editingFaculty && !facPassword)) {
      showToast('Please fill in required fields.', 'error');
      return;
    }

    const emailKey = facEmail.toLowerCase();
    
    if (!editingFaculty && data.users[emailKey]) {
      showToast('A user with this email already exists.', 'error');
      return;
    }

    let finalDeptId = facDept;
    let updatedDepartments = [...data.departments];
    if (facDept === 'other') {
      if (!customFacDept.trim()) {
        showToast('Please enter the custom department name.', 'error');
        return;
      }
      const existing = data.departments.find(
        (d) => d.name.toLowerCase() === customFacDept.trim().toLowerCase()
      );
      if (existing) {
        finalDeptId = existing.id;
      } else {
        const newDeptId = `dep-${Date.now()}`;
        const newDept = {
          id: newDeptId,
          name: customFacDept.trim(),
          code: generateDeptCode(customFacDept)
        };
        updatedDepartments.push(newDept);
        finalDeptId = newDeptId;
      }
    }

    const targetUser: UserType = {
      id: editingFaculty ? editingFaculty.id : `usr-${Date.now()}`,
      name: facName,
      email: facEmail,
      role: 'faculty',
      departmentId: finalDeptId,
      assignedSubjects: facAssignedSubjects,
      status: 'approved'
    };

    const targetPassword = facPassword ? facPassword : (data.users[emailKey]?.password || 'faculty123');

    const updatedUsers = {
      ...data.users,
      [emailKey]: {
        password: targetPassword,
        info: targetUser
      }
    };

    syncData({
      ...data,
      departments: updatedDepartments,
      users: updatedUsers
    });
    showToast(editingFaculty ? 'Faculty updated successfully!' : 'Faculty registered successfully!', 'success');
    setIsFacultyModalOpen(false);
  };

  const handleDeleteUser = (email: string) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      const newUsers = { ...data.users };
      delete newUsers[email.toLowerCase()];
      syncData({ ...data, users: newUsers });
      showToast('User account deleted.', 'success');
    }
  };

  const handleApproveFaculty = (email: string) => {
    const emailKey = email.toLowerCase().trim();
    const entry = data.users[emailKey];
    if (entry) {
      const updatedUsers = {
        ...data.users,
        [emailKey]: {
          ...entry,
          info: {
            ...entry.info,
            status: 'approved' as const
          }
        }
      };
      syncData({ ...data, users: updatedUsers });
      showToast(`Faculty "${entry.info.name}" has been approved!`, 'success');
    }
  };

  const handleRejectFaculty = (email: string) => {
    const emailKey = email.toLowerCase().trim();
    const entry = data.users[emailKey];
    if (entry) {
      const updatedUsers = {
        ...data.users,
        [emailKey]: {
          ...entry,
          info: {
            ...entry.info,
            status: 'rejected' as const
          }
        }
      };
      syncData({ ...data, users: updatedUsers });
      showToast(`Faculty "${entry.info.name}" registration request has been rejected.`, 'warning');
    }
  };

  // Student CRUD
  const handleOpenStudentModal = (student: UserType | null = null) => {
    setCustomStudDept('');
    if (student) {
      setEditingStudent(student);
      setStudName(student.name);
      setStudEmail(student.email);
      setStudPassword('');
      setStudDept(student.departmentId || '');
      setStudSem(student.semester || 'Semester 1');
    } else {
      setEditingStudent(null);
      setStudName('');
      setStudEmail('');
      setStudPassword('');
      setStudDept(data.departments[0]?.id || '');
      setStudSem('Semester 1');
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudentAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studName || !studEmail || (!editingStudent && !studPassword)) {
      showToast('Please fill in required fields.', 'error');
      return;
    }

    const emailKey = studEmail.toLowerCase();
    
    if (!editingStudent && data.users[emailKey]) {
      showToast('A user with this email already exists.', 'error');
      return;
    }

    let finalDeptId = studDept;
    let updatedDepartments = [...data.departments];
    if (studDept === 'other') {
      if (!customStudDept.trim()) {
        showToast('Please enter the custom department name.', 'error');
        return;
      }
      const existing = data.departments.find(
        (d) => d.name.toLowerCase() === customStudDept.trim().toLowerCase()
      );
      if (existing) {
        finalDeptId = existing.id;
      } else {
        const newDeptId = `dep-${Date.now()}`;
        const newDept = {
          id: newDeptId,
          name: customStudDept.trim(),
          code: generateDeptCode(customStudDept)
        };
        updatedDepartments.push(newDept);
        finalDeptId = newDeptId;
      }
    }

    const targetUser: UserType = {
      id: editingStudent ? editingStudent.id : `usr-${Date.now()}`,
      name: studName,
      email: studEmail,
      role: 'student',
      departmentId: finalDeptId,
      semester: studSem,
      status: 'approved'
    };

    const targetPassword = studPassword ? studPassword : (data.users[emailKey]?.password || 'student123');

    const updatedUsers = {
      ...data.users,
      [emailKey]: {
        password: targetPassword,
        info: targetUser
      }
    };

    syncData({
      ...data,
      departments: updatedDepartments,
      users: updatedUsers
    });
    showToast(editingStudent ? 'Student updated successfully!' : 'Student registered successfully!', 'success');
    setIsStudentModalOpen(false);
  };

  const handleToggleAssignedSubject = (subjectId: string) => {
    setFacAssignedSubjects((prev) => 
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  // --- Render Helpers ---
  const getSubjectName = (id: string) => {
    return data.subjects.find((s) => s.id === id)?.name || 'Unknown Subject';
  };

  const getSubjectCode = (id: string) => {
    return data.subjects.find((s) => s.id === id)?.code || '';
  };

  const getDeptName = (id: string) => {
    return data.departments.find((d) => d.id === id)?.name || 'Unknown Department';
  };

  const getDeptCode = (id: string) => {
    return data.departments.find((d) => d.id === id)?.code || '';
  };

  // --- Filter Logic ---

  // Admin Materials filter
  const filteredAdminMaterials = data.materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          m.description.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesDept = adminSelectedDept ? m.departmentId === adminSelectedDept : true;
    const matchesSem = adminSelectedSem ? m.semester === adminSelectedSem : true;
    const matchesCat = adminSelectedCategory ? m.category === adminSelectedCategory : true;
    return matchesSearch && matchesDept && matchesSem && matchesCat;
  });

  // Faculty Materials filter
  const filteredFacultyMaterials = data.materials.filter((m) => {
    // Only materials uploaded by this faculty
    const isOwner = m.uploadedByEmail?.toLowerCase() === currentUser?.email?.toLowerCase();
    const matchesSearch = m.title.toLowerCase().includes(facultySearch.toLowerCase()) ||
                          m.description.toLowerCase().includes(facultySearch.toLowerCase());
    const matchesCat = facultySelectedCategory ? m.category === facultySelectedCategory : true;
    return isOwner && matchesSearch && matchesCat;
  });

  // Student Portal filter
  const filteredStudentMaterials = data.materials.filter((m) => {
    // Only approved materials, plus student's own pending/rejected ones for visibility
    const isApproved = m.status === 'approved';
    const isOwner = m.uploadedByEmail?.toLowerCase() === currentUser?.email?.toLowerCase();
    if (!isApproved && !isOwner) return false;

    const matchesSearch = m.title.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          m.description.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDept = studentSelectedDept ? m.departmentId === studentSelectedDept : true;
    const matchesSem = studentSelectedSem ? m.semester === studentSelectedSem : true;
    const matchesSubject = studentSelectedSubject ? m.subjectId === studentSelectedSubject : true;
    const matchesCategory = studentSelectedCategory ? m.category === studentSelectedCategory : true;

    return matchesSearch && matchesDept && matchesSem && matchesSubject && matchesCategory;
  });

  const studentPendingMaterials = data.materials.filter(
    (m) => m.uploadedByEmail?.toLowerCase() === currentUser?.email?.toLowerCase() && m.status !== 'approved'
  );

  // Statistics
  const totalDepts = data.departments.length;
  const totalSubs = data.subjects.length;
  const totalMaterials = data.materials.filter((m) => m.status === 'approved').length;
  
  const userList = Object.values(data.users).map((u) => u.info);
  const totalStudents = userList.filter((u) => u.role === 'student').length;
  const totalFaculty = userList.filter((u) => u.role === 'faculty').length;
  const pendingRequests = data.materials.filter((m) => m.status === 'pending');
  const pendingFacultyCount = userList.filter((u) => u.role === 'faculty' && u.status === 'pending').length;
  const recentUploads = data.materials
    .filter((m) => m.status === 'approved')
    .slice(0, 5);

  // Derived Notifications for Admin
  const derivedNotifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'faculty_request' | 'material_request';
    targetTab: string;
    timestamp: string;
  }> = [];

  if (currentUser?.role === 'admin') {
    // 1. Pending faculty requests
    userList
      .filter((u) => u.role === 'faculty' && u.status === 'pending')
      .forEach((u) => {
        derivedNotifications.push({
          id: `noti-fac-${u.email}`,
          title: 'New Faculty Registration',
          message: `${u.name} has requested faculty approval.`,
          type: 'faculty_request',
          targetTab: 'faculty',
          timestamp: 'Awaiting Action'
        });
      });

    // 2. Pending material requests
    pendingRequests.forEach((m) => {
      derivedNotifications.push({
        id: `noti-mat-${m.id}`,
        title: 'Pending Material Upload',
        message: `Student "${m.uploadedBy}" uploaded "${m.title}" for approval.`,
        type: 'material_request',
        targetTab: 'approvals',
        timestamp: m.uploadDate
      });
    });
  }

  // --- Screen Renders ---

  if (isLoadingData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ fontWeight: 500 }}>Initializing college database...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Auth / Login Page Render
  if (!currentUser) {
    return (
      <div className="login-page">
        {/* Toast notifications inside login */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <div className="toast-message">{toast.message}</div>
              <button className="toast-close-btn" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <BookOpen size={30} />
            </div>
            <h2>EduStream Portal</h2>
            <p className="login-subtitle">College Course Material Management System</p>
          </div>

          <div className="login-body">
            {!isRegistering ? (
              // Login Form
              <form onSubmit={handleLogin}>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn ${authRole === 'student' ? 'active' : ''}`}
                    onClick={() => setAuthRole('student')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${authRole === 'faculty' ? 'active' : ''}`}
                    onClick={() => setAuthRole('faculty')}
                  >
                    Faculty
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <div className="search-input-wrapper">
                    <Mail size={18} />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@college.edu"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="search-input-wrapper">
                    <Lock size={18} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  Secure Sign In
                </button>

                <div className="form-footer-text">
                  New {authRole === 'faculty' ? 'faculty member' : 'student'}?{' '}
                  <span className="form-link" onClick={() => setIsRegistering(true)}>
                    Create dynamic portal account
                  </span>
                </div>
              </form>
            ) : (
              // Registration Form (For Students / Faculty)
              <form onSubmit={handleRegister}>
                <div className="role-selector" style={{ marginBottom: '20px' }}>
                  <button
                    type="button"
                    className={`role-btn ${authRole === 'student' ? 'active' : ''}`}
                    onClick={() => { setAuthRole('student'); setAuthDept(''); }}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${authRole === 'faculty' ? 'active' : ''}`}
                    onClick={() => { setAuthRole('faculty'); setAuthDept(''); }}
                  >
                    Faculty
                  </button>
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 700 }}>
                  {authRole === 'faculty' ? 'Faculty Portal Signup' : 'Student Portal Signup'}
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={authRole === 'faculty' ? 'faculty@college.edu' : 'student@college.edu'}
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Create password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-input form-select"
                    value={authDept}
                    onChange={(e) => {
                      setAuthDept(e.target.value);
                      if (e.target.value !== 'other') {
                        setCustomAuthDept('');
                      }
                    }}
                    required
                  >
                    <option value="">Select Department</option>
                    {data.departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                    <option value="other">Other (Add Custom)</option>
                  </select>
                </div>

                {authDept === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Custom Department Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Civil Engineering"
                      value={customAuthDept}
                      onChange={(e) => setCustomAuthDept(e.target.value)}
                      required
                    />
                  </div>
                )}

                {authRole === 'student' && (
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select
                      className="form-input form-select"
                      value={authSem}
                      onChange={(e) => setAuthSem(e.target.value)}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={`Semester ${s}`}>{`Semester ${s}`}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  Register {authRole === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
                </button>

                <div className="form-footer-text">
                  Already have an account?{' '}
                  <span className="form-link" onClick={() => setIsRegistering(false)}>
                    Sign In
                  </span>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    );
  }

  // --- Main Application UI Layout ---
  return (
    <div className="app-container">
      {/* Toast notifications container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close-btn" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <BookOpen size={24} />
          <span className="sidebar-logo-text">EduStream LMS</span>
        </div>

        <nav className="sidebar-menu">
          {/* Admin Navigation */}
          {currentUser.role === 'admin' && (
            <>
              <button
                className={`sidebar-menu-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              >
                <Sliders /> Dashboard
              </button>
              <button
                className={`sidebar-menu-item ${currentTab === 'materials' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('materials'); setMobileMenuOpen(false); }}
              >
                <FileText /> Manage Materials
              </button>
              <button
                className={`sidebar-menu-item ${currentTab === 'approvals' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('approvals'); setMobileMenuOpen(false); }}
              >
                <ShieldCheck /> Pending Approvals
                {pendingRequests.length > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--danger)', color: 'white', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {pendingRequests.length}
                  </span>
                )}
              </button>
              <button
                className={`sidebar-menu-item ${currentTab === 'departments' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('departments'); setMobileMenuOpen(false); }}
              >
                <Layers /> Departments & Subjects
              </button>
              <button
                className={`sidebar-menu-item ${currentTab === 'faculty' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('faculty'); setMobileMenuOpen(false); }}
              >
                <Users /> Manage Faculty
                {pendingFacultyCount > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--warning)', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {pendingFacultyCount}
                  </span>
                )}
              </button>
              <button
                className={`sidebar-menu-item ${currentTab === 'students' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('students'); setMobileMenuOpen(false); }}
              >
                <Users /> Manage Students
              </button>
            </>
          )}

          {/* Faculty Navigation */}
          {currentUser.role === 'faculty' && (
            <>
              <button
                className={`sidebar-menu-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              >
                <Sliders /> Dashboard
              </button>
              <button
                className={`sidebar-menu-item ${currentTab === 'faculty-uploads' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('faculty-uploads'); setMobileMenuOpen(false); }}
              >
                <FolderOpen /> My Uploaded Materials
              </button>
            </>
          )}

          {/* Student Navigation */}
          {currentUser.role === 'student' && (
            <>
              <button
                className={`sidebar-menu-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              >
                <BookOpen /> Student Learning Portal
              </button>
              <button
                className={`sidebar-menu-item ${currentTab === 'student-uploads' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('student-uploads'); setMobileMenuOpen(false); }}
              >
                <PlusCircle /> Upload Personal Notes
              </button>
            </>
          )}

          <button
            className={`sidebar-menu-item ${currentTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('profile'); setMobileMenuOpen(false); }}
          >
            <User /> My Profile
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-summary">
            <div className="user-avatar">
              {currentUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{currentUser.name}</div>
              <span className={`user-role-badge ${currentUser.role}`}>{currentUser.role}</span>
            </div>
          </div>

          <button className="btn btn-danger btn-outline btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        {/* Sticky Header */}
        <header className="header">
          <div className="header-title-section">
            <button
              className="action-icon-btn mobile-menu-toggle"
              style={{ marginRight: '12px' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu />
            </button>
            <h1>
              {currentTab === 'dashboard' && (currentUser.role === 'student' ? 'Learning Dashboard' : 'System Overview')}
              {currentTab === 'materials' && 'Course Materials Vault'}
              {currentTab === 'approvals' && 'Pending Academic Approvals'}
              {currentTab === 'departments' && 'Academic Structuring'}
              {currentTab === 'faculty' && 'Faculty Registry'}
              {currentTab === 'students' && 'Student Enrollment'}
              {currentTab === 'faculty-uploads' && 'My Lecturing Material'}
              {currentTab === 'student-uploads' && 'Personal Notes Directory'}
              {currentTab === 'profile' && 'User Account Management'}
            </h1>
            <span className="header-subtitle">
              {currentUser.role === 'student' && `${getDeptName(currentUser.departmentId || '')} • ${currentUser.semester}`}
              {currentUser.role === 'faculty' && `Assigned Subject Coordinator`}
              {currentUser.role === 'admin' && 'Central Administration Access'}
            </span>
          </div>

          <div className="header-actions">
            {currentUser.role === 'admin' && (
              <div className="notifications-dropdown-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  className="theme-toggle-btn"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  style={{ position: 'relative' }}
                  title="System Notifications"
                >
                  <Bell size={18} />
                  {derivedNotifications.length > 0 && (
                    <span className="notification-badge">
                      {derivedNotifications.length}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="notifications-dropdown card" style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '10px',
                    width: '320px',
                    zIndex: 1000,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px 0',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--border-radius-md)'
                  }}>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>System Notifications</span>
                      <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>{derivedNotifications.length} Pending</span>
                    </div>
                    <div style={{ padding: '4px 0' }}>
                      {derivedNotifications.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          No pending notifications
                        </div>
                      ) : (
                        derivedNotifications.map((noti) => (
                          <div
                            key={noti.id}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            className="notification-item"
                            onClick={() => {
                              setCurrentTab(noti.targetTab);
                              setIsNotificationsOpen(false);
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '2px' }}>
                              {noti.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '4px' }}>
                              {noti.message}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              {noti.timestamp}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* --- ROUTED VIEWS CONTENT --- */}

        {/* 1. DASHBOARD VIEW */}
        {currentTab === 'dashboard' && (
          <div>
            {/* A. ADMIN DASHBOARD */}
            {currentUser.role === 'admin' && (
              <>
                {pendingFacultyCount > 0 && (
                  <div style={{
                    marginBottom: '20px',
                    padding: '16px',
                    background: 'var(--warning-light)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--warning)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Users style={{ color: 'var(--warning)' }} />
                      <div>
                        <strong style={{ display: 'block', fontWeight: 700 }}>Faculty Registrations Awaiting Approval</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          There are {pendingFacultyCount} faculty member accounts waiting for your review. Approved faculty members will be allowed to sign in.
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-warning btn-sm" onClick={() => setCurrentTab('faculty')}>
                      Review Now
                    </button>
                  </div>
                )}

                <div className="stats-grid">
                  <div className="stat-card primary">
                    <div className="stat-info">
                      <span className="stat-value">{totalDepts}</span>
                      <span className="stat-label">Total Departments</span>
                    </div>
                    <div className="stat-icon"><Layers size={24} /></div>
                  </div>

                  <div className="stat-card secondary">
                    <div className="stat-info">
                      <span className="stat-value">{totalSubs}</span>
                      <span className="stat-label">Total Subjects</span>
                    </div>
                    <div className="stat-icon"><BookOpen size={24} /></div>
                  </div>

                  <div className="stat-card success">
                    <div className="stat-info">
                      <span className="stat-value">{totalMaterials}</span>
                      <span className="stat-label">Active Materials</span>
                    </div>
                    <div className="stat-icon"><FileText size={24} /></div>
                  </div>

                  <div className="stat-card warning">
                    <div className="stat-info">
                      <span className="stat-value">{totalFaculty}</span>
                      <span className="stat-label">Faculty Members</span>
                    </div>
                    <div className="stat-icon"><Users size={24} /></div>
                  </div>

                  <div className="stat-card info" style={{ borderLeft: 'none' }}>
                    <div className="stat-info">
                      <span className="stat-value">{totalStudents}</span>
                      <span className="stat-label">Enrolled Students</span>
                    </div>
                    <div className="stat-icon"><Users size={24} /></div>
                  </div>

                  {pendingRequests.length > 0 && (
                    <div className="stat-card danger" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('approvals')}>
                      <div className="stat-info">
                        <span className="stat-value">{pendingRequests.length}</span>
                        <span className="stat-label">Pending Approval Requests</span>
                      </div>
                      <div className="stat-icon"><Clock size={24} /></div>
                    </div>
                  )}

                  {pendingFacultyCount > 0 && (
                    <div className="stat-card warning" style={{ cursor: 'pointer', borderLeft: 'none' }} onClick={() => setCurrentTab('faculty')}>
                      <div className="stat-info">
                        <span className="stat-value">{pendingFacultyCount}</span>
                        <span className="stat-label">Pending Faculty Approvals</span>
                      </div>
                      <div className="stat-icon"><Clock size={24} /></div>
                    </div>
                  )}
                </div>

                <div className="dashboard-sections">
                  {/* Left Column: Recent Uploads */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Recent Approved Materials</h3>
                      <button className="btn btn-outline btn-sm" onClick={() => setCurrentTab('materials')}>
                        View All
                      </button>
                    </div>
                    <div className="card-body" style={{ padding: '0' }}>
                      <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Material Title</th>
                              <th>Subject / Sem</th>
                              <th>Category</th>
                              <th>Date Uploaded</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentUploads.length === 0 ? (
                              <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                                  No materials uploaded yet.
                                </td>
                              </tr>
                            ) : (
                              recentUploads.map((mat) => (
                                <tr key={mat.id}>
                                  <td style={{ fontWeight: 600 }}>{mat.title}</td>
                                  <td>
                                    <div>{getSubjectCode(mat.subjectId)} - {getSubjectName(mat.subjectId)}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                      {getDeptCode(mat.departmentId)} • {mat.semester}
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`material-type-tag ${mat.category.toLowerCase().replace(/\s+/g, '_')}`}>
                                      {mat.category}
                                    </span>
                                  </td>
                                  <td>{mat.uploadDate}</td>
                                  <td>
                                    <button className="btn btn-outline btn-sm" onClick={() => downloadMaterial(mat)}>
                                      <Download size={14} /> Download
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Stats/Approvals */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Pending Approvals</h3>
                      {pendingRequests.length > 0 && (
                        <button className="btn btn-danger btn-sm" onClick={() => setCurrentTab('approvals')}>
                          Moderate
                        </button>
                      )}
                    </div>
                    <div className="card-body">
                      {pendingRequests.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                          <CheckCircle size={32} style={{ color: 'var(--success)', marginBottom: '8px' }} />
                          <p>All student uploads processed!</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {pendingRequests.slice(0, 3).map((req) => (
                            <div
                              key={req.id}
                              style={{
                                padding: '12px',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--border-radius-md)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
                              }}
                            >
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{req.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                By <strong>{req.uploadedBy}</strong> ({req.uploadedByRole})
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                <button
                                  className="btn btn-success btn-sm"
                                  style={{ padding: '4px 8px', flex: 1 }}
                                  onClick={() => handleApproveMaterial(req.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  style={{ padding: '4px 8px', flex: 1 }}
                                  onClick={() => handleRejectMaterial(req.id)}
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* B. FACULTY DASHBOARD */}
            {currentUser.role === 'faculty' && (
              <>
                <div className="stats-grid">
                  <div className="stat-card primary">
                    <div className="stat-info">
                      <span className="stat-value">{currentUser.assignedSubjects?.length || 0}</span>
                      <span className="stat-label">Assigned Subjects</span>
                    </div>
                    <div className="stat-icon"><BookOpen size={24} /></div>
                  </div>

                  <div className="stat-card success">
                    <div className="stat-info">
                      <span className="stat-value">
                        {data.materials.filter((m) => m.uploadedByEmail === currentUser.email && m.status === 'approved').length}
                      </span>
                      <span className="stat-label">Your Approved Uploads</span>
                    </div>
                    <div className="stat-icon"><FileText size={24} /></div>
                  </div>

                  <div className="stat-card secondary">
                    <div className="stat-info">
                      <span className="stat-value">
                        {data.materials.filter((m) => m.status === 'approved').length}
                      </span>
                      <span className="stat-label">Total Library Materials</span>
                    </div>
                    <div className="stat-icon"><FolderOpen size={24} /></div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title font-bold">Your Assigned Subjects Registry</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenUploadModal()}>
                      <Plus size={16} /> Publish Material
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="subject-card-grid">
                      {currentUser.assignedSubjects?.map((subId) => {
                        const subjectObj = data.subjects.find((s) => s.id === subId);
                        if (!subjectObj) return null;
                        const filesCount = data.materials.filter((m) => m.subjectId === subId && m.status === 'approved').length;
                        
                        return (
                          <div key={subId} className="subject-card" onClick={() => {
                            setFacultySelectedCategory('');
                            setFacultySearch(subjectObj.name);
                            setCurrentTab('faculty-uploads');
                          }}>
                            <div className="subject-card-code">{subjectObj.code}</div>
                            <div className="subject-card-title">{subjectObj.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {getDeptCode(subjectObj.departmentId)} • {subjectObj.semester}
                            </div>
                            <div className="subject-card-count">
                              <FileText size={14} /> {filesCount} Approved Files
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* C. STUDENT LEARNING PORTAL */}
            {currentUser.role === 'student' && (
              <>
                {/* Visual Semester / Department Browse */}
                <div className="filter-section">
                  <h3 style={{ marginBottom: '14px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Personalize Academic Portal
                  </h3>
                  <div className="filter-grid">
                    <div className="search-input-wrapper">
                      <Search size={18} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search notes, PPTs, exam papers by name..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="form-input form-select"
                      value={studentSelectedDept}
                      onChange={(e) => {
                        setStudentSelectedDept(e.target.value);
                        setStudentSelectedSubject('');
                      }}
                    >
                      <option value="">All Departments</option>
                      {data.departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>

                    <select
                      className="form-input form-select"
                      value={studentSelectedSem}
                      onChange={(e) => {
                        setStudentSelectedSem(e.target.value);
                        setStudentSelectedSubject('');
                      }}
                    >
                      <option value="">All Semesters</option>
                      {[1,2,3,4,5,6,7,8].map((s) => (
                        <option key={s} value={`Semester ${s}`}>{`Semester ${s}`}</option>
                      ))}
                    </select>

                    <select
                      className="form-input form-select"
                      value={studentSelectedCategory}
                      onChange={(e) => setStudentSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="Official Syllabus">Official Syllabus</option>
                      <option value="Lecture Notes">Lecture Notes</option>
                      <option value="PPT Presentations">PPT Presentations</option>
                      <option value="Assignments">Assignments</option>
                      <option value="Lab Manuals">Lab Manuals</option>
                      <option value="Previous Year Question Papers">Question Papers</option>
                      <option value="Reference Materials">Reference Materials</option>
                    </select>
                  </div>

                  {/* Subject List filters */}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Select Subject:
                    </span>
                    <button
                      className={`btn btn-sm ${!studentSelectedSubject ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setStudentSelectedSubject('')}
                    >
                      All Subjects
                    </button>
                    {data.subjects
                      .filter((s) => 
                        (!studentSelectedDept || s.departmentId === studentSelectedDept) &&
                        (!studentSelectedSem || s.semester === studentSelectedSem)
                      )
                      .map((sub) => (
                        <button
                          key={sub.id}
                          className={`btn btn-sm ${studentSelectedSubject === sub.id ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setStudentSelectedSubject(sub.id)}
                        >
                          {sub.code} - {sub.name}
                        </button>
                      ))
                    }
                  </div>
                </div>

                {/* Material Catalog Display */}
                <div>
                  <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Available Course Materials ({filteredStudentMaterials.length})
                  </h3>
                  
                  {filteredStudentMaterials.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <FolderOpen size={30} />
                      </div>
                      <h3>No Course Materials Found</h3>
                      <p>Try refining your search filter or checking other semesters.</p>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setStudentSearch('');
                          setStudentSelectedDept(currentUser.departmentId || '');
                          setStudentSelectedSem(currentUser.semester || 'Semester 3');
                          setStudentSelectedSubject('');
                          setStudentSelectedCategory('');
                        }}
                      >
                        Reset to My Semester
                      </button>
                    </div>
                  ) : (
                    <div className="materials-grid">
                      {filteredStudentMaterials.map((material) => (
                        <div key={material.id} className="material-card">
                          <div className="material-card-header">
                            <div>
                              <span className={`material-type-tag ${material.category.toLowerCase().replace(/\s+/g, '_')}`}>
                                {material.category}
                              </span>
                              <h4 className="material-card-title">{material.title}</h4>
                            </div>
                            <span className="material-meta-pill">{material.semester}</span>
                          </div>

                          <div className="material-card-body">
                            <p className="material-description">{material.description}</p>
                            
                            <div className="material-info-rows">
                              <div className="material-info-row">
                                <Book size={14} />
                                <span>{getSubjectCode(material.subjectId)} - {getSubjectName(material.subjectId)}</span>
                              </div>
                              <div className="material-info-row">
                                <Layers size={14} />
                                <span>{getDeptName(material.departmentId)}</span>
                              </div>
                              <div className="material-info-row">
                                <User size={14} />
                                <span>Uploaded by <strong>{material.uploadedBy}</strong> ({material.uploadedByRole})</span>
                              </div>
                              <div className="material-info-row">
                                <Calendar size={14} />
                                <span>Published: {material.uploadDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="material-card-footer">
                            <span className="material-file-info">
                              <File size={14} /> {material.fileSize}
                            </span>
                            
                            {material.status !== 'approved' ? (
                              <span className={`material-status-pill ${material.status}`}>
                                {material.status}
                              </span>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => downloadMaterial(material)}>
                                <Download size={14} /> Download
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* 2. ADMIN MANAGE MATERIALS VIEW */}
        {currentTab === 'materials' && currentUser.role === 'admin' && (
          <div>
            <div className="filter-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Filter & Search Repository</h3>
                <button className="btn btn-primary" onClick={() => handleOpenUploadModal()}>
                  <Plus size={16} /> Upload New Material
                </button>
              </div>
              
              <div className="filter-grid">
                <div className="search-input-wrapper">
                  <Search size={18} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search materials..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                </div>

                <select
                  className="form-input form-select"
                  value={adminSelectedDept}
                  onChange={(e) => setAdminSelectedDept(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {data.departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>

                <select
                  className="form-input form-select"
                  value={adminSelectedSem}
                  onChange={(e) => setAdminSelectedSem(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {[1,2,3,4,5,6,7,8].map((s) => (
                    <option key={s} value={`Semester ${s}`}>{`Semester ${s}`}</option>
                  ))}
                </select>

                <select
                  className="form-input form-select"
                  value={adminSelectedCategory}
                  onChange={(e) => setAdminSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Official Syllabus">Official Syllabus</option>
                  <option value="Lecture Notes">Lecture Notes</option>
                  <option value="PPT Presentations">PPT Presentations</option>
                  <option value="Assignments">Assignments</option>
                  <option value="Lab Manuals">Lab Manuals</option>
                  <option value="Previous Year Question Papers">Question Papers</option>
                  <option value="Reference Materials">Reference Materials</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Material Title</th>
                    <th>Dept & Sem</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Uploaded By</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                        No course materials match the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAdminMaterials.map((mat) => (
                      <tr key={mat.id}>
                        <td style={{ fontWeight: 600 }}>{mat.title}</td>
                        <td>
                          <div>{getDeptCode(mat.departmentId)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mat.semester}</div>
                        </td>
                        <td>{getSubjectName(mat.subjectId)}</td>
                        <td>
                          <span className={`material-type-tag ${mat.category.toLowerCase().replace(/\s+/g, '_')}`}>
                            {mat.category}
                          </span>
                        </td>
                        <td>
                          <div>{mat.uploadedBy}</div>
                          <span className={`user-badge ${mat.uploadedByRole}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                            {mat.uploadedByRole}
                          </span>
                        </td>
                        <td>{mat.uploadDate}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="action-icon-btn" onClick={() => downloadMaterial(mat)} title="Download simulated file">
                              <Download size={16} />
                            </button>
                            <button className="action-icon-btn" onClick={() => handleOpenUploadModal(mat)} title="Edit material meta details">
                              <Edit size={16} />
                            </button>
                            <button className="action-icon-btn" onClick={() => handleDeleteMaterial(mat.id)} title="Delete material" style={{ color: 'var(--danger)' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ADMIN PENDING APPROVALS */}
        {currentTab === 'approvals' && currentUser.role === 'admin' && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Evaluate student submission documents before publishing them on public LMS portal.
            </h3>

            {pendingRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                  <CheckCircle size={30} />
                </div>
                <h3>Approval Queue Empty</h3>
                <p>No students have submitted notes or documents awaiting moderation.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pendingRequests.map((req) => (
                  <div key={req.id} className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div className="card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`material-type-tag ${req.category.toLowerCase().replace(/\s+/g, '_')}`}>
                          {req.category}
                        </span>
                        <h4 className="card-title" style={{ fontSize: '1.1rem' }}>{req.title}</h4>
                      </div>
                      <span className="material-meta-pill" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                        Needs Verification
                      </span>
                    </div>
                    <div className="card-body">
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
                        <strong>Description:</strong> {req.description}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '16px', background: 'var(--bg-main)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploader Name</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.uploadedBy} (Student)</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{req.uploadedByEmail}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subject details</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{getSubjectName(req.subjectId)}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {getDeptName(req.departmentId)} • {req.semester}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>File details</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>{req.fileName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size: {req.fileSize}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-outline" onClick={() => downloadMaterial(req)}>
                          <Eye size={16} /> Preview Content
                        </button>
                        <button className="btn btn-success" onClick={() => handleApproveMaterial(req.id)}>
                          <Check size={16} /> Approve & Publish
                        </button>
                        <button className="btn btn-danger" onClick={() => handleRejectMaterial(req.id)}>
                          <X size={16} /> Reject Submission
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. ADMIN DEPARTMENTS & SUBJECTS */}
        {currentTab === 'departments' && currentUser.role === 'admin' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              {/* Departments column */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Departments</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => handleOpenDeptModal()}>
                    <Plus size={14} /> Add
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.departments.map((dept) => (
                        <tr key={dept.id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{dept.code}</td>
                          <td>{dept.name}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="action-icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => handleOpenDeptModal(dept)}>
                                <Edit size={12} />
                              </button>
                              <button className="action-icon-btn" style={{ width: '28px', height: '28px', color: 'var(--danger)' }} onClick={() => handleDeleteDept(dept.id)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subjects column */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Subjects Registry</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => handleOpenSubjectModal()}>
                    <Plus size={14} /> Add Subject
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Subject Name</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.subjects.map((sub) => (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: 700 }}>{sub.code}</td>
                          <td style={{ fontWeight: 600 }}>{sub.name}</td>
                          <td>{getDeptCode(sub.departmentId)}</td>
                          <td>{sub.semester}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="action-icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => handleOpenSubjectModal(sub)}>
                                <Edit size={12} />
                              </button>
                              <button className="action-icon-btn" style={{ width: '28px', height: '28px', color: 'var(--danger)' }} onClick={() => handleDeleteSubject(sub.id)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. ADMIN MANAGE FACULTY */}
        {currentTab === 'faculty' && currentUser.role === 'admin' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Faculty Members</h3>
              <button className="btn btn-primary" onClick={() => handleOpenFacultyModal()}>
                <Plus size={16} /> Register New Faculty
              </button>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Assigned Subjects</th>
                    <th>Approval Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(data.users)
                    .filter((u) => u.info.role === 'faculty')
                    .map((entry) => {
                      const user = entry.info;
                      const statusVal = user.status || 'approved';
                      return (
                        <tr key={user.id}>
                          <td style={{ fontWeight: 600 }}>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{getDeptName(user.departmentId || '')}</td>
                          <td>
                            <div className="pill-container">
                              {user.assignedSubjects && user.assignedSubjects.length > 0 ? (
                                user.assignedSubjects.map((subId) => (
                                  <span key={subId} className="pill-item">
                                    {getSubjectCode(subId)}
                                  </span>
                                ))
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`material-status-pill ${statusVal}`}>
                              {statusVal}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {statusVal === 'pending' ? (
                                <>
                                  <button 
                                    className="btn btn-success btn-sm" 
                                    onClick={() => handleApproveFaculty(user.email)}
                                    style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Check size={12} /> Approve
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => handleRejectFaculty(user.email)}
                                    style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <X size={12} /> Reject
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="action-icon-btn" onClick={() => handleOpenFacultyModal(user)}>
                                    <Edit size={14} />
                                  </button>
                                  <button className="action-icon-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteUser(user.email)}>
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. ADMIN MANAGE STUDENTS */}
        {currentTab === 'students' && currentUser.role === 'admin' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Enrolled Student Registry</h3>
              <button className="btn btn-primary" onClick={() => handleOpenStudentModal()}>
                <Plus size={16} /> Register New Student
              </button>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(data.users)
                    .filter((u) => u.info.role === 'student')
                    .map((entry) => {
                      const user = entry.info;
                      return (
                        <tr key={user.id}>
                          <td style={{ fontWeight: 600 }}>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{getDeptName(user.departmentId || '')}</td>
                          <td>{user.semester}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="action-icon-btn" onClick={() => handleOpenStudentModal(user)}>
                                <Edit size={14} />
                              </button>
                              <button className="action-icon-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteUser(user.email)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. FACULTY UPLOADS VIEW */}
        {currentTab === 'faculty-uploads' && currentUser.role === 'faculty' && (
          <div>
            <div className="filter-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Manage Personal Handouts</h3>
                <button className="btn btn-primary" onClick={() => handleOpenUploadModal()}>
                  <Plus size={16} /> Upload Learning Material
                </button>
              </div>

              <div className="filter-grid" style={{ gridTemplateColumns: '3fr 1fr' }}>
                <div className="search-input-wrapper">
                  <Search size={18} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by title or topic..."
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                  />
                </div>

                <select
                  className="form-input form-select"
                  value={facultySelectedCategory}
                  onChange={(e) => setFacultySelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Lecture Notes">Lecture Notes</option>
                  <option value="PPT Presentations">PPT Presentations</option>
                  <option value="Assignments">Assignments</option>
                  <option value="Lab Manuals">Lab Manuals</option>
                  <option value="Previous Year Question Papers">Question Papers</option>
                  <option value="Reference Materials">Reference Materials</option>
                </select>
              </div>
            </div>

            {filteredFacultyMaterials.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FolderOpen size={30} />
                </div>
                <h3>No Materials Published</h3>
                <p>Upload lecture notes, assignment files, or reference links for your students.</p>
              </div>
            ) : (
              <div className="materials-grid">
                {filteredFacultyMaterials.map((material) => (
                  <div key={material.id} className="material-card">
                    <div className="material-card-header">
                      <div>
                        <span className={`material-type-tag ${material.category.toLowerCase().replace(/\s+/g, '_')}`}>
                          {material.category}
                        </span>
                        <h4 className="material-card-title">{material.title}</h4>
                      </div>
                      <span className="material-meta-pill">{material.semester}</span>
                    </div>

                    <div className="material-card-body">
                      <p className="material-description">{material.description}</p>
                      
                      <div className="material-info-rows">
                        <div className="material-info-row">
                          <Book size={14} />
                          <span>{getSubjectCode(material.subjectId)} - {getSubjectName(material.subjectId)}</span>
                        </div>
                        <div className="material-info-row">
                          <Layers size={14} />
                          <span>{getDeptName(material.departmentId)}</span>
                        </div>
                        <div className="material-info-row">
                          <Calendar size={14} />
                          <span>Published on: {material.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="material-card-footer">
                      <span className="material-file-info">
                        <File size={14} /> {material.fileSize}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-icon-btn" onClick={() => handleOpenUploadModal(material)} title="Edit details">
                          <Edit size={14} />
                        </button>
                        <button className="action-icon-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteMaterial(material.id)} title="Delete material">
                          <Trash2 size={14} />
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => downloadMaterial(material)}>
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 8. STUDENT PERSONAL UPLOADS VIEW */}
        {currentTab === 'student-uploads' && currentUser.role === 'student' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Upload Personal Notes & Study Material</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Contribute notes or past questions to the college catalog. Uploads require admin verification.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => handleOpenUploadModal()}>
                <Plus size={16} /> Upload Notes
              </button>
            </div>

            <h3 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 700 }}>Your Contributions History</h3>
            
            {studentPendingMaterials.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <PlusCircle size={30} />
                </div>
                <h3>No Submissions Yet</h3>
                <p>Any materials you upload will display here along with their verification status (Pending/Approved/Rejected).</p>
              </div>
            ) : (
              <div className="materials-grid">
                {studentPendingMaterials.map((material) => (
                  <div key={material.id} className="material-card">
                    <div className="material-card-header">
                      <div>
                        <span className={`material-type-tag ${material.category.toLowerCase().replace(/\s+/g, '_')}`}>
                          {material.category}
                        </span>
                        <h4 className="material-card-title">{material.title}</h4>
                      </div>
                      <span className="material-meta-pill">{material.semester}</span>
                    </div>

                    <div className="material-card-body">
                      <p className="material-description">{material.description}</p>
                      
                      <div className="material-info-rows">
                        <div className="material-info-row">
                          <Book size={14} />
                          <span>{getSubjectName(material.subjectId)}</span>
                        </div>
                        <div className="material-info-row">
                          <Calendar size={14} />
                          <span>Date Submitted: {material.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="material-card-footer">
                      <span className="material-file-info">
                        <File size={14} /> {material.fileSize}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`material-status-pill ${material.status}`}>
                          {material.status}
                        </span>
                        <button className="action-icon-btn" style={{ color: 'var(--danger)', width: '32px', height: '32px' }} onClick={() => handleDeleteMaterial(material.id)} title="Delete submission">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. MY PROFILE TAB */}
        {currentTab === 'profile' && (
          <div style={{ maxWidth: '600px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Manage Account Details</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">College Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={currentUser.email}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">System Access Permission Role</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentUser.role.toUpperCase()}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed', textTransform: 'uppercase' }}
                    />
                  </div>

                  {currentUser.role === 'student' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Department Mapping</label>
                        <input
                          type="text"
                          className="form-input"
                          value={getDeptName(currentUser.departmentId || '')}
                          disabled
                          style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Current Academic Semester</label>
                        <input
                          type="text"
                          className="form-input"
                          value={currentUser.semester}
                          disabled
                          style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                      </div>
                    </>
                  )}

                  {currentUser.role === 'faculty' && (
                    <div className="form-group">
                      <label className="form-label">Department Mapping</label>
                      <input
                        type="text"
                        className="form-input"
                        value={getDeptName(currentUser.departmentId || '')}
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      />
                    </div>
                  )}

                  <hr style={{ margin: '24px 0', borderColor: 'var(--border-color)' }} />
                  
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Update Security Settings</h4>

                  <div className="form-group">
                    <label className="form-label">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- POPUP MODAL DIALOGS --- */}

      {/* 1. MATERIAL UPLOAD/EDIT MODAL */}
      {isUploadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMaterial ? 'Edit Course Material details' : 'Publish New Course Handouts'}</h3>
              <button className="modal-close-btn" onClick={() => setIsUploadModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveMaterial}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Material Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Unit 2 - Tree Traversal Algorithms"
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input form-select"
                    value={matCategory}
                    onChange={(e) => {
                      setMatCategory(e.target.value);
                      // If category changes, update mock filename
                      if (matFileName) {
                        const extMap: { [key: string]: string } = {
                          'Official Syllabus': 'pdf',
                          'Lecture Notes': 'pdf',
                          'PPT Presentations': 'pptx',
                          'Assignments': 'pdf',
                          'Lab Manuals': 'pdf',
                          'Previous Year Question Papers': 'pdf',
                          'Reference Materials': 'pdf'
                        };
                        const ext = extMap[e.target.value] || 'pdf';
                        const parts = matFileName.split('.');
                        parts[parts.length - 1] = ext;
                        setMatFileName(parts.join('.'));
                      }
                    }}
                    required
                  >
                    <option value="Official Syllabus">Official Syllabus</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="PPT Presentations">PPT Presentations</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Lab Manuals">Lab Manuals</option>
                    <option value="Previous Year Question Papers">Previous Year Question Paper</option>
                    <option value="Reference Materials">Reference Materials</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-input form-select"
                      value={matDept}
                      onChange={(e) => {
                        setMatDept(e.target.value);
                        setMatSubject(''); // reset subject selection
                        if (e.target.value !== 'other') {
                          setCustomMatDept('');
                        }
                      }}
                      required
                      disabled={currentUser.role === 'faculty'} // Faculty uploads only for their assigned dept
                    >
                      {data.departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.code}</option>
                      ))}
                      {currentUser.role !== 'faculty' && (
                        <option value="other">Other (Add Custom)</option>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Semester *</label>
                    <select
                      className="form-input form-select"
                      value={matSem}
                      onChange={(e) => setMatSem(e.target.value)}
                      required
                    >
                      {[1,2,3,4,5,6,7,8].map((s) => (
                        <option key={s} value={`Semester ${s}`}>{`Semester ${s}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {matDept === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Custom Department Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Civil Engineering"
                      value={customMatDept}
                      onChange={(e) => setCustomMatDept(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Subject Mapping *</label>
                  <select
                    className="form-input form-select"
                    value={matSubject}
                    onChange={(e) => {
                      setMatSubject(e.target.value);
                      if (e.target.value !== 'other') {
                        setCustomMatSubject('');
                      }
                    }}
                    required
                  >
                    <option value="">Select Target Subject</option>
                    {data.subjects
                      .filter((s) => {
                        const matchesDept = s.departmentId === matDept;
                        const matchesSem = s.semester === matSem;
                        if (currentUser.role === 'faculty') {
                          return matchesDept && matchesSem && currentUser.assignedSubjects?.includes(s.id);
                        }
                        return matchesDept && matchesSem;
                      })
                      .map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.code} - {sub.name}
                        </option>
                      ))
                    }
                    <option value="other">Other (Add Custom)</option>
                  </select>
                </div>

                {matSubject === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Custom Subject Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Design of Steel Structures"
                      value={customMatSubject}
                      onChange={(e) => setCustomMatSubject(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Description / Synopsis</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Provide a short description or table of contents summary of this material..."
                    value={matDesc}
                    onChange={(e) => setMatDesc(e.target.value)}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attach Material File</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input
                        type="file"
                        id="real-file-input"
                        style={{ display: 'none' }}
                        onChange={handleRealFileChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ flex: 1 }}
                        onClick={() => document.getElementById('real-file-input')?.click()}
                      >
                        Browse File Explorer
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ flex: 1, borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        onClick={() => handleMockFileSelected(matCategory)}
                      >
                        Simulate File Attachment
                      </button>
                    </div>
                    {matFileName && (
                      <span style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', color: 'var(--success)', fontWeight: 600 }}>
                        📎 {matFileName} {matFileSize ? `(${matFileSize})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMaterial ? 'Save Changes' : 'Publish Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADMIN CREATE/EDIT DEPARTMENT MODAL */}
      {isDeptModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '420px' }}>
            <div className="modal-header">
              <h3>{editingDept ? 'Modify Department Details' : 'Add New Department'}</h3>
              <button className="modal-close-btn" onClick={() => setIsDeptModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveDept}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Civil Engineering"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department Code (Short)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CIV"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsDeptModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADMIN CREATE/EDIT SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSubject ? 'Edit Subject Information' : 'Create Academic Subject'}</h3>
              <button className="modal-close-btn" onClick={() => setIsSubjectModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveSubject}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Subject Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Cryptography and Cyber Security"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CS603"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    required
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-input form-select"
                      value={subDept}
                      onChange={(e) => {
                        setSubDept(e.target.value);
                        if (e.target.value !== 'other') {
                          setCustomSubDept('');
                        }
                      }}
                      required
                    >
                      {data.departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                      <option value="other">Other (Add Custom)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select
                      className="form-input form-select"
                      value={subSem}
                      onChange={(e) => setSubSem(e.target.value)}
                      required
                    >
                      {[1,2,3,4,5,6,7,8].map((s) => (
                        <option key={s} value={`Semester ${s}`}>{`Semester ${s}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {subDept === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Custom Department Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Civil Engineering"
                      value={customSubDept}
                      onChange={(e) => setCustomSubDept(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsSubjectModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADMIN CREATE/EDIT FACULTY MODAL */}
      {isFacultyModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingFaculty ? 'Modify Faculty Settings' : 'Register Faculty Member'}</h3>
              <button className="modal-close-btn" onClick={() => setIsFacultyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveFaculty}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Prof. or Dr."
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">University Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@college.edu"
                    value={facEmail}
                    onChange={(e) => setFacEmail(e.target.value)}
                    required
                    disabled={!!editingFaculty} // Email is key
                  />
                </div>
                
                {!editingFaculty && (
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={facPassword}
                      onChange={(e) => setFacPassword(e.target.value)}
                      required={!editingFaculty}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Department Mapping</label>
                  <select
                    className="form-input form-select"
                    value={facDept}
                    onChange={(e) => {
                      setFacDept(e.target.value);
                      if (e.target.value !== 'other') {
                        setCustomFacDept('');
                      }
                    }}
                    required
                  >
                    {data.departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                    <option value="other">Other (Add Custom)</option>
                  </select>
                </div>

                {facDept === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Custom Department Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Civil Engineering"
                      value={customFacDept}
                      onChange={(e) => setCustomFacDept(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '10px' }}>Assigned Core Subjects</label>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '12px', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.subjects
                      .filter((s) => s.departmentId === facDept)
                      .map((sub) => (
                        <label key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={facAssignedSubjects.includes(sub.id)}
                            onChange={() => handleToggleAssignedSubject(sub.id)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          <span><strong>[{sub.code}]</strong> {sub.name} ({sub.semester})</span>
                        </label>
                      ))
                    }
                    {data.subjects.filter((s) => s.departmentId === facDept).length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        No subjects mapped to this department. Create subjects first.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsFacultyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Faculty Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADMIN CREATE/EDIT STUDENT MODAL */}
      {isStudentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingStudent ? 'Modify Student Enroll' : 'Register New Student'}</h3>
              <button className="modal-close-btn" onClick={() => setIsStudentModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveStudentAdmin}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter student's name"
                    value={studName}
                    onChange={(e) => setStudName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Student Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="student@college.edu"
                    value={studEmail}
                    onChange={(e) => setStudEmail(e.target.value)}
                    required
                    disabled={!!editingStudent}
                  />
                </div>
                
                {!editingStudent && (
                  <div className="form-group">
                    <label className="form-label">Initial Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={studPassword}
                      onChange={(e) => setStudPassword(e.target.value)}
                      required={!editingStudent}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Department Mapping</label>
                    <select
                      className="form-input form-select"
                      value={studDept}
                      onChange={(e) => {
                        setStudDept(e.target.value);
                        if (e.target.value !== 'other') {
                          setCustomStudDept('');
                        }
                      }}
                      required
                    >
                      {data.departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                      <option value="other">Other (Add Custom)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester Mapping</label>
                    <select
                      className="form-input form-select"
                      value={studSem}
                      onChange={(e) => setStudSem(e.target.value)}
                      required
                    >
                      {[1,2,3,4,5,6,7,8].map((s) => (
                        <option key={s} value={`Semester ${s}`}>{`Semester ${s}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {studDept === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Custom Department Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Civil Engineering"
                      value={customStudDept}
                      onChange={(e) => setCustomStudDept(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsStudentModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
