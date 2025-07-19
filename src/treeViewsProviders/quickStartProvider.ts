let currentPanel: vscode.WebviewPanel | undefined;
import * as vscode from 'vscode';

export class QuickStartProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'quickStart';

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.onDidReceiveMessage(message => {
      if (message.command) {
        vscode.commands.executeCommand(message.command);
      }
    });

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const nonce = getNonce();
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <style>
        body {
        font-family: sans-serif;
        padding: 20px;
        background-color: #f3f3f3;
        color: #333;
        }

        h2 {
        font-size: 16px;
        color: #0067b8;
        margin-bottom: 10px;
        }

        p {
        margin: 16px 0;
        }

        button {
        display: block;
        width: 100%;
        background-color: #0067b8;
        color: white;
        border: none;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        }

        button:hover {
        background-color: #005ba1;
        }

        .link {
        color: #0067b8;
        text-decoration: none;
        }

        .link:hover {
        text-decoration: underline;
        }

        .section {
        margin-top: 20px;
        }

        .section h3 {
        font-size: 14px;
        margin-bottom: 8px;
        }
      </style>
      </head>
      <body>
      <h2>THE F5 EXTENSION</h2>

      <p>Welcome to the F5 Extension!</p>
      <p>Get started with a guided tutorial for F5 development</p>

      <button onclick="runCommand('f5.build')">Start building with an example</button>

      <p>Or jump right into the app development with app templates or samples</p>

      <button onclick="runCommand('f5.samples')">View Samples</button>

      <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        function runCommand(cmd) {
        vscode.postMessage({ command: cmd });
        }
      </script>
      </body>
      </html>
    `;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function registerQuickStartProvider(context: vscode.ExtensionContext) {
  const provider = new QuickStartProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(QuickStartProvider.viewType, provider)
  );

  //vscode.window.registerTreeDataProvider('quickStart', provider);

  context.subscriptions.push(
    vscode.commands.registerCommand('f5.samples', () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One); // просто фокусируем
        return;
      }

      currentPanel = vscode.window.createWebviewPanel(
        'samplesWebview',
        'Samples',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      currentPanel.webview.html = getWebviewContent();

      currentPanel.onDidDispose(() => {
        currentPanel = undefined;
      }, null, context.subscriptions);
    })
  );
}

function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: sans-serif;
          padding: 20px;
        }

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        select, input {
          padding: 6px;
          font-size: 14px;
        }

        .card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .tag {
          display: inline-block;
          background-color: #eee;
          border-radius: 4px;
          padding: 2px 6px;
          margin-right: 5px;
          font-size: 12px;
        }

        h2 {
          margin-top: 0;
        }
      </style>
      <title>F5 BIG-IP Samples Gallery</title>
    </head>
    <body>
      <h1>F5 BIG-IP Sample Gallery</h1>

      <div class="filters">
        <input type="text" placeholder="Search samples..." />
        <select>
          <option selected disabled>Module</option>
          <option>LTM</option>
          <option>ASM</option>
          <option>DNS</option>
          <option>AFM</option>
        </select>
        <select>
          <option selected disabled>Language</option>
          <option>iRules TCL</option>
          <option>AS3 JSON</option>
          <option>Python</option>
        </select>
        <select>
          <option selected disabled>Technology</option>
          <option>Automation</option>
          <option>REST API</option>
          <option>Declarative Onboarding</option>
        </select>
      </div>

      <div class="card">
        <h2>iRules: Redirect HTTP to HTTPS</h2>
        <div>
          <span class="tag">LTM</span>
          <span class="tag">iRules TCL</span>
        </div>
        <p>Sample iRule to redirect all HTTP traffic to HTTPS on BIG-IP LTM.</p>
      </div>

      <div class="card">
        <h2>AS3: Basic Virtual Server</h2>
        <div>
          <span class="tag">LTM</span>
          <span class="tag">AS3 JSON</span>
          <span class="tag">Automation</span>
        </div>
        <p>AS3 declaration for a simple virtual server configuration.</p>
      </div>

      <div class="card">
        <h2>Python: REST API Pool Member Status</h2>
        <div>
          <span class="tag">LTM</span>
          <span class="tag">Python</span>
          <span class="tag">REST API</span>
        </div>
        <p>Python script to query BIG-IP pool member status using REST API.</p>
      </div>
    </body>
    </html>
  `;
}