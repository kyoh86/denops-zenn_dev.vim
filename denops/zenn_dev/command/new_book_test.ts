import { test } from "jsr:@denops/test@~3.0.1";
import { assert, assertEquals } from "jsr:@std/assert@~1.0.0";
import { newBook } from "./new_book.ts";
import { join } from "jsr:@std/path@~1.1.0";

test({
  mode: "all",
  name: "newBook() should create a new book file",
  fn: async (denops) => {
    const tempDirPath = await Deno.makeTempDir();
    const expectFileName = "books/slug-example";
    try {
      const name = await newBook(denops, {
        slug: "slug-example",
        title: "",
        summary: "",
        published: false,
        cwd: tempDirPath,
      });
      assertEquals(name, expectFileName);
      const stat = await Deno.stat(join(tempDirPath, expectFileName));
      assert(stat.isDirectory);
    } finally {
      Deno.removeSync(tempDirPath, { recursive: true });
    }
  },
});
