import prompts from 'prompts';

export const getResponses = async (users: Set<string>, configs: string[]) => {
	const responses = await prompts([
		{
			type: 'autocomplete',
			name: 'user',
			message: 'What user should be used to login?',
			choices: [...users].map((user) => ({ title: user, value: user }))
		},
		{
			type: 'autocomplete',
			name: 'config',
			message: 'What config would you like to run?',
			choices: configs.map((cfg) => ({ title: cfg, value: cfg }))
		},
		{
			type: 'select',
			name: 'headless',
			message: 'How would you like to run these tests?',
			choices: [{ title: 'Open UI', value: 'ui' }, { title: 'No headless', value: 'headless' }, { title: 'headed', value: 'headed' }]
		}
	], {
		onCancel: () => {
			console.log('Cancelled by user.'); process.exit(0);
		}
	})
	return responses;
}