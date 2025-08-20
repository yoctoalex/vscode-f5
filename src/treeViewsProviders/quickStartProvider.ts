let currentPanel: vscode.WebviewPanel | undefined;
import * as vscode from 'vscode';

import { WebviewPanel } from '../controls/webviewPanel';
import { PanelType } from '../controls/PanelType';


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
  font-family: var(--vscode-font-family, sans-serif);
  padding: 0 20px 0 20px;
  background-color: var(--vscode-sideBar-background, #252526);
  color: var(--vscode-editor-foreground, #d4d4d4);
}

h2 {
  font-size: 16px;
  color: var(--vscode-textLink-foreground, #3794ff);
  margin-bottom: 10px;
}

p {
  margin: 0;
}

.section {
  margin-top: 20px;
}

.section h3 {
  font-size: 14px;
  margin-bottom: 8px;
}

/* ── BUTTON CONTAINER ── */
.button-container {
  /* make it positionable and animatable */
  position: relative;
  width: 100%;
  max-width: 300px;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;      /* start centered */
  
  /* center via left/transform */
  left: 50%;
  transform: translateX(-50%);
  
  /* animate slide */
  transition: left 0.2s ease, transform 0.2s ease;
  background-color: transparent;
}

@media (min-width: 641px) {
  .button-container {
    /* slide back to left */
    left: 0;
    transform: none;
    justify-content: flex-start;  /* also align items left */
  }
}

/* ── BUTTONS ── */
button {
  display: block;
  width: 100%;
  margin: 8px 0;
  padding: 0.4em 1em;
  
  font-size: var(--vscode-font-size, 13px);
  line-height: var(--vscode-button-height, 1.25);
  font-family: inherit;
  
  background-color: var(--vscode-button-background, #0e639c);
  color:            var(--vscode-button-foreground, #ffffff);
  border: none;
  border-radius: var(--vscode-editor-widget-border-radius, 2px);
  cursor: pointer;
  
  transition: background-color .0.2s ease;
}

button:hover {
  background-color: var(--vscode-button-hoverBackground, #1177bb);
}

button:focus {
  outline: 2px solid var(--vscode-focusBorder, #007fd4);
  outline-offset: 1px;
}

/* ── LINKS ── */
.link {
  color: var(--vscode-textLink-foreground, #3794ff);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
  color: var(--vscode-textLink-activeForeground, #62aeee);
}
      </style>
      </head>
      <body>
      <h2>THE F5 EXTENSION</h2>

      <p>Get started with BIG-IP automation using guides, video tutorials & documentation.</p>

      <div class="button-container">
      <button onclick="runCommand('f5.guides')">Browse Guides and Tutorials</button>
      </div>

      <p>Explore code samples to build and deploy directly from VS Code</p>

      <div class="button-container">
      <button onclick="runCommand('f5.samples')">Explore Code Samples</button>
      </div>

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

  context.subscriptions.push(
    vscode.commands.registerCommand('f5.samples', () => {
      WebviewPanel.createOrShow(
        PanelType.SampleGallery,
        context,
      );
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('f5.guides', () => {
      WebviewPanel.createOrShow(
        PanelType.DemoGuides,
        context,
      );
    }),
  );
}