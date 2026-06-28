import axios from 'axios';

const axiosClient = axios.create({
  // Thay đổi port nếu Backend NestJS của bạn chạy ở port khác
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Chạy TRƯỚC KHI request được gửi lên server
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc Zustand)
    const token = localStorage.getItem('token'); 
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Chạy SAU KHI nhận response từ server
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Chỉ lấy phần data, bỏ qua các thông tin config thừa của axios
  },
  (error) => {
    // Xử lý lỗi toàn cục (Ví dụ: token hết hạn -> văng ra trang login)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;