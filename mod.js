// Import required modules from Deno standard library
import { run } from "https://deno.land/std@0.157.0/process/mod.ts";

const bashScriptURL = targetFile => {
  const repoLocation = `https://raw.githubusercontent.com/hankatola/deno-snippets/main/bash_scripts/`
  targetFile = targetFile.substring(targetFile.length-3) === `.sh` ? targetFile : `${targetFile}.sh`
  return `${repoLocation}${targetFile}`
}

export const runScript = async (script, argvCommands) => {
  if (typeof script !== 'string') {
    throw new TypeError(`script variable must be type string`)
  }
  const ensureArray = arg => Array.isArray(arg)? arg: [arg]
  const shellCommands = argvCommands === undefined? [script] : [script, ensureArray(argvCommands)]

  try {
    // Running the shell script
    const process = run({
      cmd: shellCommands(script, argvCommands), // Command to run the shell script
      stdout: "piped",  // Capture the standard output
      stderr: "piped"   // Capture the standard error
    });

    // Wait for the process to complete and collect its output
    const { code } = await process.status();

    // Checking the exit code of the script to handle errors
    if (code === 0) {
      const output = new TextDecoder().decode(await process.output());
      console.log("Output:", output);
    } else {
      const error = new TextDecoder().decode(await process.stderrOutput());
      console.error("Error:", error);
    }

    // Always close the process after completion to free up system resources
    process.close();
  } catch (error) {
    console.error("Failed to run script:", error);
  }
}
