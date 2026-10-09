import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'blogs' && <AdminBlogs />}
      {activeTab === 'members' && <AdminMembers />}
    </AdminLayout>
  );
}
