import { prisma } from '@/lib/prisma'

// Default values
const DEFAULT_SETTINGS = {
  sectionTitleSize: 22,
  categoryTitleSize: 16,
  itemNameSize: 14,
  itemDescriptionSize: 14,
  itemPriceSize: 16,
  headerLogoSize: 32,
  bottomNavSectionSize: 13,
  bottomNavCategorySize: 13,
}

export async function getUiSettings() {
  let uiSettings = DEFAULT_SETTINGS

  try {
    // Try to get from UiSettings first
    const settings = await prisma.uiSettings.findUnique({
      where: { id: 'ui-settings-1' },
    })

    if (settings) {
      uiSettings = {
        sectionTitleSize: settings.sectionTitleSize,
        categoryTitleSize: settings.categoryTitleSize,
        itemNameSize: settings.itemNameSize,
        itemDescriptionSize: settings.itemDescriptionSize,
        itemPriceSize: settings.itemPriceSize,
        headerLogoSize: settings.headerLogoSize,
        bottomNavSectionSize: (settings as any).bottomNavSectionSize ?? DEFAULT_SETTINGS.bottomNavSectionSize,
        bottomNavCategorySize: (settings as any).bottomNavCategorySize ?? DEFAULT_SETTINGS.bottomNavCategorySize,
      }
    } else {
      // Try FallbackSettings
      const fallbackSettings = await prisma.fallbackSettings.findUnique({
        where: { id: 'fallback-1' },
      })

      if (fallbackSettings) {
        uiSettings = {
          sectionTitleSize: fallbackSettings.sectionTitleSize ?? DEFAULT_SETTINGS.sectionTitleSize,
          categoryTitleSize: fallbackSettings.categoryTitleSize ?? DEFAULT_SETTINGS.categoryTitleSize,
          itemNameSize: fallbackSettings.itemNameSize ?? DEFAULT_SETTINGS.itemNameSize,
          itemDescriptionSize: fallbackSettings.itemDescriptionSize ?? DEFAULT_SETTINGS.itemDescriptionSize,
          itemPriceSize: fallbackSettings.itemPriceSize ?? DEFAULT_SETTINGS.itemPriceSize,
          headerLogoSize: fallbackSettings.headerLogoSize ?? DEFAULT_SETTINGS.headerLogoSize,
          bottomNavSectionSize: fallbackSettings.bottomNavSectionSize ?? DEFAULT_SETTINGS.bottomNavSectionSize,
          bottomNavCategorySize: fallbackSettings.bottomNavCategorySize ?? DEFAULT_SETTINGS.bottomNavCategorySize,
        }
      }
    }
  } catch (error) {
    console.warn('Could not load UI settings, using defaults:', error)
  }

  return uiSettings
}
