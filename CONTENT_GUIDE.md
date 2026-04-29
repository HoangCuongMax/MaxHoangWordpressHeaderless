# Website Content Guide

Use Notion as the main editing surface. After changing content, click **Push content** in the website sidebar to refresh the cached website data.

## Main Notion Databases

| Content | Database | What it controls |
| --- | --- | --- |
| Blog | MaxHoang Blog | Blog index, blog detail pages, latest footer posts |
| Projects | MaxHoang Projects | Project index, project detail pages, homepage project cards |
| Awards | MaxHoang Awards | Homepage awards carousel |
| Events | MaxHoang Events | Homepage event slider and latest footer events |
| Videos | MaxHoang Videos | Homepage About reels carousel |
| Photos | MaxHoang Photos | Hero slider images and site/sidebar logo |

## Publishing Rules

- Set `Published` to checked when content should appear.
- Avoid `Status` values like `Draft`, `Hidden`, `Private`, or `Unpublished` for live content.
- Use `Featured` for homepage priority.
- Use `Sort Order` when you want manual ordering.
- Use clear `Media Alt Text` for photos and covers.

## Photos

For the hero slider, add a row in **MaxHoang Photos**:

- `Name`: short label
- `Photo URL`: public ImageKit or image URL
- `Hero`: checked
- `Published`: checked
- `Sort Order`: display order

For the logo/sidebar image:

- Add or update one row
- Set `Logo` checked
- Set `Published` checked

## Videos

For the About reels slider, add a row in **MaxHoang Videos**:

- `Name`: short label
- `YouTube URL`: YouTube Shorts URL
- `About Reels`: checked
- `Published`: checked
- `Sort Order`: display order

## Events

For the homepage event slider, add a row in **MaxHoang Events**:

- `Name`: event title
- `Event Date`: start date
- `End Date`: optional
- `Location`: optional
- `Description`: optional
- `Cover Photo`: optional image URL used as card background
- `Event URL`: optional link
- `Published`: checked

Event cards are styled automatically:

- Current week: highlighted
- Upcoming: light upcoming style
- Passed: muted style

## Website Settings In Code

For labels, navigation links, and sidebar/footer text, edit:

`lib/site-config.ts`

For Notion database environment variable names, edit:

`lib/notion.ts`

For fallback content used when Notion is not configured, edit:

`lib/mock-data.ts`
