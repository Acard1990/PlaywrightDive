import { Command } from 'commander';

export const getParsedArguments = () => {
	const program = new Command();

	program
		.name('Playwright wrap runner')
		.description('CLI to quick start a test suite')
		.version('0.0.1')
		.option('-u, --user <string>', 'name to user')
		.option('-c, --config <string>', 'configuration to use')
		.option('-s --style <string>', 'headless is the default. options are: "headed", "ui", "headless"', 'headless')
		.allowExcessArguments(true)
		.parse();


	const options = program.opts();
	return options;
}