import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Users, Edit, Ban, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getMembers, createMember, updateMember, deleteMember as dbDeleteMember } from '@/lib/firebase-db';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Secondary app to create users without logging out the current admin
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let secondaryAuth: any;
try {
  const secondaryApp = initializeApp(firebaseConfig, "Secondary");
  secondaryAuth = getAuth(secondaryApp);
} catch (e) {
  // Ignore already initialized errors in dev
}

export function AdminMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  const creationLock = useRef(false);

  const fetchMembers = async () => {
    setIsLoading(true);
    let data = await getMembers();
    
    // Auto-heal: If the current logged-in admin is not in the database, add them
    const currentUser = getAuth().currentUser;
    if (currentUser && currentUser.email && !creationLock.current) {
      const adminDocs = data.filter(m => m.email === currentUser.email);
      
      if (adminDocs.length === 0) {
        creationLock.current = true;
        await createMember({
          name: currentUser.displayName || 'Admin',
          email: currentUser.email,
          role: 'Admin',
          status: 'active',
          createdAt: new Date().toISOString()
        });
        data = await getMembers();
      } else if (adminDocs.length > 1) {
        // Cleanup duplicates caused by strict mode
        for (let i = 1; i < adminDocs.length; i++) {
          await dbDeleteMember(adminDocs[i].id);
        }
        data = await getMembers();
      }
    }
    
    setMembers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddDialog = () => {
    setEditingMember(null);
    setError('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: any) => {
    setEditingMember(member);
    setError('');
    setIsDialogOpen(true);
  };

  const checkLastAdmin = (targetEmail: string) => {
    const currentUser = getAuth().currentUser;
    if (currentUser?.email !== targetEmail) return true; // It's not themselves, proceed

    const activeAdmins = members.filter(m => m.role === 'Admin' && m.status !== 'suspended');
    if (activeAdmins.length <= 1) {
      alert("Action blocked: You are the only active Admin left. You cannot suspend or delete yourself.");
      return false;
    }
    return true;
  };

  const toggleSuspend = async (member: any) => {
    if (member.status !== 'suspended' && !checkLastAdmin(member.email)) return;
    
    const newStatus = member.status === 'suspended' ? 'active' : 'suspended';
    await updateMember(member.id, { status: newStatus });
    fetchMembers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    setError('');
    setIsCreating(true);

    const name = target.memberName.value;
    const role = target.memberRole.value;

    try {
      if (editingMember) {
        // Edit flow
        // Check if they are demoting themselves from Admin to Editor
        if (role !== 'Admin' && editingMember.role === 'Admin') {
          if (!checkLastAdmin(editingMember.email)) return;
        }
        await updateMember(editingMember.id, { name, role });
      } else {
        // Create flow
        const email = target.memberEmail.value;
        const password = target.memberPassword.value;
        
        if (secondaryAuth) {
          await createUserWithEmailAndPassword(secondaryAuth, email, password);
          await signOut(secondaryAuth);
        } else {
          throw new Error("Secondary auth not initialized");
        }

        await createMember({
          name,
          email,
          role,
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }

      setIsDialogOpen(false);
      fetchMembers();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process request. Email may already be in use.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (member: any) => {
    if (!checkLastAdmin(member.email)) return;

    if(confirm("Remove this member? Note: You must also delete their account manually in the Firebase Authentication console to fully revoke access.")) {
      await dbDeleteMember(member.id);
      fetchMembers();
    }
  };

  const activeAdminsCount = members.filter(m => m.role === 'Admin' && m.status !== 'suspended').length;
  const currentUserEmail = getAuth().currentUser?.email;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Manage Members</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Add dashboard access for your team.</p>
        </div>
        <Button className="shadow-sm w-full sm:w-auto" onClick={openAddDialog}>
          <Plus size={16} className="mr-2" /> Add Member
        </Button>
      </div>

      <div className="max-w-5xl mx-auto bg-background border border-border rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4 px-6 font-medium">Name</th>
                <th className="p-4 px-6 font-medium">Email</th>
                <th className="p-4 px-6 font-medium">Role</th>
                <th className="p-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">Loading members...</td></tr>
              ) : members.map(m => {
                const isSelf = m.email === currentUserEmail;
                const disableActions = isSelf && activeAdminsCount <= 1;

                return (
                  <tr key={m.id} className={`hover:bg-muted/30 transition-colors group ${m.status === 'suspended' ? 'opacity-50' : ''}`}>
                    <td className="p-4 px-6 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${m.status === 'suspended' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'} flex items-center justify-center font-bold shrink-0`}>
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">{m.name}</span>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-muted-foreground">{m.email}</td>
                    <td className="p-4 px-6 text-muted-foreground">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded whitespace-nowrap ${m.status === 'suspended' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary'}`}>
                        {m.status === 'suspended' ? 'Suspended' : (m.role || 'Admin')}
                      </span>
                    </td>
                    <td className="p-4 px-6 flex gap-2 justify-end">
                      <Button variant="outline" size="icon" disabled={disableActions} className={`h-8 w-8 shrink-0 ${m.status === 'suspended' ? 'text-primary hover:bg-primary/10' : 'text-amber-600 hover:bg-amber-600/10'}`} onClick={() => toggleSuspend(m)} title={disableActions ? "Cannot suspend the last admin" : (m.status === 'suspended' ? 'Unsuspend' : 'Suspend')}>
                        {m.status === 'suspended' ? <CheckCircle size={14} /> : <Ban size={14} />}
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => openEditDialog(m)}>
                        <Edit size={14} />
                      </Button>
                      <Button variant="outline" size="icon" disabled={disableActions} className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0" onClick={() => handleDelete(m)} title={disableActions ? "Cannot delete the last admin" : "Delete"}>
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && members.length === 0 && (
          <div className="p-12 text-center text-muted-foreground border-t border-border flex flex-col items-center">
            <Users size={32} className="mb-4 opacity-20" />
            <p>No members added to the directory yet.</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <input name="memberName" type="text" defaultValue={editingMember?.name} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required placeholder="John Doe" />
            </div>

            <div className="flex flex-col gap-2 opacity-50">
              <label className="text-sm font-medium">Email Address</label>
              <input name="memberEmail" type="email" defaultValue={editingMember?.email} disabled={!!editingMember} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none" required placeholder="john@ecovion.com" />
            </div>

            {!editingMember && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Temporary Password</label>
                <input name="memberPassword" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required minLength={6} placeholder="At least 6 characters" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Role</label>
              <select name="memberRole" defaultValue={editingMember?.role || 'Admin'} disabled={editingMember && editingMember.email === currentUserEmail && activeAdminsCount <= 1} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
              </select>
              {editingMember && editingMember.email === currentUserEmail && activeAdminsCount <= 1 && (
                <span className="text-xs text-muted-foreground mt-1">You cannot change your role because you are the only Admin left.</span>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>Cancel</Button>
              <Button type="submit" disabled={isCreating}>{isCreating ? 'Saving...' : (editingMember ? 'Save Changes' : 'Add Member')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
