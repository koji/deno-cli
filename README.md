# deno-cli

## new york times api
![nyt](./images/news_cli.png)
```zsh
$ cd cli/nyt

# set apiKey
# you need to get apiKey https://developer.nytimes.com
$ deno run mod.ts --config "apiKey"

# run cli reader
# -q: query for search news
# -s: sort newest, oldest or relevance default is newest
$ deno run --allow-net --allow-read --allow-write --allow-env mod.ts -q japan -s newest
```