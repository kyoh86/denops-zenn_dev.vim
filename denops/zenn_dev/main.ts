import { Denops } from "https://deno.land/x/denops_std@v6.4.0/mod.ts";
import {} from "https://deno.land/x/denops_std@v6.4.0/helper/mod.ts";
import {
  ensure,
  is,
  Predicate,
} from "https://deno.land/x/unknownutil@v3.17.0/mod.ts";
import { isNewArticleArgs, newArticle } from "./command/new_article.ts";
import {
  ArgStore,
  isArgs,
} from "https://denopkg.com/kyoh86/denops-arg-store@v0.0.1/mod.ts";

export function main(denops: Denops) {
  const argStore = new ArgStore();

  function ensureArgs<T>(func: string, uArgs: unknown, pred: Predicate<T>): T {
    return ensure(argStore.getArgs(func, ensure(uArgs, isArgs)), pred);
  }
  denops.dispatcher = {
    // TODO: init(uArgs: unknown) {
    // TODO: preview(uArgs: unknown) {
    // TODO: newBook(uArgs: unknown) {
    // TODO: listArticles(uArgs: unknown) {
    // TODO: listBooks(uArgs: unknown) {
    async newArticle(uArgs: unknown) {
      return await newArticle(
        denops,
        ensureArgs("newArticle", uArgs, isNewArticleArgs),
      );
    },

    customSetFuncArg(uFunc: unknown, uArg: unknown, value: unknown) {
      argStore.setFuncArg(
        ensure(uFunc, is.String),
        ensure(uArg, is.String),
        value,
      );
    },

    customPatchFuncArgs(uFunc: unknown, uArgs: unknown) {
      argStore.patchFuncArgs(
        ensure(uFunc, is.String),
        ensure(uArgs, isArgs),
      );
    },

    customPatchArgs(uArgs: unknown) {
      argStore.patchArgs(ensure(uArgs, is.RecordOf(isArgs)));
    },
  };
}
