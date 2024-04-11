import { test } from "https://deno.land/x/denops_test@v1.6.2/mod.ts";
import { assert } from "https://deno.land/std@0.221.0/assert/mod.ts";
import { exec } from "./new_article.ts";

test({
  mode: "all",
  name: "dummy",
  fn: () => {
    exec({slug: "", title: "", type: "", emoji: "", published: ""});
    assert(true);
  },
});

