import * as vscode from 'vscode';

export interface Terminal extends vscode.Terminal {}

export function activate(context: vscode.ExtensionContext) {
  let terminal: Terminal;

  terminal = vscode.window.createTerminal({ name: 'Task Runner' });

  let disposable = vscode.commands.registerCommand('extension.runTask', async () => {
    try {
      const taskName = await vscode.window.showInputBox({ prompt: 'Enter task name' });
      if (!taskName) {
        throw new Error('Task name is required');
      }

      const task = await getTask(taskName);
      if (!task) {
        throw new Error(`Task '${taskName}' not found`);
      }

      const command = await getCommandForTask(task);
      if (!command) {
        throw new Error(`No command found for task '${task}'`);
      }

      terminal.show();
      terminal.sendText(command);
      // Wait for a moment to allow the terminal to execute the command
      await new Promise((resolve) => setTimeout(resolve, 1000));
      vscode.window.showInformationMessage('Task executed successfully.');
    } catch (error) {
      vscode.window.showErrorMessage((error as Error).message);
    }
  });

  context.subscriptions.push(disposable);
}

async function getTask(terminal: string): Promise<string | undefined> {
  // Replace this with your own logic to retrieve the task for the specified terminal
  const tasks = ['build', 'test'];
  for (const task of tasks) {
    if (task === terminal) {
      return task;
    }
  }

  return undefined;
}

async function getCommandForTask(task: string): Promise<string | undefined> {
  // Replace this with your own logic to retrieve the command for the specified task
  const commands: { [key: string]: string } = {
    build: 'npm run build',
    test: 'npm test',
  };
  if (commands.hasOwnProperty(task)) {
    return commands[task] as string;
  }

  return undefined;
}
