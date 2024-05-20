import { is } from "jsr:@core/unknownutil@3.18.1";

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

export function getDenoExecutable(args: CommonParams): string {
  return args.denoExecutable ?? defaultDenoExecutable;
}

export function getZennArgs(args: CommonParams): string[] {
  return args.denoRunArgs ?? defaultZennArgs;
}
export function getCommandOptions(
  args: CommonParams,
  otherOptions: Partial<Deno.CommandOptions>,
): Deno.CommandOptions {
  return { ...args, ...otherOptions };
}

export const isCommonParams = is.ObjectOf({
  denoExecutable: is.OptionalOf(is.String),
  denoRunArgs: is.OptionalOf(is.ArrayOf(is.String)),
  cwd: is.OptionalOf(is.String),
  env: is.OptionalOf(is.RecordOf(is.String, is.String)),
  clearEnv: is.OptionalOf(is.Boolean),
  uid: is.OptionalOf(is.Number),
  gid: is.OptionalOf(is.Number),
});

export interface CommonParams {
  denoExecutable?: string;
  denoRunArgs?: string[];
  cwd?: string;
  env?: Record<string, string>;
  clearEnv?: boolean;
  uid?: number;
  gid?: number;
}
