import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AdminLayout } from '@/admin/layout/AdminLayout';
import { AdminBlogs } from '@/admin/blogs/AdminBlogs';
import { AdminMembers } from '@/admin/members/AdminMembers';
import { AdminLogin } from '@/admin/auth/AdminLogin';
import { SystemMaintenance } from '@/admin/auth/SystemMaintenance';

export const Route = createFileRoute('/admincontrol108')({
  component: AdminDashboard
});

function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs');
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Enforce suspension and deletion checks
        const { getMembers } = await import('@/lib/firebase-db');
        const membersList = await getMembers();
        const profile = membersList.find(m => m.email === currentUser.email);
        
        const isFirstRun = membersList.length === 0;
        const isDeleted = !profile && !isFirstRun;
        const isSuspended = profile?.status === 'suspended';

        if (isDeleted || isSuspended) {
          await signOut(auth);
          setIsBlocked(true);
          setUser(null);
          setUserProfile(null);
        } else {
          setUser(currentUser);
          setUserProfile(profile || { role: 'Admin' }); 
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

  if (isBlocked) {
    return <SystemMaintenance />;
  }

  if (!user) {
    return <AdminLogin />;
  }

  // Enforce access control if a non-admin tries to bypass to members tab
  if (activeTab === 'members' && userProfile?.role !== 'Admin') {
    setActiveTab('blogs');
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userProfile?.role}>
      {activeTab === 'blogs' && <AdminBlogs />}
      {activeTab === 'members' && userProfile?.role === 'Admin' && <AdminMembers />}
    </AdminLayout>
  );
}
