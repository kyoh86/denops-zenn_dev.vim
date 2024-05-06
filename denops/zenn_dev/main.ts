import { Denops } from "jsr:@denops/core@6.0.6";
import { isNewArticleParams, newArticle } from "./command/new_article.ts";
import { bindDispatcher } from "jsr:@kyoh86/denops-bind-params@0.0.1-alpha.2";
import { ensure, is } from "jsr:@core/unknownutil@3.18.0";
import { parse } from "https://deno.land/x/denops_std@v6.4.0/argument/mod.ts";

export function main(denops: Denops) {
  denops.dispatcher = bindDispatcher({
    // TODO: init(uParams: unknown) {
    // TODO: preview(uParams: unknown) {
    // TODO: newBook(uParams: unknown) {
    // TODO: listArticles(uParams: unknown) {
    // TODO: listBooks(uParams: unknown) {
    newArticle: (uParams: unknown) => {
      return newArticle(denops, ensure(uParams, isNewArticleParams));
    },

    "command:newArticle": (uArgs: unknown) => {
      const [uOpts, uFlags] = parse(ensure(uArgs, is.ArrayOf(is.String)));
      const opts = ensure(
        uOpts,
        is.ObjectOf({
          "deno-executable": is.OptionalOf(is.String),
          "deno-run-args": is.OptionalOf(is.ArrayOf(is.String)),
          "cwd": is.OptionalOf(is.String),
          "clear-env": is.OptionalOf(is.Boolean),
          "uid": is.OptionalOf(is.Number),
          "gid": is.OptionalOf(is.Number),
        }),
      );
      const flags = ensure(
        uFlags,
        is.ObjectOf({
          slug: is.OptionalOf(is.String), // 記事のスラッグ. `a-z0-9`とハイフン(`-`)とアンダースコア(`_`)の12〜50字の組み合わせ
          title: is.OptionalOf(is.String), // 記事のタイトル
          type: is.OptionalOf(is.String), // 記事のタイプ. tech (技術記事) / idea (アイデア記事) のどちらかから選択
          emoji: is.OptionalOf(is.String), // アイキャッチとして使われる絵文字（1文字だけ）
          published: is.OptionalOf(is.Boolean), // 公開設定. true か false を指定する. デフォルトで"false"
          publicationName: is.OptionalOf(is.String), // Publication名. Zenn Publication に紐付ける場合のみ指定
        }),
      );
      return newArticle(denops, {
        denoExecutable: opts["deno-executable"],
        denoRunArgs: opts["deno-run-args"],
        cwd: opts.cwd,
        clearEnv: opts["clear-env"],
        uid: opts.uid,
        gid: opts.gid,
        slug: flags.slug,
        title: flags.title,
        type: flags.type,
        emoji: flags.emoji,
        published: flags.published,
        publicationName: flags.publicationName,
      });
    },
  });
}
