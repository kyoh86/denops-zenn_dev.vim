import { test } from "https://deno.land/x/denops_test@v1.8.0/mod.ts";
import { assert, assertEquals } from "jsr:@std/assert@0.225.3";
import { newArticle } from "./new_article.ts";
import { join } from "jsr:@std/path@0.225.1";

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
