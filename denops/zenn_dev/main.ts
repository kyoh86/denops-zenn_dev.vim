import { Denops } from "jsr:@denops/core@6.1.0";
import { isNewArticleParams, newArticle } from "./command/new_article.ts";
import { isNewBookParams, newBook } from "./command/new_book.ts";
import { bindDispatcher } from "jsr:@kyoh86/denops-bind-params@0.0.1-alpha.2";
import { ensure, is } from "jsr:@core/unknownutil@3.18.1";
import { parse } from "https://deno.land/x/denops_std@v6.5.0/argument/mod.ts";
import opener from "./lib/opener.ts";
import { camelObject } from "./lib/params.ts";
import { isCommonParams } from "./command/common.ts";
import { isListArticlesParams, listArticles } from "./command/list_articles.ts";

export function main(denops: Denops) {
  const bound = bindDispatcher({
    // TODO: init(uParams: unknown) {
    // TODO: preview(uParams: unknown) {
    // TODO: listBooks(uParams: unknown) {
    newArticle: async (uParams: unknown) => {
      return await newArticle(
        denops,
        ensure(
          uParams,
          is.IntersectionOf([isCommonParams, isNewArticleParams]),
        ),
      );
    },
    newBook: async (uParams: unknown) => {
      return await newBook(
        denops,
        ensure(
          uParams,
          is.IntersectionOf([isCommonParams, isNewBookParams]),
        ),
      );
    },
    listArticles: async (uParams: unknown) => {
      return await listArticles(
        denops,
        ensure(
          uParams,
          isListArticlesParams,
        ),
      );
    },
  });

  denops.dispatcher = {
    ...bound,
    "command:newArticle": async (uMods: unknown, uArgs: unknown) => {
      const [uOpts, uFlags] = parse(ensure(uArgs, is.ArrayOf(is.String)));
      const opts = ensure(uOpts, isCommonParams);
      const flags = ensure(uFlags, isNewArticleParams);
      if ("published" in flags) {
        flags.published = true;
      }
      const file = await bound.newArticle(camelObject({ ...opts, ...flags }));
      if (!file) {
        return;
      }
      const edit = opener(ensure(uMods, is.String));
      await denops.cmd(`${edit} ${file}`);
    },
    "command:newBook": async (uMods: unknown, uArgs: unknown) => {
      const [uOpts, uFlags] = parse(ensure(uArgs, is.ArrayOf(is.String)));
      const opts = ensure(uOpts, isCommonParams);
      const flags = ensure(uFlags, isNewBookParams);
      const dir = await bound.newBook(camelObject({ ...opts, ...flags }));
      if (!dir) {
        return;
      }
      const edit = opener(ensure(uMods, is.String));
      await denops.cmd(`${edit} ${dir}`);
    },
  };
}
