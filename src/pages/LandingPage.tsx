import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard after 1 second
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
    
    // Cleanup timeout on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Reduced-size cover photo
  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center">
      <div className="w-1/2 h-1/2 relative">
        <img 
          src="/cover-photo.jpg" 
          alt="Contract Compass Cover" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}