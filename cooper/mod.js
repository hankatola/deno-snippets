import { walk } from "https://deno.land/std/fs/mod.ts"
import { dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts"

const BARREL_FILE_NAME = `mod.js`

const getFinalFolderNameFromUrl = (url) => {
  return url.match(new RegExp(/([^/]+)(?=[/][^/]*$)/))[1]
}

const includeThisFile = (fileName, filePath, callingLocation) => {
  /*
    ignore the file if
      (1) it's in the same folder & has a special name OR
        - true && true
      (2) it's not in the same folder & doesn't have a special name
        - false && false
  */

  const hasSpecialName = fileName === BARREL_FILE_NAME
  const inSameFolder = dirname(filePath) === callingLocation
  return hasSpecialName !== inSameFolder
}

const determineModuleName = (fileName, filePath) => {
  if (fileName === BARREL_FILE_NAME) {
    return getFinalFolderNameFromUrl(filePath)
  }
  return fileName.slice(0, -3)
}

const cooper = async (metaUrl) => {
  const exports = {}
  const files = []
  console.log(`\nHi from cooper`)
  // const callingLocation = dirname(fromFileUrl(metaUrl))
  const callingLocation = fromFileUrl(metaUrl)
  console.log(callingLocation)

  // get all files & necessary attributes
  console.log(`file.path's`)
  for await (const file of walk(callingLocation, {
    maxDepth: 2,
    includeDirs: true,
    exts: [`js`, `ts`],
  })) {
    const moduleName = determineModuleName(file.name, file.path)
    console.log(file.path)
    files.push({
      path: file.path,
      name: file.name,
      included: includeThisFile(file.name, file.path, callingLocation),
      moduleName,
    })
  }

  // check for module naming collisions
  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      if (files[i].moduleName === files[j].moduleName) {
        throw new Error(
          `directory ${callingLocation} has a module naming collision on the name "${files[i].moduleName}". This is caused when a file & directory share the same name. To resolve this error, simply rename one of the items`
        )
      }
    }
  }

  // request all the modules at once && add them if not empty
  await Promise.all(
    files.map(async (file) => {
      if (file.included) {
        console.log(file.path)
        const module = await import(file.path)
        if (Object.keys(module).length > 0) {
          exports[file.moduleName] = module
        }
      }
    })
  )
  return exports
}

export default cooper
