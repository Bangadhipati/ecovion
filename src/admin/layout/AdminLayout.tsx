import { useState } from 'react';
import { LayoutDashboard, FileText, LogOut, MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function AdminLayout({ children, activeTab, setActiveTab, userRole }: { children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void, userRole?: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Failed to log out");
    }
  };

  const navTo = (tab: string) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-muted/30 font-sans text-foreground">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border z-40">
        <div className="font-bold text-lg flex items-center gap-2 text-primary">
          <LayoutDashboard size={20} /> Ecovion Admin
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
          <MoreVertical size={20} />
        </Button>
      </header>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border p-6 flex flex-col gap-2 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="font-bold text-xl flex items-center gap-2 text-primary">
            <LayoutDashboard /> Ecovion Admin
          </div>
        </div>
        
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-4 px-2">Content</span>
        <Button variant={activeTab === 'blogs' ? 'secondary' : 'ghost'} className={`justify-start gap-3 w-full ${activeTab === 'blogs' ? 'shadow-sm' : 'text-muted-foreground'}`} onClick={() => navTo('blogs')}>
          <FileText size={16} /> Blogs
        </Button>

        {userRole === 'Super Admin' && (
          <>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-4 px-2">Access</span>
            <Button variant={activeTab === 'members' ? 'secondary' : 'ghost'} className={`justify-start gap-3 w-full ${activeTab === 'members' ? 'shadow-sm' : 'text-muted-foreground'}`} onClick={() => navTo('members')}>
              <Users size={16} /> Members
            </Button>
          </>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">System</span>
          <Button variant="ghost" onClick={handleLogout} className="justify-start gap-3 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
