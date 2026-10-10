import { useState, useEffect } from 'react';
import { getEnquiries, deleteEnquiry } from '@/lib/firebase-db';
import { Search, Eye, Trash2, Mail, Building, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    const data = await getEnquiries();
    // Sort by newest first
    data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    setEnquiries(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      setIsDeleting(true);
      await deleteEnquiry(id);
      await fetchEnquiries();
      setIsDeleting(false);
      setSelectedEnquiry(null);
    }
  }

  const filteredEnquiries = enquiries.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) || 
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.interest?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Enquiries</h1>
            <p className="text-muted-foreground mt-1">Manage contact form submissions</p>
          </div>
        </div>

        <div className="bg-background rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center bg-muted/10 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, email, or interest..." 
                className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/30 uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Interest</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading enquiries...</td>
                  </tr>
                ) : filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No enquiries found</td>
                  </tr>
                ) : (
                  filteredEnquiries.map(enquiry => (
                    <tr key={enquiry.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-medium">{enquiry.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{enquiry.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {enquiry.interest}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedEnquiry(enquiry)}>
                          <Eye size={16} className="mr-2" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
        {selectedEnquiry && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading mb-4">Enquiry Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <h3 className="font-bold text-lg">{selectedEnquiry.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <Mail size={14} className="mr-2" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-primary transition-colors">{selectedEnquiry.email}</a>
                  </div>
                  {selectedEnquiry.organization && (
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                      <Building size={14} className="mr-2" />
                      {selectedEnquiry.organization}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center text-xs text-muted-foreground justify-end mb-2">
                    <Clock size={12} className="mr-1" />
                    {selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : 'N/A'}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {selectedEnquiry.interest}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Message</h4>
                <div className="bg-muted/30 p-4 rounded-md text-sm whitespace-pre-wrap leading-relaxed border border-border">
                  {selectedEnquiry.message}
                </div>
              </div>

            </div>
            <DialogFooter className="flex justify-between sm:justify-between border-t border-border pt-4 mt-2">
              <Button variant="destructive" onClick={() => handleDelete(selectedEnquiry.id)} disabled={isDeleting}>
                <Trash2 size={16} className="mr-2" /> {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedEnquiry(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
