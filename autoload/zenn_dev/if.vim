function zenn_dev#if#new_article(params)
  return denops#request('zenn_dev', 'newArticle', [a:params])
endfunction

function zenn_dev#if#new_book(params)
  return denops#request('zenn_dev', 'newBook', [a:params])
endfunction

function zenn_dev#if#list_articles(params)
  return denops#request('zenn_dev', 'listArticles', [a:params])
endfunction
