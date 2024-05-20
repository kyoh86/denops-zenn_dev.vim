function zenn_dev#setup#params(params)
  call denops#notify('zenn_dev', 'params:set-all', [a:params])
endfunction

function zenn_dev#setup#commands()
  command! -nargs=* ZennDevNewArticle call denops#notify("zenn_dev", "command:newArticle", [{"mods": <q-mods>, "args": [<f-args>]}])
  command! -nargs=* ZennDevNewBook call denops#notify("zenn_dev", "command:newBook", [{"mods": <q-mods>, "args": [<f-args>]}])
endfunction
