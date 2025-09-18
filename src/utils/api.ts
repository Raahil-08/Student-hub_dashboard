// Mock API functions with dummy data
export interface Achievement {
  id: string;
  title: string;
  category: 'Academic' | 'Technical' | 'Sports' | 'Arts' | 'Community Service' | 'Leadership' | 'Internship';
  badge: 'diamond-international' | 'platinum-national' | 'gold-state' | 'silver-district' | 'bronze-intra-college';
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  approvedDate?: string;
  studentName: string;
  studentId: string;
  fileUrl?: string;
}

// Dummy data
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: "Dean's List Recognition",
    category: 'Academic',
    badge: 'gold-state',
    description: 'Achieved Dean\'s List for Fall 2024 semester with GPA 3.9',
    status: 'Approved',
    submittedDate: '2024-09-10',
    approvedDate: '2024-09-12',
    studentName: 'Sarah Johnson',
    studentId: 'S001',
    fileUrl: '/dummy-file.pdf'
  },
  {
    id: '2',
    title: 'Hackathon Winner - TechFest 2024',
    category: 'Technical',
    badge: 'platinum-national',
    description: 'First place in university hackathon for AI-powered solution',
    status: 'Pending',
    submittedDate: '2024-09-08',
    studentName: 'Sarah Johnson',
    studentId: 'S001',
    fileUrl: '/dummy-file.pdf'
  },
  {
    id: '3',
    title: 'Volunteer Coordinator - Food Drive',
    category: 'Community Service',
    badge: 'silver-district',
    description: 'Led community food drive initiative, coordinated 50+ volunteers',
    status: 'Approved',
    submittedDate: '2024-09-05',
    approvedDate: '2024-09-06',
    studentName: 'Sarah Johnson',
    studentId: 'S001',
    fileUrl: '/dummy-file.pdf'
  },
  {
    id: '4',
    title: 'Research Publication',
    category: 'Academic',
    badge: 'diamond-international',
    description: 'Co-authored research paper in IEEE conference',
    status: 'Rejected',
    submittedDate: '2024-08-28',
    studentName: 'John Doe',
    studentId: 'S002',
    fileUrl: '/dummy-file.pdf'
  },
  {
    id: '5',
    title: 'Software Development Internship',
    category: 'Internship',
    badge: 'gold-state',
    description: 'Summer internship at TechCorp as Frontend Developer',
    status: 'Approved',
    submittedDate: '2024-08-15',
    approvedDate: '2024-08-16',
    studentName: 'Sarah Johnson',
    studentId: 'S001',
    fileUrl: '/dummy-file.pdf'
  },
  {
    id: '6',
    title: 'Data Science Internship',
    category: 'Internship',
    badge: 'silver-district',
    description: 'Research internship at AI Lab focusing on machine learning',
    status: 'Approved',
    submittedDate: '2024-07-20',
    approvedDate: '2024-07-22',
    studentName: 'Sarah Johnson',
    studentId: 'S001',
    fileUrl: '/dummy-file.pdf'
  }
];

// Mock API calls returning promises with fake data
export const api = {
  // Get all achievements for current user
  getMyAchievements: async (): Promise<Achievement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAchievements.filter(a => a.studentName === 'Sarah Johnson'));
      }, 500);
    });
  },

  // Get all submissions (for faculty)
  getAllSubmissions: async (): Promise<Achievement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAchievements);
      }, 500);
    });
  },

  // Submit new achievement
  submitAchievement: async (achievement: Omit<Achievement, 'id' | 'status' | 'submittedDate'>): Promise<Achievement> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAchievement: Achievement = {
          ...achievement,
          id: Math.random().toString(36).substr(2, 9),
          status: 'Pending',
          submittedDate: new Date().toISOString().split('T')[0]
        };
        resolve(newAchievement);
      }, 500);
    });
  },

  // Approve/Reject achievement (faculty)
  updateAchievementStatus: async (id: string, status: 'Approved' | 'Rejected'): Promise<Achievement> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const achievement = mockAchievements.find(a => a.id === id);
        if (achievement) {
          achievement.status = status;
          if (status === 'Approved') {
            achievement.approvedDate = new Date().toISOString().split('T')[0];
          }
          resolve(achievement);
        }
      }, 500);
    });
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userAchievements = mockAchievements.filter(a => a.studentName === 'Sarah Johnson');
        resolve({
          total: userAchievements.length,
          pending: userAchievements.filter(a => a.status === 'Pending').length,
          approved: userAchievements.filter(a => a.status === 'Approved').length,
          rejected: userAchievements.filter(a => a.status === 'Rejected').length,
          portfolioProgress: 75
        });
      }, 300);
    });
  }
};