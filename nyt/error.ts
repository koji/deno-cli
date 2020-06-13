// things that display when a user runs 'help'
import { red, bold, cyan } from './deps.ts';

export const displayHelpAndQuit = (error?: string):void => {
  if (!error) {
  } else if (error === "INVALID_KEY") {
    console.log(
      bold(red(`Error: Invalid API key. Use --config flag to set key`))
    );
  } else console.log(bold(red(`Error: ${error}`)));
  console.log(`Usage: cli reader [filters]\n`);
  console.log(`Optional flags:`);
  console.log(`   ${bold("-h, --help")}\t\t Shows this help message and exits`);
  console.log(
    `   ${bold("-q, --query")}\t\t Find news related to a specific keyword`
  );
  console.log(
    `   ${bold("-s, --sort")}\t\t Sort news by newest, oldest or relevance default: newest`
  );
  console.log(
    `   ${bold(
      "--config <API_KEY>"
    )}\t Set API key for news API. The key can be received from ${cyan(
      `https://developer.nytimes.com/`
    )}`
  );
  // Exits the program
  Deno.exit();
};
