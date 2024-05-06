function zenn_dev#setup#params(params)
  call denops#dispatch('zenn_dev', 'params:set-all', [a:params])
endfunction

function zenn_dev#setup#commands()
  command! -nargs=* ZennDevNewArticle call denops#request("zenn_dev", "command:newArticle", [[<f-args>]])
endfunction
