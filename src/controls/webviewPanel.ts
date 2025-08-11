import path from "path";
import * as vscode from "vscode";

import { PanelType } from "./PanelType";

export enum Commands {
  ShowMessage = "showMessage",
  OpenExternalLink = "openExternalLink",
  CreateGithubSample = "createGithubSample"
}

export class WebviewPanel {
  private static readonly viewType = "f5-extension-webview";
  public static currentPanels: WebviewPanel[] = [];

  private panel: vscode.WebviewPanel;
  private panelType: PanelType = PanelType.Default;
  private disposables: vscode.Disposable[] = [];
  private context: vscode.ExtensionContext;

  public static createOrShow(panelType: PanelType, context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    
    // Check if panel already exists
    const existingPanelIndex = WebviewPanel.currentPanels.findIndex(
      (panel) => panel.panelType === panelType
    );
    
    if (existingPanelIndex > -1) {
      WebviewPanel.currentPanels[existingPanelIndex].panel.reveal(column);
    } else {
      WebviewPanel.currentPanels.push(
        new WebviewPanel(panelType, context, column || vscode.ViewColumn.One)
      );
    }
  }

  private constructor(panelType: PanelType, context: vscode.ExtensionContext, column: vscode.ViewColumn) {
    this.panelType = panelType;
    this.context = context;

    // Create and show a new webview panel
    this.panel = vscode.window.createWebviewPanel(
      WebviewPanel.viewType,
      this.getWebpageTitle(panelType),
      column,
      {
        // Enable javascript in the webview
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, "out")),
        ],
      }
    );

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      async (msg) => {
        switch (msg.command) {
          case Commands.ShowMessage:
            vscode.window.showInformationMessage(msg.data);
            break;
          case Commands.OpenExternalLink:
            void vscode.env.openExternal(vscode.Uri.parse(msg.data));
            break;
          case Commands.CreateGithubSample:
            void vscode.commands.executeCommand('f5.getGitHubExample', vscode.Uri.parse(msg.data));
            break;
          default:
            break;
        }
      },
      undefined,
      this.disposables
    );

    // Set the webview's initial html content
    this.panel.webview.html = this.getHtmlForWebview(panelType);
  }

  private getWebpageTitle(panelType: PanelType): string {
    switch (panelType) {
      case PanelType.SampleGallery:
        return "Code Samples";
      case PanelType.DemoGuides:
        return "Demo Guides";
      default:
        return "The F5 Extension";
    }
  }

  private getHtmlForWebview(panelType: PanelType) {
    const scriptBasePathOnDisk = vscode.Uri.file(
      path.join(this.context.extensionPath, "out/")
    );
    const scriptBaseUri = this.panel.webview.asWebviewUri(scriptBasePathOnDisk);

    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this.context.extensionPath, "out/src", "client.js")
    );
    const scriptUri = this.panel.webview.asWebviewUri(scriptPathOnDisk);
    const stylesheetUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "out", "resource", "client.css")
    );

    // Use a nonce to to only allow specific scripts to be run
    const nonce = this.getNonce();
    return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>the-f5-extension</title>
            <base href='${scriptBaseUri.toString()}' />
            <link href="${stylesheetUri.toString()}" rel="stylesheet" />
          </head>
          <body>
            <div id="root"></div>
            <script>
              const vscode = acquireVsCodeApi();
              const panelType = '${panelType}';
            </script>
            <script nonce="${nonce}" type="module" src="${scriptUri.toString()}"></script>
          </body>
        </html>`;
  }

  private getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public dispose() {
    const panelIndex = WebviewPanel.currentPanels.indexOf(this);
    WebviewPanel.currentPanels.splice(panelIndex, 1);

    // Clean up our resources
    this.panel.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}