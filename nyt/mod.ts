
import {
  parse,
  green,
  bold,
  magenta,
  cyan,
  Args,
  existsSync,
  writeJsonSync,
  readJsonSync,
} from "./deps.ts";
import { displayHelpAndQuit} from './error.ts';
import { IArticle, IConfigFile } from "./types.d.ts";
import Api from './api.ts';

const setApiKey = (parsedArgs: Args): void => {
  // Get home directory address
  const homeEnv: string | undefined = Deno.env.get("HOME");
  const home: string = typeof homeEnv === "string" ? homeEnv : "";
  const configFilePath: string = `${home}/.nyt.json`;
  //   Check if api-key is provided
  if (typeof parsedArgs.config === "string") {
    //   If the file is not present, then create file
    if (!existsSync(configFilePath)) {
      Deno.createSync(configFilePath);
    }
    // Write apiKey in the file
    writeJsonSync(configFilePath, { apiKey: parsedArgs.config });
    console.log(`${green(bold("Success"))} ApiKey set Successfully`);
    displayHelpAndQuit();
  } //   Handling if apiKey is not present after --config
  else displayHelpAndQuit("Config flag should be followed by apiKey");
};

const getApiKey = (): any => {
  // Get home directory address
  const homeEnv: string | undefined = Deno.env.get("HOME");
  const home: string = typeof homeEnv === "string" ? homeEnv : "";
  const configFilePath: string = `${home}/.nyt.json`;
  try {
    // load json
    const file = readJsonSync(configFilePath);
    if (typeof file === "object" && file !== null) {
      const configFile = file as IConfigFile;
      if (configFile.apiKey) return configFile.apiKey;
      else displayHelpAndQuit("apiKey not found in the config file ");
    }
  } catch (err) {
    console.log(`err: ${err}`);
    displayHelpAndQuit("Config file not present. Use --config to set apiKey");
  }
};


const displayBanner =(): void => {
  console.clear();
  console.log(`
🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕
🦕███╗░░██╗██╗░░░██╗████████╗  ░█████╗░██╗░░░░░██╗  ██████╗░███████╗░█████╗░██████╗░███████╗██████╗░🦕
🦕████╗░██║╚██╗░██╔╝╚══██╔══╝  ██╔══██╗██║░░░░░██║  ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗🦕
🦕██╔██╗██║░╚████╔╝░░░░██║░░░  ██║░░╚═╝██║░░░░░██║  ██████╔╝█████╗░░███████║██║░░██║█████╗░░██████╔╝🦕
🦕██║╚████║░░╚██╔╝░░░░░██║░░░  ██║░░██╗██║░░░░░██║  ██╔══██╗██╔══╝░░██╔══██║██║░░██║██╔══╝░░██╔══██╗🦕
🦕██║░╚███║░░░██║░░░░░░██║░░░  ╚█████╔╝███████╗██║  ██║░░██║███████╗██║░░██║██████╔╝███████╗██║░░██║🦕
🦕╚═╝░░╚══╝░░░╚═╝░░░░░░╚═╝░░░  ░╚════╝░╚══════╝╚═╝  ╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝🦕
🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕
  `);
  console.log(
    bold(
      green(
        `\nNews from New York Times API\n`,
      ),
    ),
  );
}

const displayArticles = (news: IArticle[]): void => {
  if(news.length === 0) {
    console.log(magenta(`Uh Oh! Looks like we cannot find any news`));
  }

  news.forEach((article: IArticle, index: number) => {
    console.log(bold(magenta(`   ${index + 1}\t${article.headline.main}`)));
    if (article.abstract) console.log(`\t${article.abstract}`);
    if (article.web_url) {
      console.log(cyan(`${bold(`\t${article.web_url}`)}\n`));
    }
  });
}

const invalidCategory = (category?: string): boolean => {
  if (category === undefined) return true;
  const validCategories: Set<string> = new Set([
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ]);
  return !validCategories.has(category);
};

const showFlags = (parsedArgs: Args): void => {
  let flagToName: Map<string, string> = new Map([
    ["q", "query"],
    ["c", "category"],
  ]);
  let flagsInfo: string[] = [];
  Object.keys(parsedArgs).forEach((arg) => {
    if (arg !== "_") {
      let argName = flagToName.has(arg) ? flagToName.get(arg) : arg;
      flagsInfo.push(`${green(`${argName}: `)}${parsedArgs[arg]}`);
    }
  });
  console.log(`Getting news by- \t${flagsInfo.join("\t")}\n`);
};


// main
if(import.meta.main) { // this is like python's if __name__ == "__main__"
  const { args } = Deno;
  const parsedArgs = parse(args);
  displayBanner();
  if(parsedArgs.config) setApiKey(parsedArgs);
  const apiKey: string = getApiKey();
  // console.log(`apiKey: ${apiKey}`);
  const apiClient: Api = new Api(apiKey);

  if (
    parsedArgs.config === undefined &&
    args.length !== 0 &&
    !parsedArgs.help &&
    !parsedArgs.h
  ) {
    showFlags(parsedArgs);
  }

  if (parsedArgs.category) {
    let error = invalidCategory(parsedArgs.category);
    if (error) {
      displayHelpAndQuit("Invalid category value found");
    }
  }

  if(args.length === 0 || parsedArgs.h || parsedArgs.help) {
    displayHelpAndQuit();
  } else if(
    parsedArgs.query ||
    parsedArgs.q ||
    parsedArgs.sort ||
    parsedArgs.s
  ) {
    const query = parsedArgs.query || parsedArgs.q;
    const sort = parsedArgs.sort || parsedArgs.s;
    const newsResponse = await apiClient.getNews(query, sort);
    if (typeof newsResponse === "object") displayArticles(newsResponse);
    else displayHelpAndQuit(newsResponse);
  } else {
    displayHelpAndQuit("Invalid argument");
  }
}