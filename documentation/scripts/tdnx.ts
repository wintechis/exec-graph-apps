/**
 * Custom script to generate documentation for the entire nx monorepo with typedoc
 * @author juliusstoerrle
 */

import * as ts from "typescript";
import { NxTypeDocApplication } from "./NxTypeDocApplication";
import { TSConfigReader, TypeDocReader, TypeDocOptions, DocumentationEntryPoint } from "typedoc";

var app_root_1 = require("nx/src/utils/app-root");
var devkit = require("@nrwl/devkit");
var tree = require("nx/src/generators/tree");
const glob = require("glob");
const path = require("path");


function getTsConfigFile(packageEntryPoint, tsConfigNames = [null]) {
    const tsConfigName = tsConfigNames.shift();
    let tsconfigFile = ts.findConfigFile(packageEntryPoint, ts.sys.fileExists, tsConfigName);
    if (tsconfigFile === undefined && tsConfigNames.length > 0) {
        tsconfigFile = getTsConfigFile(packageEntryPoint, tsConfigNames);
    }
    return tsconfigFile;
}

function getProjectEntryPoints(rootPath, project): string[] {
    return glob.sync(path.resolve(rootPath, project.sourceRoot, 'index.@(ts|js|tsx|jsx)'), {
        ignore: path.resolve(rootPath, project.root, "node_modules"),
    });
}

function fetchDocumentationEntryProints() {
    const results: DocumentationEntryPoint[] = [];

    // Extract projects from NX.dev configuration
    var host = new tree.FsTree(app_root_1.workspaceRoot);
    var nxProjects = devkit.getProjects(host);

    nxProjects.forEach(function (project) {
        // for each project find its entry point(s) -> usually index.ts
        const entryPointsOfProject = getProjectEntryPoints(app_root_1.workspaceRoot, project);
        entryPointsOfProject.forEach(packageEntryPoint => {
            // For each entry point we need the right tsconfig file describing the compliation environment
            const tsconfigFile = getTsConfigFile(packageEntryPoint, ['tsconfig.lib.json', 'tsconfig.app.json', null]);
            if (tsconfigFile === undefined) {
                console.error(`Could not determine tsconfig.json for source file ${packageEntryPoint} (it must be on an ancestor path)`);
                return;
            }
            let fatalError = false;
            const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(tsconfigFile, {}, {
                ...ts.sys,
                onUnRecoverableConfigFileDiagnostic: (error) => {
                    console.log(error);
                    fatalError = true;
                },
            });
            if (!parsedCommandLine) {
                return;
            }
            if (fatalError) {
                return;
            }
            const program = ts.createProgram({
                rootNames: parsedCommandLine.fileNames,
                // TODO options: options.fixCompilerOptions(parsedCommandLine.options),
                options: parsedCommandLine.options,
            });
            const sourceFile = program.getSourceFile(packageEntryPoint);
            if (sourceFile === undefined) {
                console.error(`Entry point "${packageEntryPoint}" does not appear to be built by the tsconfig found at "${tsconfigFile}"`);
                return;
            }
            // All information collected, now add them to the list of documented modules
            results.push({
                displayName: project.root,
                program,
                sourceFile,
            });
        });
    });
    return results;
}


async function main() {
    const app = new NxTypeDocApplication();

    // If you want TypeDoc to load tsconfig.json / typedoc.json files
    app.options.addReader(new TSConfigReader());
    app.options.addReader(new TypeDocReader());

    app.bootstrap({
        // typedoc options here
        // entryPoints: entrypoints,
    });

    // TypeDoc is not able to understand our project structure, 
    // so we do it for them and provide them a list of each module
    const documentationEntryPoints = fetchDocumentationEntryProints();
    const typeDocProject = app.convertExternalEntrypoints(documentationEntryPoints);

    if (typeDocProject) {
        // Project may not have converted correctly
        const outputDir = "dist/docs";

        // Rendered docs
        await app.generateDocs(typeDocProject, outputDir);
        // Alternatively generate JSON output
        // await app.generateJson(project, outputDir + "/documentation.json");
    }
}

main().catch(console.error);

