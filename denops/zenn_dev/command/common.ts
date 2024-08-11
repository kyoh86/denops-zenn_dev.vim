import { as, is } from "jsr:@core/unknownutil@~4.1.0";

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
  denoExecutable: as.Optional(is.String),
  denoRunArgs: as.Optional(is.ArrayOf(is.String)),
  cwd: as.Optional(is.String),
  env: as.Optional(is.RecordOf(is.String, is.String)),
  clearEnv: as.Optional(is.Boolean),
  uid: as.Optional(is.Number),
  gid: as.Optional(is.Number),
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
