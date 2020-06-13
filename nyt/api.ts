import { IArticle } from './types.d.ts';

// https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=
class Api {
  readonly #baseURL: string = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  #apiKey: string = "";

  // set apiKey
  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }

  getNews = async (
    query: string | undefined,
    sort: 'newest' | 'oldest' | 'relevance' | undefined,
  ): Promise<IArticle[] | string> => {
    let additional: string = "";
    if (query) additional += `q=${encodeURI(query)}`;
    sort = (!sort) ? 'newest' : sort; // default newest
    additional += `&sort=${sort}`;

    try {
      const url = `${this.#baseURL}?${additional}&api-key=${this.#apiKey}`;

      const rawResult = await fetch(url);
      const result = await rawResult.json();

      if (result.status !== "OK") return "INVALID_KEY";
      const news: IArticle[] = result.response.docs;
      return news;
    } catch (err) {
      return "Cannot connect to server. Please check your internet connection";
    }
  };
}

export default Api;