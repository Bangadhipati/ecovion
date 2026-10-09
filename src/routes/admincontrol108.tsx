import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/admin/layout/AdminLayout'
import { AdminBlogs } from '@/admin/blogs/AdminBlogs'

export const Route = createFileRoute('/admincontrol108')({
  component: AdminDashboard
})

function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminBlogs />
    </AdminLayout>
  )
}
