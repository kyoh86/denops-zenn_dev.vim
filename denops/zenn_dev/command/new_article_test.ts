import { test } from "@denops/test";
import { assert, assertEquals } from "@std/assert";
import { newArticle } from "./new_article.ts";
import { join } from "@std/path";

test({
  mode: "all",
  name: "newArticle() should create a new article file",
  fn: async (denops) => {
    const tempDirPath = await Deno.makeTempDir();
    const expectFileName = "articles/slug-example.md";
    try {
      const name = await newArticle(denops, {
        slug: "slug-example",
        title: "",
        type: "",
        emoji: "",
        published: false,
        cwd: tempDirPath,
      });
      assertEquals(name, expectFileName);
      const stat = await Deno.stat(join(tempDirPath, expectFileName));
      assert(stat.isFile);
    } finally {
      Deno.removeSync(tempDirPath, { recursive: true });
    }
  },
});
