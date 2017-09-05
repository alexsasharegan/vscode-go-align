"use strict"
import { window, commands, ExtensionContext } from "vscode"
import WordCounter from "./WordCounter"
import Align from "./Align"

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "WordCount" is now active!')
  console.log(process.version)

  // create a new word counter
  let wordCounter = new WordCounter()
  let align = new Align()

  let disposable = commands.registerCommand("extension.align", () => {
    wordCounter.updateWordCount()
    align.getCurrentSelection()
  })

  // Add to a list of disposables which are disposed when this extension is deactivated.
  context.subscriptions.push(wordCounter)
  context.subscriptions.push(align)
  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
