import { basename, join } from "jsr:@std/path@0.225.1";
import { createExtractor, Parser } from "jsr:@std/front-matter@0.224.0";
import { parse as parseYAML } from "jsr:@std/yaml@0.224.0/parse";
import { parse as parseTOML } from "jsr:@std/toml@0.224.0/parse";
import { ensure, is } from "jsr:@core/unknownutil@^3.18.0";
import { Denops } from "jsr:@denops/core@6.1.0";

export type listArticlesParams = {
  cwd?: string;
};
export const isListArticlesParams = is.ObjectOf({
  cwd: is.OptionalOf(is.String),
});

export type Article = {
  path: string;
  slug: string;
  title: string;
  emoji: string;
  type: string;
  topics: string[];
  published: boolean;
  published_at?: string | undefined;
  publication_name?: string | undefined;
};

export async function listArticles(
  denops: Denops,
  params: listArticlesParams,
): Promise<Article[]> {
  const articles = [];
  const cwd = params.cwd ?? ensure(await denops.call("getcwd"), is.String);
  for await (const article of enumerateArticles(cwd)) {
    articles.push(article);
  }
  return articles;
}

async function* enumerateArticles(cwd?: string) {
  const path = cwd ? join(cwd, "articles") : "articles";
  const dirs = Deno.readDir(path);
  for await (const entry of dirs) {
    if (!/\.md$/.test(entry.name)) {
      continue;
    }
    const abspath = join(path, entry.name);
    const stat = await Deno.stat(abspath);

    if (stat === null || stat.isDirectory) {
      console.log(`cannot get file-stat ${entry.name}`);
      continue;
    }

    const attr = await readFrontMatter(abspath);
    if (!attr) {
      console.log(`cannot get front matter ${entry.name}`);
      continue;
    }

    yield {
      ...attr,
      path: abspath,
    };
  }
}

const extractFrontMatter = createExtractor({
  toml: parseTOML as Parser,
  yaml: parseYAML as Parser,
  json: JSON.parse as Parser,
});

async function readFrontMatter(path: string) {
  try {
    const text = await Deno.readTextFile(path);
    const slug = basename(path).replace(/\.md$/, "");
    return {
      ...extractFrontMatter<{
        title: string;
        emoji: string;
        type: string;
        topics: string[];
        published: boolean;
        published_at?: string;
        publication_name?: string;
      }>(text).attrs,
      slug,
    };
  } catch {
    return undefined;
  }
}
