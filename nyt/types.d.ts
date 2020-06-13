// picked some items to display
export interface IArticle {
  abstract: string;
  web_url: string;
  lead_paragraph: string;
  print_section: string;
  source: string;
  snippet: string;
  print_page: string;
  headline: IHeadline;
  section_name: string;
}

interface IHeadline {
  main: string;
}

export interface IConfigFile {
  apiKey: string;
}