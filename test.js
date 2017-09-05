const { promisify } = require("util")
const { resolve } = require("path")
const { spawn } = require("child_process")

function align(input, flags) {
  const _align = spawn(resolve(__dirname, "lib/align-darwin"), flags)
  let stdout = ""
  let stderr = ""

  _align.stdout.on("data", s => {
    stdout += s.toString()
  })
  _align.stderr.on("data", s => {
    stderr += s.toString()
  })

  _align.stdin.write(input)
  _align.stdin.end()

  _align.on("close", exit => {
    if (exit !== 0) {
      throw new Error(stderr)
    } else {
      console.log(stdout)
    }
  })
}

align("field1|field2\nValue1|Value2\nCoolValue1|CoolValue2|CoolValue3", ["-s", "|"])
