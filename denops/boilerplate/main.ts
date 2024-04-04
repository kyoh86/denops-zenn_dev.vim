import { Denops } from "https://deno.land/x/denops_std@v6.4.0/mod.ts";
import {} from "https://deno.land/x/denops_std@v6.4.0/helper/mod.ts";
import xdg from "https://deno.land/x/xdg@v10.6.0/src/mod.deno.ts";
import { join } from "https://deno.land/std@0.221.0/path/mod.ts";
import { ensureFile } from "https://deno.land/std@0.221.0/fs/mod.ts";
import { ensure, is } from "https://deno.land/x/unknownutil@v3.17.0/mod.ts";
import {
  ConsoleHandler,
  getLogger,
  RotatingFileHandler,
  setup,
} from "https://deno.land/std@0.221.0/log/mod.ts";

export async function main(denops: Denops) {
  const cacheFile = join(xdg.cache(), "denops-boilerplate-vim", "log.txt");
  await ensureFile(cacheFile);

  setup({
    handlers: {
      console: new ConsoleHandler("DEBUG"),
      cache: new RotatingFileHandler("DEBUG", {
        filename: cacheFile,
        maxBytes: 1024 * 1024,
        maxBackupCount: 1,
      }),
    },
    loggers: {
      "denops-boilerplate": {
        level: "INFO",
        handlers: ["console", "cache"],
      },
      "denops-boilerplate-verbose": {
        level: "DEBUG",
        handlers: ["cache"],
      },
    },
  });

  denops.dispatcher = {
    foo(uFoo: unknown, uBar: unknown, uBaz: unknown) {
      try {
        const foo = ensure(uFoo, is.String);
        const bar = ensure(uBar, is.Record);
        const baz = ensure(uBaz, is.OptionalOf(is.String));
        console.log(foo, bar, baz);
      } catch (err) {
        getLogger("denops-boilerplate").error(err);
      }
    },
  };
}
