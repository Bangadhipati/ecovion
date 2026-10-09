import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AdminLayout } from '@/admin/layout/AdminLayout';
import { AdminBlogs } from '@/admin/blogs/AdminBlogs';
import { AdminMembers } from '@/admin/members/AdminMembers';
import { AdminLogin } from '@/admin/auth/AdminLogin';

export const Route = createFileRoute('/admincontrol108')({
  component: AdminDashboard
});

function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Enforce suspension check
        const { getMembers } = await import('@/lib/firebase-db');
        const membersList = await getMembers();
        const profile = membersList.find(m => m.email === currentUser.email);
        
        if (profile && profile.status === 'suspended') {
          await signOut(auth);
          alert("Your account has been suspended by the Super Admin.");
          setUser(null);
          setUserProfile(null);
        } else {
          setUser(currentUser);
          setUserProfile(profile || { role: 'Super Admin' }); // Fallback for the first auto-heal load
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <AdminLogin />;
  }

  // Enforce access control if a non-super-admin tries to bypass to members tab
  if (activeTab === 'members' && userProfile?.role !== 'Super Admin') {
    setActiveTab('blogs');
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userProfile?.role}>
      {activeTab === 'blogs' && <AdminBlogs />}
      {activeTab === 'members' && userProfile?.role === 'Super Admin' && <AdminMembers />}
    </AdminLayout>
  );
}
