import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.join(process.env.HOME, "blog-data", "blog.db");
const postsDirectory = path.join(process.env.HOME, "Blog-Publish");

const db = new DatabaseSync(dbPath);

const files = [
  "esp32-experiments.md",
  "js-to-typescript.md",
  "nexus-server.md",
  "skywatcher.md",
];

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) {
    throw new Error("Missing frontmatter");
  }

  const end = raw.indexOf("\n---", 3);

  if (end === -1) {
    throw new Error("Frontmatter closing marker not found");
  }

  const frontmatter = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).trim();

  const getValue = (key) => {
    const regex = new RegExp(`^${key}:\\s*(.*)$`, "m");
    const match = frontmatter.match(regex);

    if (!match) return null;

    return match[1].trim().replace(/^["']|["']$/g, "");
  };

  return {
    title: getValue("title"),
    description: getValue("description"),
    date: getValue("date"),
    category: getValue("category"),
    content,
  };
}

const insert = db.prepare(`
  INSERT INTO posts (
    slug,
    title,
    description,
    content,
    cover_image,
    category,
    published,
    published_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const filename of files) {
  const filePath = path.join(postsDirectory, filename);
  const raw = fs.readFileSync(filePath, "utf8");

  const post = parseFrontmatter(raw);
  const slug = filename.replace(/\.md$/, "");

  if (!post.title || !post.date || !post.category) {
    console.error(`Skipping ${filename}: missing required frontmatter`);
    continue;
  }

  const existing = db
    .prepare("SELECT id FROM posts WHERE slug = ?")
    .get(slug);

  if (existing) {
    console.log(`Skipping ${slug}: already exists`);
    continue;
  }

  const publishedAt = `${post.date} 00:00:00`;

  insert.run(
    slug,
    post.title,
    post.description ?? "",
    post.content,
    null,
    post.category,
    1,
    publishedAt
  );

  console.log(`Imported: ${slug}`);
}

console.log("\nMigration complete.");

const rows = db
  .prepare(`
    SELECT id, slug, title, category, published
    FROM posts
    ORDER BY id
  `)
  .all();

console.table(rows);
