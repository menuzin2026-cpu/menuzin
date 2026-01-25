import { AdminAuthWrapper } from './auth-wrapper'
import { AdminProvider } from './admin-context'
import './admin-theme.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-root">
      <AdminProvider>
        <AdminAuthWrapper>{children}</AdminAuthWrapper>
      </AdminProvider>
    </div>
  )
}

