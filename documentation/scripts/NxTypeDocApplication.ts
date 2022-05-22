/**
 * Extends the typedoc Application class to allow an external list of entry points
 * to be provided since typedoc can not understand our repository structure
 *
 * Code derived from original code of typedoc
 *
 * @author juliusstoerrle
 */

import {
  Application,
  DocumentationEntryPoint,
  TSConfigReader,
  TypeDocReader,
} from 'typedoc';
import * as ts from 'typescript';

function unique<T>(arr: Iterable<T> | undefined): T[] {
  return Array.from(new Set(arr));
}

function flatMap<T, U>(
  arr: readonly T[],
  fn: (item: T) => U | readonly U[] | undefined
): U[] {
  const result: U[] = [];

  for (const item of arr) {
    const newItem = fn(item);
    if (newItem instanceof Array) {
      result.push(...newItem);
    } else if (newItem != null) {
      result.push(newItem);
    }
  }

  return result;
}

export class NxTypeDocApplication extends Application {
  constructor() {
    super();
  }
  /**
   * Run the converter for the given set of files and return the generated reflections.
   *
   * @returns An instance of ProjectReflection on success, undefined otherwise.
   */
  convertExternalEntrypoints(entryPoints: DocumentationEntryPoint[]) {
    const start = Date.now();
    // We seal here rather than in the Converter class since TypeDoc's tests reuse the Application
    // with a few different settings.
    this.options.freeze();
    this.logger.verbose(
      `Using TypeScript ${this.getTypeScriptVersion()} from ${this.getTypeScriptPath()}`
    );

    /* if (
            !supportedVersionMajorMinor.some(
                (version) => version == ts.versionMajorMinor
            )
        ) {
            this.logger.warn(
                `You are running with an unsupported TypeScript version! This may work, or it might break. TypeDoc supports ${supportedVersionMajorMinor.join(
                    ", "
                )}`
            );
        }
*/
    if (!entryPoints) {
      this.logger.error(`No entry points provided`);
      return;
    }
    const programs = unique(entryPoints.map((e) => e.program));
    this.logger.verbose(
      `Converting with ${programs.length} programs ${entryPoints.length} entry points`
    );
    const errors = flatMap([...programs], ts.getPreEmitDiagnostics);
    if (errors.length) {
      this.logger.diagnostics(errors);
      return;
    }
    if (
      this.options.getValue('emit') === 'both' ||
      this.options.getValue('emit') === true
    ) {
      for (const program of programs) {
        program.emit();
      }
    }
    const startConversion = Date.now();
    this.logger.verbose(
      `Finished getting entry points in ${Date.now() - start}ms`
    );
    const project = this.converter.convert(entryPoints);
    this.logger.verbose(
      `Finished conversion in ${Date.now() - startConversion}ms`
    );
    return project;
  }
}
