import type {StructureResolver} from 'sanity/structure'

/**
 * Custom Studio left-nav structure.
 *
 * - Singletons (settings, homePage) appear as single editable items at the top.
 * - Content is grouped semantically rather than alphabetically.
 * - Within People / Boats / Results etc., editors get the default document lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('BUBC content')
    .items([
      // Singletons --------------------------------------------------------------
      S.listItem()
        .title('Home page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Site settings')
        .id('settings')
        .child(S.document().schemaType('settings').documentId('settings')),

      S.divider(),

      // News & events -----------------------------------------------------------
      S.listItem()
        .title('News posts')
        .schemaType('newsPost')
        .child(S.documentTypeList('newsPost').title('News posts')),
      S.listItem()
        .title('News categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('News categories')),
      S.listItem()
        .title('Events')
        .schemaType('event')
        .child(S.documentTypeList('event').title('Events')),

      S.divider(),

      // Squads & people ---------------------------------------------------------
      S.listItem()
        .title('Squads')
        .schemaType('squad')
        .child(S.documentTypeList('squad').title('Squads')),
      S.listItem()
        .title('Athletes')
        .schemaType('athlete')
        .child(S.documentTypeList('athlete').title('Athletes')),
      S.listItem()
        .title('Coaches')
        .schemaType('coach')
        .child(S.documentTypeList('coach').title('Coaches')),
      S.listItem()
        .title('Committee members')
        .schemaType('committeeMember')
        .child(S.documentTypeList('committeeMember').title('Committee members')),

      S.divider(),

      // Heritage ----------------------------------------------------------------
      S.listItem()
        .title('Olympians')
        .schemaType('olympian')
        .child(S.documentTypeList('olympian').title('Olympians')),
      S.listItem()
        .title('Past chairs')
        .schemaType('chair')
        .child(S.documentTypeList('chair').title('Past chairs')),
      S.listItem()
        .title('Henley honours')
        .schemaType('henleyHonour')
        .child(S.documentTypeList('henleyHonour').title('Henley honours')),
      S.listItem()
        .title('Regatta results')
        .schemaType('regattaResult')
        .child(S.documentTypeList('regattaResult').title('Regatta results')),

      S.divider(),

      // Boats -------------------------------------------------------------------
      S.listItem()
        .title('Fleet (boats)')
        .schemaType('boat')
        .child(S.documentTypeList('boat').title('Fleet')),
      S.listItem()
        .title('Buy-a-Boat targets')
        .schemaType('boatForSale')
        .child(S.documentTypeList('boatForSale').title('Buy-a-Boat targets')),

      S.divider(),

      // Fundraising -------------------------------------------------------------
      S.listItem()
        .title('Sponsors')
        .schemaType('sponsor')
        .child(S.documentTypeList('sponsor').title('Sponsors')),
      S.listItem()
        .title('Campaigns')
        .schemaType('campaign')
        .child(S.documentTypeList('campaign').title('Campaigns')),

      S.divider(),

      // Generic pages -----------------------------------------------------------
      S.listItem()
        .title('Pages')
        .schemaType('page')
        .child(S.documentTypeList('page').title('Pages')),

      S.divider(),

      // Media library -----------------------------------------------------------
      S.listItem()
        .title('Image library')
        .schemaType('imageLibrary')
        .child(
          S.documentTypeList('imageLibrary')
            .title('Image library')
            .defaultOrdering([
              {field: 'category', direction: 'asc'},
              {field: 'title', direction: 'asc'},
            ]),
        ),
    ])
