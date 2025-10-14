import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getParsedArguments } from './utils/argParsing.ts';
import { getResponses } from './utils/prompts.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configDir = path.join(__dirname, 'configs');
const userConfigDir = path.join(__dirname, 'e2e', 'config');

const configExclusions = ['base.config.ts'];

const getAllAvailableConfigs = async (): Promise<string[]> => {
	try {
		const cfgs = await fs.readdir(configDir, { recursive: false });
		return cfgs.filter((cfg) => !configExclusions.includes(cfg))
	} catch (err) {
		console.error(`Could not get list of configs. located at ${configDir}`);
		process.exit(10);
	}
}

const getAllAvailableUsers = async (): Promise<Set<string>> => {
	let users = new Set<string>();
	try {
		const cfgs = await fs.readdir(userConfigDir, { recursive: false });
		for (let cfg of cfgs) {
			try {
				const dataString = await fs.readFile(`${userConfigDir}/${cfg}`, { encoding: 'utf-8' });
				const data = JSON.parse(dataString);
				Object.keys(data).forEach((key) => users.add(key));
			} catch (err) {
				console.log(`Error reading ${cfg}. skipping`)
			}
		};
		return users;

	} catch (err: any) {
		console.error('Reading available users failed.', err.message);
		process.exit(1);
	}
}


const configs = await getAllAvailableConfigs();
const users = await getAllAvailableUsers();

let { user, config, style } = getParsedArguments();
if (!user && Boolean(config) || Boolean(user) && !config) {
	console.error('Please specify both user and config.\nRun without arguments for interactive');
	process.exit(1);
} else if (!user && !config) {
	const responses = await getResponses(users, configs);
	config = responses.config;
	user = responses.user;
	style = responses.headless
}
if (!configs.includes(config)) {
	console.error(`The specified config can not be found in ${configDir}`);
	process.exit(1);
}

if (!users.has(user)) {
	console.error(`The specified user cannot be found in ${userConfigDir}`);
	process.exit(1);
}
const mode = style === 'headless' ? '' : style === 'ui' ? '--ui' : '--headed';

console.log('Running tests\n\n');

execSync(`user=${user} npx playwright test --config ${configDir}/${config} ${mode}`, { stdio: 'inherit' });

