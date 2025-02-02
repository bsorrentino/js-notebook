/// <reference types="@types/jest" />

import ts from 'typescript'
import { generateDTS } from '../tsc'

describe( 'typescipt compiler test', () => {
    
    it( 'generate declaration', () => {

        const result = generateDTS( 'src/__tests__/file1.ts', {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        })
        expect( result ).toBeDefined()
        expect( result ).not.toBeNull()

        console.log( result )
    })

})