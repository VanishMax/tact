import fs from 'fs';
import path from 'path';
import { parseImports } from '../grammar/grammar';

function resolveLibraryPath(filePath: string, name: string, stdlibPath: string): string {

    // Checked collection
    let checked: string[] = [];

    // Check stdlib
    if (name.startsWith('@stdlib/')) {
        let p = name.substring('@stdlib/'.length);
        let pp = path.resolve(__dirname, '..', '..', 'stdlib', 'libs', p + '.tact')
        checked.push(pp);
        if (fs.existsSync(pp)) {
            return pp;
        } else {
            throw Error('Unable to process import ' + name + ' from ' + filePath + ', checked: ' + checked.join(', '));
        }
    }

    // Check relative path
    let t = name;
    if (!t.endsWith('.tact') && !t.endsWith('.fc')) {
        t = t + '.tact';
    }
    let targetPath = path.resolve(filePath, '..', t);
    checked.push(targetPath);
    if (fs.existsSync(targetPath)) {
        return targetPath;
    }

    throw Error('Unable to process import ' + name + ' from ' + filePath + ', checked: ' + checked.join(', '));
}

export function resolveImports(root: string, sourceFile: string, stdlibPath: string) {

    // Load stdlib
    const stdlibRootPath = path.resolve(stdlibPath, 'stdlib.tact');
    const stdlib = fs.readFileSync(stdlibRootPath, 'utf-8');
    const codePath = path.resolve(root, sourceFile);
    const code = fs.readFileSync(codePath, 'utf8');

    const imported: { code: string, path: string }[] = [];
    const processed = new Set<string>();
    const funcImports: string[] = [];
    const pending: string[] = [];
    function processImports(path: string, source: string) {
        let imp = parseImports(source, path);
        for (let i of imp) {
            let resolved = resolveLibraryPath(path, i, stdlibPath);
            if (resolved.endsWith('.fc')) {
                if (funcImports.find((v) => v === resolved)) {
                    continue;
                }
                funcImports.push(resolved);
            } else {
                if (!processed.has(resolved)) {
                    processed.add(resolved);
                    pending.push(resolved);
                }
            }
        }
    }
    processImports(stdlibRootPath, stdlib);
    processImports(codePath, code);
    while (pending.length > 0) {
        let p = pending.shift()!;
        let librarySource = fs.readFileSync(p, 'utf8');
        imported.push({ code: librarySource, path: p });
        processImports(p, librarySource);
    }

    // Load func
    let fc: string[] = [];
    for (let i of funcImports) {
        fc.push(fs.readFileSync(i, 'utf8'));
    }

    return {
        tact: [
            { code: stdlib, path: stdlibPath },
            ...imported,
            { code, path: codePath }
        ],
        func: fc
    };
}