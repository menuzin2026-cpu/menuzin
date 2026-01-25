import { AdminAuthWrapper } from './auth-wrapper'
import './admin-theme.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-root">
      <AdminAuthWrapper>{children}</AdminAuthWrapper>
    </div>
  )
}

