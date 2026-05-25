// Objects (reusable inline types)
import {imageBlock} from './objects/imageBlock'
import {seo} from './objects/seo'
import {linkBlock} from './objects/linkBlock'
import {ctaBlock} from './objects/ctaBlock'
import {statBlock} from './objects/statBlock'
import {portableText} from './objects/portableText'

// Singletons
import {settings} from './singletons/settings'
import {homePage} from './singletons/homePage'

// Documents
import {page} from './documents/page'
import {squad} from './documents/squad'
import {coach} from './documents/coach'
import {committeeMember} from './documents/committeeMember'
import {athlete} from './documents/athlete'
import {chair} from './documents/chair'
import {olympian} from './documents/olympian'
import {boat} from './documents/boat'
import {boatForSale} from './documents/boatForSale'
import {sponsor} from './documents/sponsor'
import {campaign} from './documents/campaign'
import {newsPost} from './documents/newsPost'
import {category} from './documents/category'
import {event} from './documents/event'
import {regattaResult} from './documents/regattaResult'
import {henleyHonour} from './documents/henleyHonour'
import {imageLibrary} from './documents/imageLibrary'

export const SINGLETON_TYPES = new Set(['settings', 'homePage'])

export const schemaTypes = [
  // Objects
  imageBlock,
  seo,
  linkBlock,
  ctaBlock,
  statBlock,
  portableText,

  // Singletons
  settings,
  homePage,

  // Documents
  page,
  squad,
  coach,
  committeeMember,
  athlete,
  chair,
  olympian,
  boat,
  boatForSale,
  sponsor,
  campaign,
  newsPost,
  category,
  event,
  regattaResult,
  henleyHonour,
  imageLibrary,
]
