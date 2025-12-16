import { as, ensure, is } from "@core/unknownutil";
import type { Denops } from "@denops/core";
import { TextLineStream } from "@std/streams";
import { echoerrCommand } from "@kyoh86/denops-util/command";
import {
  type CommonParams,
  getCommandOptions,
  getDenoExecutable,
  getZennArgs,
} from "./common.ts";

export const isNewBookParams = is.ObjectOf({
  slug: as.Optional(is.String), // 記事のスラッグ. `a-z0-9`とハイフン(`-`)とアンダースコア(`_`)の12〜50字の組み合わせ
  title: as.Optional(is.String), // 記事のタイトル
  published: as.Optional(is.Boolean), // 公開設定. true か false を指定する. デフォルトで"false"
  summary: as.Optional(is.String), // 本の紹介文. 有料の本であっても公開される
  price: as.Optional(is.String), // 本の価格.有料の場合200〜5000. デフォルトは0
});

export type newBookParams = {
  slug?: string;
  title?: string;
  published?: boolean;
  summary?: string;
  price?: string;
};

export async function newBook(
  denops: Denops,
  options: CommonParams & newBookParams,
): Promise<string> {
  const args = [...getZennArgs(options), "new:book"];
  if (options.slug) {
    args.push("--slug", options.slug);
  }
  if (options.title) {
    args.push("--title", options.title);
  }
  if (options.summary) {
    args.push("--summary", options.summary);
  }
  if (options.price) {
    args.push("--price", options.price);
  }
  if (!options.cwd) {
    options.cwd = ensure(await denops.call("getcwd"), is.String);
  }
  const { pipeOut, finalize, wait } = echoerrCommand(
    denops,
    getDenoExecutable(options),
    getCommandOptions(options, { args, cwd: options.cwd }),
  );
  let dir: string = "";
  await Promise.all([
    pipeOut.pipeThrough(
      new TextLineStream(),
    ).pipeTo(
      new WritableStream({
        write: (line) => {
          // deno-lint-ignore no-control-regex
          const match = new RegExp(
            "^created: (?:\\x1B\\x5B32m)?(books\/.+)\/config\.yaml(?:\\x1B\\x5B39m)?$",
          ).exec(line);
          if (match) {
            dir = match[1];
          }
        },
      }),
    ),
    wait,
  ]).finally(finalize);
  return dir;
}
