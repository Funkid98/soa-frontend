import axios from "axios";

// Auth service
export const authAPI = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to include token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      
      // Redirect to login
      window.location.href = "/login";
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

export const login = (data: any) => authAPI.post("/user/login", data);
export const register = (data: any) => authAPI.post("/user/register", data);

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
};

// ==================== PROFILE ENDPOINTS ====================

// Get current user profile (uses token from localStorage)
export const getUserProfile = () => authAPI.get("/user/profile");

// Update current user profile
export const updateUserProfile = (data: any) => authAPI.put("/user/profile", data);

// ==================== UTILITY FUNCTIONS ====================

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Get stored user ID
export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

// Save authentication data
export const saveAuthData = (token: string, userId: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

// ==================== SOAP COURSE SERVICE ====================

const SOAP_BASE_URL = 'http://localhost:8080/api/courses';

// TypeScript interface matching your Python Course model
export interface CourseData {
  _id?: string;
  titre: string;
  code: string;
  description: string;
  credits: number;
  enseignant_id: string;
  departement: string;
  semestre: string;
  date_creation?: string;
  date_modification?: string;
}

// Helper function to create SOAP request
const createSoapRequest = (method: string, params: Record<string, any>) => {
  const paramsXml = Object.entries(params)
    .map(([key, value]) => {
      if (value === null || value === undefined) return '';
      return `<${key}>${value}</${key}>`;
    })
    .filter(Boolean)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
               xmlns:tns="soa.course.service">
  <soap:Body>
    <tns:${method}>
      ${paramsXml}
    </tns:${method}>
  </soap:Body>
</soap:Envelope>`;
};

// Helper function to parse SOAP response
const parseSoapResponse = (xmlText: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  // Extract the result from SOAP response
  const result = xmlDoc.getElementsByTagName('return')[0];
  if (result) {
    return result.textContent;
  }
  return null;
};

// Get all courses
export const getCourses = async () => {
  try {
    const soapRequest = createSoapRequest('get_all_courses', {});
    
    const response = await axios.post(SOAP_BASE_URL, soapRequest, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'get_all_courses',
      },
    });

    const responseData = parseSoapResponse(response.data);
    return {
      success: true,
      data: responseData ? JSON.parse(responseData) : [],
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, error: 'Failed to fetch courses', data: [] };
  }
};

// Get course by ID
export const getCourseById = async (courseId: string) => {
  try {
    const soapRequest = createSoapRequest('get_course', { course_id: courseId });
    
    const response = await axios.post(SOAP_BASE_URL, soapRequest, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'get_course',
      },
    });

    const responseData = parseSoapResponse(response.data);
    return {
      success: true,
      data: responseData ? JSON.parse(responseData) : null,
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return { success: false, error: 'Failed to fetch course' };
  }
};

// Create a new course
export const createCourse = async (courseData: {
  titre: string;
  code: string;
  description: string;
  credits: number;
  enseignant_id: string;
  departement: string;
  semestre: string;
}) => {
  try {
    const soapRequest = createSoapRequest('create_course', courseData);
    
    const response = await axios.post(SOAP_BASE_URL, soapRequest, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'create_course',
      },
    });

    const responseData = parseSoapResponse(response.data);
    return {
      success: true,
      data: responseData ? JSON.parse(responseData) : null,
    };
  } catch (error) {
    console.error('Error creating course:', error);
    return { success: false, error: 'Failed to create course' };
  }
};

// Update course
export const updateCourse = async (
  courseId: string,
  courseData: Partial<{
    titre: string;
    code: string;
    description: string;
    credits: number;
    enseignant_id: string;
    departement: string;
    semestre: string;
  }>
) => {
  try {
    const soapRequest = createSoapRequest('update_course', {
      course_id: courseId,
      ...courseData,
    });
    
    const response = await axios.post(SOAP_BASE_URL, soapRequest, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'update_course',
      },
    });

    const responseData = parseSoapResponse(response.data);
    return {
      success: true,
      data: responseData ? JSON.parse(responseData) : null,
    };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error: 'Failed to update course' };
  }
};

// Delete course
export const deleteCourseApi = async (courseId: string) => {
  try {
    const soapRequest = createSoapRequest('delete_course', { course_id: courseId });
    
    const response = await axios.post(SOAP_BASE_URL, soapRequest, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'delete_course',
      },
    });

    const responseData = parseSoapResponse(response.data);
    return {
      success: true,
      message: responseData || 'Course deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: 'Failed to delete course' };
  }
};

// ==================== GRADES/NOTES ENDPOINTS (FastAPI) ====================

const GRADES_BASE_URL = 'http://localhost:8000'; // Adjust port if needed

// Get grades for a student
export const getStudentGrades = async (studentId: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${GRADES_BASE_URL}/grades/student/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching grades:', error);
    return { success: false, error: 'Failed to fetch grades', data: [] };
  }
};

// Get student average
export const getStudentAverage = async (studentId: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${GRADES_BASE_URL}/grades/student/${studentId}/average`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching average:', error);
    return { success: false, error: 'Failed to fetch average' };
  }
};

// Add a grade (for teachers)
export const addGrade = async (gradeData: {
  studentId: string;
  courseId: string;
  note: number;
  coefficient: number;
  type: string;
}) => {
  try {
    const token = getToken();
    const response = await axios.post(`${GRADES_BASE_URL}/grades`, gradeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding grade:', error);
    return { success: false, error: 'Failed to add grade' };
  }
};