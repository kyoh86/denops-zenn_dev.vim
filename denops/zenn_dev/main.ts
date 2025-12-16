import type { Denops } from "@denops/core";
import { isNewArticleParams, newArticle } from "./command/new_article.ts";
import { isNewBookParams, newBook } from "./command/new_book.ts";
import { bindDispatcher } from "@kyoh86/denops-bind-params";
import { kebabToCamel } from "@kyoh86/denops-bind-params/keycase";
import { ensure, is } from "@core/unknownutil";
import { parse } from "@denops/std/argument";
import opener from "./lib/opener.ts";
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
      const file = await bound.newArticle(kebabToCamel({ ...opts, ...flags }));
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
      const dir = await bound.newBook(kebabToCamel({ ...opts, ...flags }));
      if (!dir) {
        return;
      }
      const edit = opener(ensure(uMods, is.String));
      await denops.cmd(`${edit} ${dir}`);
    },
  };
}
