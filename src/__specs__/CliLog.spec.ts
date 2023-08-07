import chalk from 'chalk';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CliLog } from '../CliLog.js';

describe('CliLog', () => {
	let loggedMessage = '';
	const spy = vi
		.spyOn(console, 'log')
		.mockImplementation((...args: string[]) => {
			loggedMessage += args.join(' ');
		});
	afterEach(() => {
		loggedMessage = '';
		spy.mockClear();
	});

	describe('method `.processStart()`', () => {
		it('should print a message with green color and dots', () => {
			const cliLog = new CliLog();
			cliLog.processStart('Test start');
			expect(spy).toBeCalledWith(chalk.green('Test start...'));
		});
	});

	describe('method `.processStepOK()`', () => {
		it('should print a message with blue color and OK! text', () => {
			const cliLog = new CliLog();
			cliLog.processStepOK('Test step');
			expect(spy).toBeCalledWith(
				`${chalk.blueBright('- Test step:')} ${chalk.green('OK!')}`
			);
		});
	});

	describe('method `.processStepFailed()`', () => {
		it('should print a message with blue color and Failed! text', () => {
			const cliLog = new CliLog();
			cliLog.processStepFailed('Test step');
			expect(spy).toBeCalledWith(
				`${chalk.blueBright('- Test step:')} ${chalk.red('Failed!')}`
			);
		});
	});

	describe('method `.processDone()`', () => {
		it('should print a message with green color and "Done!" text', () => {
			const cliLog = new CliLog();
			cliLog.processDone();
			expect(spy).toBeCalledWith(chalk.green('Done!'));
		});

		it('should print a message with green color and custom text', () => {
			const cliLog = new CliLog();
			cliLog.processDone('Success!');
			expect(spy).toBeCalledWith(chalk.green('Success!'));
		});
	});

	describe('method `.source()`', () => {
		it('should print the path with magenta color and `:0:0` marker in the end', () => {
			const cliLog = new CliLog();
			cliLog.source('CliLog.spec.ts');
			expect(spy).toBeCalledWith(chalk.magenta('CliLog.spec.ts:0:0'));
		});

		it('should not add more markers if they are already present', () => {
			const cliLog = new CliLog();
			cliLog.source('CliLog.spec.ts:0:0');
			expect(spy).toBeCalledWith(chalk.magenta('CliLog.spec.ts:0:0'));
		});
	});

	describe('method `.warn()`', () => {
		it('should print a message with yellow color', () => {
			const cliLog = new CliLog();
			cliLog.warn('Test warning');
			expect(spy).toBeCalledWith(chalk.yellow('Test warning'));
		});
	});

	describe('method `.error()`', () => {
		it('should print a message with red color', () => {
			const cliLog = new CliLog();
			cliLog.error('Test error');
			expect(spy).toBeCalledWith(chalk.red('Test error'));
		});

		it('should print a message with red color from the Error object', () => {
			const cliLog = new CliLog();
			cliLog.error(new Error('Test error'));
			expect(spy).toBeCalledWith(chalk.red('Test error'));
		});

		it('should print a message with red color from the Error object with Error stack', () => {
			const cliLog = new CliLog();
			cliLog.error(new Error('Test error'), true);
			const loggedMessageLength = spy.mock.calls[0][0].length;
			const messageLength = chalk.red('Test error').length;
			expect(loggedMessageLength).toBeGreaterThan(messageLength);
		});

		it('should print a message "UNKNOWN ERR" with red color when argument is acceptable', () => {
			const cliLog = new CliLog();
			cliLog.error(null);
			expect(spy).toBeCalledWith(chalk.red('UNKNOWN ERR'));
		});
	});

	describe('method `.divider()`', () => {
		it('should print a divider with 1 line by default', () => {
			const cliLog = new CliLog();
			cliLog.divider();
			expect(spy).toBeCalledTimes(1);
		});

		it('should print a divider with 3 lines by demand', () => {
			const cliLog = new CliLog();
			cliLog.divider(3);
			expect(spy).toBeCalledTimes(3);
		});
	});

	describe('method `.banner()`', () => {
		it('should print a banner with 7 lines', () => {
			const cliLog = new CliLog();
			cliLog.banner('Test banner');
			expect(spy).toBeCalledTimes(7);
			expect(loggedMessage).toContain('---===  Test banner  ===---');
		});
	});
});
