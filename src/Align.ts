import { resolve } from "path"
import { spawn, ChildProcess } from "child_process"
import { window, Disposable, Position, Range, WorkspaceEdit, workspace } from "vscode"

export default class Align implements Disposable {
  readonly bin: string

  constructor() {
    this.bin = Align.ARCHS[process.platform]
  }

  async format() {
    const [text, range] = this.getCurrentSelection()
    if (typeof text !== "string" || !(range instanceof Range)) {
      return
    }

    try {
      const { document } = window.activeTextEditor
      const edit = new WorkspaceEdit()
      const replaceText = await this.exec(text, ["-s", "|"])
      edit.replace(document.uri, range, replaceText.replace(/[\n\r]$/, ""))

      return workspace.applyEdit(edit)
    } catch (error) {
      console.error(error)
    }
  }

  getCurrentSelection(): any[] {
    const { activeTextEditor } = window
    if (activeTextEditor) {
      const { document } = activeTextEditor
      const selectedRange = new Range(activeTextEditor.selection.start, activeTextEditor.selection.end)
      const selectedText = document.getText(selectedRange)
      return [selectedText, selectedRange]
    } else {
      return []
    }
  }

  exec(input: string | Buffer, flags: string[]): Promise<string> {
    const align = spawn(this.bin, flags)

    return new Promise(function executorFn(
      resolve: (value: string | PromiseLike<string>) => void,
      reject: (reason?: Error) => void
    ) {
      let stdout = ""
      let stderr = ""
      align.stdout.on("data", s => (stdout += s.toString()))
      align.stderr.on("data", s => (stderr += s.toString()))
      align.stdin.write(input)
      align.stdin.end()

      align.on("close", exit => {
        if (exit !== 0) {
          reject(new Error(stderr))
        } else {
          console.log(stdout)
          resolve(stdout)
        }
      })
    })
  }

  dispose() {
    console.log("Disposing...")
  }

  static get alignByOptions(): string[][] {
    return [
      ["Equals =", "="],
      ["Colon :", ":"],
      ["Fat Arrow =>", "=>"],
      ["Ampersands &", "&"],
      ["Vertical Bars |", "|"]
    ]
  }

  static get ARCHS() {
    return {
      darwin: resolve(__dirname, "../../lib/align-darwin"),
      linux: resolve(__dirname, "../../lib/align-linux"),
      win32: resolve(__dirname, "../../lib/align-windows"),
      freebsd: resolve(__dirname, "../../lib/align-freebsd")
    }
  }
}
