import { useState } from 'react';
import { articles } from '@/lib/site-data';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function AdminBlogs() {
  const [blogs, setBlogs] = useState([...articles]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Manage Blogs</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Add, edit, or remove articles from the Ecovion Journal.</p>
        </div>
        <Button className="shadow-sm w-full sm:w-auto"><Plus size={16} className="mr-2" /> Create New Blog</Button>
      </div>

      <div className="max-w-5xl mx-auto bg-background border border-border rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4 px-6 font-medium">Title</th>
                <th className="p-4 px-6 font-medium">Category</th>
                <th className="p-4 px-6 font-medium">Author</th>
                <th className="p-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blogs.map(b => (
                <tr key={b.slug} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <img src={b.image} className="w-10 h-10 rounded object-cover border border-border shrink-0" />
                      <span className="max-w-[200px] md:max-w-[300px] truncate block">{b.title}</span>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-muted-foreground">
                    <span className="bg-secondary text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded whitespace-nowrap">
                      {b.category}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-muted-foreground whitespace-nowrap">{b.author}</td>
                  <td className="p-4 px-6 flex gap-2 justify-end">
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0"><Edit size={14} /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"><Trash2 size={14} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {blogs.length === 0 && (
          <div className="p-12 text-center text-muted-foreground border-t border-border">
            No blogs found. Create your first one!
          </div>
        )}
      </div>
    </>
  );
}
