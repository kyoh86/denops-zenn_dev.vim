import { Denops } from "https://deno.land/x/denops_std@v6.4.0/mod.ts";
import {
  echoerrCommand,
} from "https://denopkg.com/kyoh86/denops-util@v0.0.7/command.ts";
import * as emoji from "https://deno.land/x/emoji@0.3.0/mod.ts";
import {
  type CommonArgs,
  getCommandOptions,
  getDenoExecutable,
  getZennArgs,
  isCommonArgs,
} from "./common.ts";
import { is } from "https://deno.land/x/unknownutil@v3.17.0/mod.ts";

export const isNewArticleArgs = is.IntersectionOf([
  isCommonArgs,
  is.ObjectOf({
    slug: is.OptionalOf(is.String), // 記事のスラッグ. `a-z0-9`とハイフン(`-`)とアンダースコア(`_`)の12〜50字の組み合わせ
    title: is.OptionalOf(is.String), // 記事のタイトル
    type: is.OptionalOf(is.String), // 記事のタイプ. tech (技術記事) / idea (アイデア記事) のどちらかから選択
    emoji: is.OptionalOf(is.String), // アイキャッチとして使われる絵文字（1文字だけ）
    published: is.OptionalOf(is.Boolean), // 公開設定. true か false を指定する. デフォルトで"false"
    publicationName: is.OptionalOf(is.String), // Publication名. Zenn Publication に紐付ける場合のみ指定
  }),
]);

export type newArticleArgs = CommonArgs & {
  slug?: string;
  title?: string;
  type?: string;
  emoji?: string;
  published?: boolean;
  publicationName?: string;
};

export async function newArticle(
  denops: Denops,
  options: newArticleArgs,
): Promise<string> {
  const args = [...getZennArgs(options), "new:article", "--machine-readable"];
  if (options.slug) {
    args.push("--slug", options.slug);
  }
  if (options.title) {
    args.push("--title", options.title);
  }
  if (options.type) {
    args.push("--type", options.type);
  }
  if (options.emoji) {
    switch (options.emoji.length) {
      case 0:
        break; // noop
      case 1:
        args.push("--emoji", options.emoji);
        break;
      default:
        args.push("--emoji", emoji.get(options.emoji));
        break;
    }
  }
  if (options.published) {
    args.push("--published");
  }
  if (options.publicationName) {
    args.push("--publication-name", options.publicationName);
  }
  const { pipeOut, finalize, wait } = echoerrCommand(
    denops,
    getDenoExecutable(options),
    getCommandOptions(options, { args }),
  );
  const files: string[] = [];
  await wait;
  await Promise.all([
    pipeOut.pipeTo(
      new WritableStream({
        write: (chunk) => {
          files.push(chunk.trimEnd());
        },
      }),
    ),
    wait,
  ]).finally(finalize);
  if (files.length === 1) {
    return files[0];
  }
  return "";
}