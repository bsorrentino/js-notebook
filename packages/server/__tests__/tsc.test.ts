/// <reference types="@types/jest" />

import ts from 'typescript'
import { generateDTS } from '../src/routes/tsc'

describe( 'typescipt compiler test', () => {
    
    it( 'generate declaration', () => {

        const result = generateDTS( '__tests__/file1.ts', {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        })
        expect( result ).toBeDefined()
        expect( result ).not.toBeNull()

    })

})