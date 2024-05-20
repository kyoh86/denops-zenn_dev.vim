function zenn_dev#setup#params(params)
  call denops#notify('zenn_dev', 'params:set-all', [a:params])
endfunction

function zenn_dev#setup#commands(commands)
  if has_key(a:commands, 'ZennDevNewArticle') && a:commands.ZennDevNewArticle
    command! -nargs=* ZennDevNewArticle call denops#notify("zenn_dev", "command:newArticle", [<q-mods>, [<f-args>]])
  endif
  if has_key(a:commands, 'ZennDevNewBook') && a:commands.ZennDevNewBook
    command! -nargs=* ZennDevNewBook call denops#notify("zenn_dev", "command:newBook", [<q-mods>, [<f-args>]])
  endif
endfunction
