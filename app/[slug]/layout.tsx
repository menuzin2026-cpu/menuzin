import { UiSettingsInjector } from './menu/ui-settings-injector'

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UiSettingsInjector />
      {children}
    </>
  )
}

