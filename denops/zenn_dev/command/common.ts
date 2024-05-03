import { is } from "https://deno.land/x/unknownutil@v3.18.0/mod.ts";

const defaultDenoExecutable = "deno";
const defaultZennArgs = [
  "run",
  "--allow-env",
  "--allow-read",
  "--allow-sys",
  "--allow-net",
  "--allow-write",
  "--unstable-fs",
  "npm:zenn-cli",
];

export function getDenoExecutable(args: CommonArgs): string {
  return args.denoExecutable ?? defaultDenoExecutable;
}

export function getZennArgs(args: CommonArgs): string[] {
  return args.denoRunArgs ?? defaultZennArgs;
}
export function getCommandOptions(
  args: CommonArgs,
  otherOptions: Partial<Deno.CommandOptions>,
): Deno.CommandOptions {
  return { ...args, ...otherOptions };
}

export const isCommonArgs = is.ObjectOf({
  denoExecutable: is.OptionalOf(is.String),
  denoRunArgs: is.OptionalOf(is.ArrayOf(is.String)),
  cwd: is.OptionalOf(is.String),
  env: is.OptionalOf(is.RecordOf(is.String, is.String)),
  clearEnv: is.OptionalOf(is.Boolean),
  uid: is.OptionalOf(is.Number),
  gid: is.OptionalOf(is.Number),
});

export interface CommonArgs {
  denoExecutable?: string;
  denoRunArgs?: string[];
  cwd?: string;
  env?: Record<string, string>;
  clearEnv?: boolean;
  uid?: number;
  gid?: number;
}
