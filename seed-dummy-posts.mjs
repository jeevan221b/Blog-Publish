/**
 * Seeds the local blog database with a handful of dummy posts for testing
 * the frontend (blog grid, category filter, article rendering, reveal /
 * transition animations) without needing real content.
 *
 *   node seed-dummy-posts.mjs            # insert into the default DB
 *   node seed-dummy-posts.mjs --remove   # delete the dummy posts again
 *   DB_PATH=/some/other/blog.db node seed-dummy-posts.mjs
 *
 * Every dummy post uses a "dummy-" slug prefix so it is trivial to find and
 * remove. Re-running the insert is idempotent (existing slugs are skipped).
 */
import { DatabaseSync } from "node:sqlite";

const DB_PATH =
  process.env.DB_PATH || "/home/manu/Projects/blog-data/blog.db";

const SLUG_PREFIX = "dummy-";
const remove = process.argv.includes("--remove");

const db = new DatabaseSync(DB_PATH);

/** @type {{slug:string,title:string,description:string,category:string,published_at:string,content:string}[]} */
const posts = [
  {
    slug: `${SLUG_PREFIX}first-light`,
    title: "First Light: Wiring Up the Test Bench",
    description:
      "A throwaway post used to check that the blog list, cards, and reveal animations behave with real-ish content.",
    category: "Hardware",
    published_at: "2026-08-18 09:30:00",
    content: `Every workshop needs a bench that is allowed to catch fire. This one is
mine, and this post is the smoke test for it.

## Why a dedicated bench

Iterating on the [blog](/blog) is a lot easier when there are actually
posts to look at. So here we are.

- A featured post at the top
- A grid of cards underneath
- Enough categories to make the filter do something

### A snippet, for the code block styling

\`\`\`ts
function ping(host: string): Promise<boolean> {
  return fetch(\`https://\${host}/health\`)
    .then((r) => r.ok)
    .catch(() => false);
}
\`\`\`

> If it renders here, it renders everywhere. Probably.

That is the whole point of \`dummy-first-light\`: something to look at.

## Next steps

Nothing. This post exists to be scrolled past.`,
  },
  {
    slug: `${SLUG_PREFIX}the-long-scroll`,
    title: "The Long Scroll: Testing Reveal Timing",
    description:
      "A longer body so the scroll-reveal, reading progress bar, and table of contents have something to work against.",
    category: "Notes",
    published_at: "2026-08-20 14:05:00",
    content: `This post is deliberately wordy. The goal is to have enough vertical
distance that the reading-progress bar moves, the table of contents has
several entries, and the reveal animations fire as sections scroll into
view.

## Section one

Lorem-adjacent filler that is at least written by a person. The quick
brown fox has retired and now maintains a small Postgres cluster in a
cupboard. It is happier this way.

### A sub-point

Sub-headings give the table of contents a second level to render.

- one
- two
- three, with a bit more text so the line wraps on narrower screens and
  we can see how list items breathe

## Section two

More text. \`inline code\` sits in here somewhere, and a [link back
home](/) for good measure.

\`\`\`bash
# nothing destructive, just noise
for i in 1 2 3; do echo "tick $i"; sleep 1; done
\`\`\`

## Section three

By now the progress bar should be most of the way across. If the reveal
animation for this heading looked janky, that is worth writing down.

> Testing is just vibes with a checklist.

## Section four

The end. If you read this far, the dummy content is doing more than its
job.`,
  },
  {
    slug: `${SLUG_PREFIX}category-filler`,
    title: "Category Filler: Making the Filter Earn Its Keep",
    description:
      "Exists mostly to add a third category so the blog's category filter has more than two chips to show.",
    category: "Meta",
    published_at: "2026-08-23 18:40:00",
    content: `A blog with one category is a list. This post adds another so the
filter component has to actually filter.

## What it checks

1. The chip renders
2. Clicking it narrows the grid
3. The active chip is visually distinct

### Nothing else

There is no section three. Enjoy the whitespace.`,
  },
  {
    slug: `${SLUG_PREFIX}related-posts-bait`,
    title: "Related Posts Bait",
    description:
      "Shares a category with another dummy post so the 'related articles' section on the article page has something to surface.",
    category: "Notes",
    published_at: "2026-08-25 11:15:00",
    content: `Tagged **Notes** on purpose, so it collides with *The Long Scroll* and
gives the related-posts logic a real pair to work with.

## The check

Open any \`Notes\` post and confirm this one shows up in the related
list at the bottom. If the backfill logic kicks in, the other dummy
posts should fill the remaining slots.

\`\`\`json
{
  "slug": "dummy-related-posts-bait",
  "category": "Notes",
  "purpose": "be related to something"
}
\`\`\`

That is all.`,
  },
];

if (remove) {
  const del = db.prepare("DELETE FROM posts WHERE slug LIKE ?");
  const info = del.run(`${SLUG_PREFIX}%`);
  console.log(`Removed ${info.changes} dummy post(s).`);
} else {
  const exists = db.prepare("SELECT 1 FROM posts WHERE slug = ?");
  const insert = db.prepare(`
    INSERT INTO posts (
      slug, title, description, content, cover_image, category, published, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const post of posts) {
    if (exists.get(post.slug)) {
      console.log(`Skipping ${post.slug}: already exists`);
      continue;
    }
    insert.run(
      post.slug,
      post.title,
      post.description,
      post.content,
      null,
      post.category,
      1,
      post.published_at
    );
    console.log(`Inserted: ${post.slug}`);
  }
}

console.log("\nCurrent posts:");
console.table(
  db
    .prepare(
      "SELECT id, slug, category, published, published_at FROM posts ORDER BY published_at DESC"
    )
    .all()
);
