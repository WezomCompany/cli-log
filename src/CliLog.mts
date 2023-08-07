import _ from 'chalk';
import fromCWD from 'from-cwd';
import path from 'path';

export class CliLog {
	protected _source = (output: string, root = ''): string => {
		output = path.isAbsolute(output)
			? path.relative(fromCWD(root), path.normalize(output))
			: output;
		output = output.replaceAll(path.sep, '/');
		return output.replace(/^\.?\//, '');
	};

	processStart(name: string): void {
		console.log(_.green(name + '...'));
	}

	processStepOK(step: string): void {
		console.log(`${_.blueBright(`- ${step}:`)} ${_.green('OK!')}`);
	}

	processStepFailed(step: string): void {
		console.log(`${_.blueBright(`- ${step}:`)} ${_.red('Failed!')}`);
	}

	processDone(message = 'Done!'): void {
		console.log(_.green(message));
	}

	source(output: string, root?: string): void {
		output = this._source(output, root);
		output = /\d+:\d+$/.test(output) ? output : `${output}:0:0`;
		console.log(_.magenta(output));
	}

	warn(message: string): void {
		console.log(_.yellow(message));
	}

	error(error: unknown, withStackIfErrorInst = false): void {
		let message = '';
		if (error instanceof Error) {
			message = error.message;
			if (withStackIfErrorInst && error.stack) {
				message += '\n' + error.stack;
			}
		} else if (typeof error === 'string') {
			message = error;
		} else {
			message = 'UNKNOWN ERR';
		}
		console.log(_.red(message));
	}

	divider(lines = 1): void {
		new Array(lines).fill(null).forEach(() => console.log(''));
	}

	banner(message: string): void {
		const line =
			'-------------------------------------------------------------------------';
		const decoratedMsg = `---===  ${message}  ===---`;
		const indent = Math.floor((line.length - decoratedMsg.length) / 2);
		const spaces = indent > 0 ? new Array(indent).fill(' ').join('') : '';

		this.divider(2);
		console.log(_.green(line));
		console.log(_.green(spaces + decoratedMsg));
		console.log(_.green(line));
		this.divider(2);
	}
}
