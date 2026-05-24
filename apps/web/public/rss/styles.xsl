<?xml version="1.0" encoding="UTF-8"?>
<!--
  XSL stylesheet for the BUBC RSS feed.
  Browsers that don't natively render RSS apply this stylesheet so a human
  visitor sees a readable page instead of raw XML. Feed readers ignore it.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" indent="yes" doctype-system="about:legacy-compat" />
  <xsl:template match="/">
    <html lang="en-GB">
      <head>
        <meta charset="UTF-8" />
        <title>BUBC News — RSS feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          :root { --ink:#0A1B2E; --navy:#0E2A47; --paper:#F5F1EA; --gold:#B8924A; --mute:#6B7280; --line:#D6CFC4; }
          * { box-sizing: border-box; }
          body { font-family: ui-sans-serif, system-ui, sans-serif; background: var(--paper); color: var(--ink); margin: 0; padding: 0; }
          .container { max-width: 720px; margin: 0 auto; padding: 4rem 1.25rem; }
          h1 { font-family: Georgia, serif; font-size: 2.5rem; letter-spacing: -0.02em; margin: 0 0 .5rem; }
          .lead { color: var(--mute); margin: 0 0 2rem; }
          .note { background: var(--paper); border: 1px solid var(--line); padding: 1rem 1.25rem; border-radius: 4px; font-size: .875rem; margin-bottom: 2.5rem; }
          .note strong { color: var(--navy); }
          .item { padding: 1.5rem 0; border-top: 1px solid var(--line); }
          .item h2 { font-family: Georgia, serif; font-size: 1.5rem; margin: 0 0 .25rem; }
          .item a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--gold); }
          .item a:hover { color: var(--navy); }
          .meta { color: var(--mute); font-size: .8125rem; }
          p.excerpt { margin: .75rem 0 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1><xsl:value-of select="/rss/channel/title" /></h1>
          <p class="lead"><xsl:value-of select="/rss/channel/description" /></p>
          <div class="note">
            <strong>This is an RSS feed.</strong> Add the URL of this page to a reader (Feedly, NetNewsWire, Reeder) and you'll get new BUBC posts the moment they go live.
          </div>
          <xsl:for-each select="/rss/channel/item">
            <article class="item">
              <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
              <p class="meta">
                <xsl:value-of select="pubDate" />
                <xsl:if test="category"> · <xsl:value-of select="category" /></xsl:if>
              </p>
              <p class="excerpt"><xsl:value-of select="description" /></p>
            </article>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
