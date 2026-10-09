import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getBlogs, createBlog, updateBlog, deleteBlog as dbDeleteBlog } from '@/lib/firebase-db';

export function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [authors, setAuthors] = useState<any[]>([{ name: '', role: '', bio: '', image: '' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadSuccessId, setUploadSuccessId] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const data = await getBlogs();
    setBlogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddDialog = () => {
    setEditingBlog(null);
    setAuthors([{ name: '', role: '', bio: '', image: '' }]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (blog: any) => {
    setEditingBlog(blog);
    setAuthors(blog.authors ? blog.authors : [{ name: blog.author || '', role: blog.authorRole || '', bio: blog.authorBio || '', image: blog.authorImage || '' }]);
    setIsDialogOpen(true);
  };

  const addAuthor = () => setAuthors([...authors, { name: '', role: '', bio: '', image: '' }]);
  const removeAuthor = (index: number) => setAuthors(authors.filter((_, i) => i !== index));
  const updateAuthor = (index: number, field: string, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index][field] = value;
    setAuthors(newAuthors);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    setUploadingId(id);
    setUploadSuccessId(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        // Automatically apply Cloudinary's smart compression without quality loss
        const urlParts = data.secure_url.split('/upload/');
        const compressedUrl = `${urlParts[0]}/upload/q_auto,f_auto/${urlParts[1]}`;
        setter(compressedUrl);
        setUploadSuccessId(id);
        setTimeout(() => setUploadSuccessId(null), 3000);
      } else {
        alert("Upload failed. Check Cloudinary settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    
    const title = target.blogTitle.value;
    const slug = editingBlog?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blogData = {
      title,
      slug: target.blogSlug.value || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: target.blogCategory.value,
      summary: target.blogSummary.value,
      image: editingBlog?.image || '', 
      paragraphs: target.blogContent.value.split('\n\n').filter((p: string) => p.trim() !== ''),
      authors: authors,
      isFeatured: target.isFeatured ? target.isFeatured.checked : false,
      createdAt: editingBlog?.createdAt || new Date().toISOString()
    };
    
    // We need to properly read the image input value
    const imageInput = document.getElementById('blog-image-input') as HTMLInputElement;
    if(imageInput) {
      blogData.image = imageInput.value;
    }

    if (blogData.isFeatured) {
      // Unfeature all other blogs
      for (const b of blogs) {
        if (b.isFeatured && b.id !== editingBlog?.id) {
          await updateBlog(b.id, { isFeatured: false });
        }
      }
    }

    if (editingBlog && editingBlog.id) {
      await updateBlog(editingBlog.id, blogData);
    } else {
      await createBlog(blogData);
    }
    
    setIsDialogOpen(false);
    fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this blog?")) {
      await dbDeleteBlog(id);
      fetchBlogs();
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Manage Blogs</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Add, edit, or remove articles from the Ecovion Journal.</p>
        </div>
        <Button className="shadow-sm w-full sm:w-auto" onClick={openAddDialog}><Plus size={16} className="mr-2" /> Create New Blog</Button>
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
              {isLoading ? (
                <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">Loading blogs from database...</td></tr>
              ) : blogs.map(b => (
                <tr key={b.id || b.slug} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <img src={b.image} className="w-10 h-10 rounded object-cover border border-border shrink-0" />
                      <div>
                        <span className="max-w-[200px] md:max-w-[300px] truncate block">{b.title}</span>
                        {b.isFeatured && <span className="text-[10px] text-primary font-bold uppercase tracking-wider">★ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-muted-foreground">
                    <span className="bg-secondary text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded whitespace-nowrap">
                      {b.category}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-muted-foreground whitespace-nowrap">{b.authors ? b.authors.map((a: any) => a.name).join(', ') : b.author}</td>
                  <td className="p-4 px-6 flex gap-2 justify-end">
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => openEditDialog(b)}><Edit size={14} /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0" onClick={() => handleDelete(b.id)}><Trash2 size={14} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && blogs.length === 0 && (
          <div className="p-12 text-center text-muted-foreground border-t border-border">
            No blogs found in the database. Create your first one!
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Title</label>
                <input name="blogTitle" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue={editingBlog?.title} onChange={(e) => {
                  const slugInput = document.getElementById('blog-slug-input') as HTMLInputElement;
                  // Only auto-update if we are creating a new blog or the user hasn't explicitly customized the slug
                  if (slugInput && !editingBlog) {
                    slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  }
                }} required placeholder="Article title" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <input name="blogCategory" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue={editingBlog?.category} required placeholder="e.g. Sustainable agriculture" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Custom Permalink (Slug)</label>
              <div className="flex items-center">
                <span className="bg-muted px-3 py-2 border border-r-0 border-input rounded-l-md text-sm text-muted-foreground shrink-0">ecovion.com/blog/</span>
                <input id="blog-slug-input" name="blogSlug" type="text" className="flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue={editingBlog?.slug} required placeholder="custom-article-slug" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Summary / Abstract</label>
              <textarea name="blogSummary" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue={editingBlog?.summary} required placeholder="A short, compelling summary of the article..." />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={editingBlog?.isFeatured} className="w-4 h-4 rounded border-input text-primary focus:ring-primary" />
              <label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mark as Featured Article
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Main Blog Image</label>
              <div className="flex gap-2 items-center">
                <input id="blog-image-input" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" defaultValue={editingBlog?.image} required placeholder="URL will appear here after upload..." />
                <div className="relative shrink-0">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                    const el = document.getElementById('blog-image-input') as HTMLInputElement;
                    if(el) el.value = url;
                  }, 'main-blog-image')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={uploadingId === 'main-blog-image'} />
                  <Button type="button" variant="secondary" className="h-10 pointer-events-none min-w-[120px]">
                    {uploadingId === 'main-blog-image' ? (
                      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> Uploading...</span>
                    ) : uploadSuccessId === 'main-blog-image' ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-500">✓ Uploaded</span>
                    ) : 'Upload Local'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Content (Supports markdown)</label>
              <div className="border border-input rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                <div className="flex items-center gap-1 p-2 border-b border-input bg-muted/30">
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 font-bold" onMouseDown={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('blog-content-input') as HTMLTextAreaElement;
                    if(el) {
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const sel = el.value.substring(start, end);
                      el.value = el.value.substring(0, start) + '## ' + (sel || 'Subheading') + el.value.substring(end);
                      el.focus({ preventScroll: true });
                    }
                  }}>H2</Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 font-bold" onMouseDown={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('blog-content-input') as HTMLTextAreaElement;
                    if(el) {
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const sel = el.value.substring(start, end);
                      el.value = el.value.substring(0, start) + '**' + (sel || 'bold text') + '**' + el.value.substring(end);
                      el.focus({ preventScroll: true });
                    }
                  }}>B</Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 font-bold italic" onMouseDown={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('blog-content-input') as HTMLTextAreaElement;
                    if(el) {
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const sel = el.value.substring(start, end);
                      el.value = el.value.substring(0, start) + '_' + (sel || 'italic text') + '_' + el.value.substring(end);
                      el.focus({ preventScroll: true });
                    }
                  }}>I</Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 font-bold" onMouseDown={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('blog-content-input') as HTMLTextAreaElement;
                    if(el) {
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const sel = el.value.substring(start, end);
                      el.value = el.value.substring(0, start) + '\n- ' + (sel || 'List item') + el.value.substring(end);
                      el.focus({ preventScroll: true });
                    }
                  }}>• List</Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 font-bold" onMouseDown={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('blog-content-input') as HTMLTextAreaElement;
                    if(el) {
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const sel = el.value.substring(start, end);
                      el.value = el.value.substring(0, start) + '\n> ' + (sel || 'Quotation') + el.value.substring(end);
                      el.focus({ preventScroll: true });
                    }
                  }}>” Quote</Button>
                </div>
                <textarea id="blog-content-input" name="blogContent" className="flex min-h-[250px] w-full resize-y bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" defaultValue={editingBlog?.paragraphs?.join('\n\n')} required placeholder="Write your content here. Select text and click the buttons above to format." />
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">Authors</h3>
                <Button type="button" variant="outline" size="sm" onClick={addAuthor}><Plus size={14} className="mr-2"/> Add Author</Button>
              </div>
              
              <div className="flex flex-col gap-6">
                {authors.map((author, index) => (
                  <div key={index} className="p-4 bg-muted/40 rounded-lg border border-border relative">
                    {authors.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => removeAuthor(index)}>
                        <Trash2 size={12} />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium">Author Name</label>
                        <input type="text" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={author.name} onChange={(e) => updateAuthor(index, 'name', e.target.value)} required placeholder="e.g. Dr. Jane Doe" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium">Role</label>
                        <input type="text" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={author.role} onChange={(e) => updateAuthor(index, 'role', e.target.value)} required placeholder="e.g. Lead Researcher" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                      <label className="text-xs font-medium">Author Image</label>
                      <div className="flex gap-2 items-center">
                        {author.image && <img src={author.image} alt="preview" className="w-9 h-9 rounded-full object-cover shrink-0 border border-border bg-background" />}
                        <div className="flex-1 flex gap-2">
                          <input type="text" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={author.image} onChange={(e) => updateAuthor(index, 'image', e.target.value)} required placeholder="URL will appear here after upload..." />
                          <div className="relative shrink-0">
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAuthor(index, 'image', url), `author-image-${index}`)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={uploadingId === `author-image-${index}`} />
                            <Button type="button" variant="secondary" size="sm" className="h-9 pointer-events-none min-w-[120px]">
                              {uploadingId === `author-image-${index}` ? (
                                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> Uploading...</span>
                              ) : uploadSuccessId === `author-image-${index}` ? (
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-500">✓ Uploaded</span>
                              ) : 'Upload Local'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium">About the Author</label>
                      <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={author.bio} onChange={(e) => updateAuthor(index, 'bio', e.target.value)} required placeholder="Brief biography..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button type="submit" className="w-full sm:w-auto">{editingBlog ? 'Save Changes' : 'Create Blog'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
