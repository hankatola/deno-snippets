// Import required modules from Deno standard library
import { run } from "https://deno.land/std@0.157.0/process/mod.ts"

const bashScriptURL = targetFile => {
  const repoLocation = `https://raw.githubusercontent.com/hankatola/deno-snippets/main/bash_scripts/`
  targetFile = targetFile.substring(targetFile.length-3) === `.sh` ? targetFile : `${targetFile}.sh`
  return `${repoLocation}${targetFile}`
}

export const runScript = async (script, args) => {
  if (typeof script !== 'string') {
    throw new TypeError(`script variable must be type string`)
  }

  try {
    const ensureArray = arg => Array.isArray(arg)? arg: [arg]

    // Running the shell script
    console.log(`executing script ${script}`)
    const process = run({
      cmd: args === undefined? [script] : [script, ensureArray(args)], // Command to run the shell script
      stdout: "piped",  // Capture the standard output
      stderr: "piped"   // Capture the standard error
    })

    // Wait for the process to complete and collect its output
    const { code } = await process.status()

    // Checking the exit code of the script to handle errors
    if (code === 0) {
      console.log(`\tscript succeeded`)
      const output = new TextDecoder().decode(await process.output())
      process.close()
      return output
    } else {
      console.log(`\tscript failed`)
      const error = new TextDecoder().decode(await process.stderrOutput())
      process.close()
      throw new Error(`Script failed with error: ${error}`)
    }
  } catch (error) {
    console.error(`unable to execute script`)
    throw new Error(`Unable to run script, error: ${error}`)
  }
}

