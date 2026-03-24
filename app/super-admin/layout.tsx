import { SuperAdminAuthWrapper } from './auth-wrapper'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SuperAdminAuthWrapper>{children}</SuperAdminAuthWrapper>
}


