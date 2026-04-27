import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang mỗi khi pathname thay đổi
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Sử dụng 'instant' thay vì 'smooth' để cuộn ngay lập tức
    });
  }, [pathname]);

  return null; // Component này không render gì cả
}
