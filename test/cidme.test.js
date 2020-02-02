/**
 * @file Jest JS unit tests for CIDME core.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2020
 * @license MIT
 */

'use strict'

// These are for by Jest, but throw errors in StandardJS
/* global expect, test */

/* ************************************************************************** */
// Init AJV JSON Validator

let Ajv = require('ajv')
    // let ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    // ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
let ajv = new Ajv({ schemaId: 'auto' })
    /* ************************************************************************** */

/* ************************************************************************** */
// Init UUID.js

// const UUID = require('./uuid');
const UUID = require('uuidjs')

/* ************************************************************************** */

let creatorId = 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
let cidmeUrl = 'http://cidme.net/vocab/'
    // let cidmeUrlCore = cidmeUrl + '/core'
    // let cidmeUrlExt = cidmeUrl + '/ext'

/* ************************************************************************** */
function validateEntityResource(resource, options) {
    if (!options) { options = [] };
    if (!options.creatorId) { options.creatorId = null }

    expect(typeof resource).toBe('object')
    expect(typeof resource['@context']).toBe('string')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('Entity')
    expect(typeof resource['@id']).toBe('string')
    expect(typeof resource['@reverse']).toBe('undefined')

    if (!options || options.createMetadata !== false) {
        expect(validateCreatedMetadata(resource.metadata[0], options)).toBe(true)
        expect(validateLastModifiedMetadata(resource.metadata[1], options)).toBe(true)
    }

    return true
};

function validateEntityContextResource(resource, options) {
    expect(typeof resource).toBe('object')
    expect(typeof resource['@context']).toBe('string')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('EntityContext')
    expect(typeof resource['@id']).toBe('string')

    if (!options || options.createMetadata !== false) {
        expect(validateCreatedMetadata(resource.metadata[0], options)).toBe(true)
        expect(validateLastModifiedMetadata(resource.metadata[1], options)).toBe(true)
    }

    return true
};

function validateEntityContextDataGroupResource(resource, options) {
    expect(typeof resource).toBe('object')
    expect(typeof resource['@context']).toBe('string')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('EntityContextDataGroup')
    expect(typeof resource['@id']).toBe('string')

    if (!options || options.createMetadata !== false) {
        expect(validateCreatedMetadata(resource.metadata[0], options)).toBe(true)
        expect(validateLastModifiedMetadata(resource.metadata[1], options)).toBe(true)
    }

    if (!options) {} else {
        if (!options.hasEntityContextDataGroupData || options.hasEntityContextDataGroupData === false) {} else {
            expect(typeof resource['data']).toBe('object')
            expect(resource['data'].length).toBeGreaterThan(0)

            for (let i = 0; i < resource['data'].length; i++) {
                expect(typeof resource['data'][i]).toBe('object')
                expect(typeof resource['data'][i]['@context']).toBe('string')
                expect(resource['data'][i]['@context'].substring(0, cidmeUrl.length)).toBe(cidmeUrl)
            }
        }
    }

    if (!options.data) {} else {
        if (
            typeof resource['data'] !== 'object' ||
            resource['data'].length < 1
        ) {
            expect(true).toBe(false)
        }
    }

    return true
};

function validateEntityContextLinkGroupResource(resource, options) {
    expect(typeof resource).toBe('object')
    expect(typeof resource['@context']).toBe('string')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('EntityContextLinkGroup')
    expect(typeof resource['@id']).toBe('string')

    if (!options || options.createMetadata !== false) {
        expect(validateCreatedMetadata(resource.metadata[0], options)).toBe(true)
        expect(validateLastModifiedMetadata(resource.metadata[1], options)).toBe(true)
    }

    if (!options) {} else {
        if (!options.hasEntityContextLinkGroupData || options.hasEntityContextLinkGroupData === false) {} else {
            expect(typeof resource['data']).toBe('object')
            expect(resource['data'].length).toBeGreaterThan(0)

            for (let i = 0; i < resource['data'].length; i++) {
                expect(typeof resource['data'][i]).toBe('object')
                expect(typeof resource['data'][i]['@context']).toBe('string')
                expect(resource['data'][i]['@context'].substring(0, cidmeUrl.length)).toBe(cidmeUrl)
            }
        }
    }

    if (!options.data) {} else {
        if (
            typeof resource['data'] !== 'object' ||
            resource['data'].length < 1
        ) {
            expect(true).toBe(false)
        }
    }

    return true
};

function validateMetadataGroupResource(resource, options) {
    if (!options) { options = [] };
    if (!options.creatorId) { options.creatorId = null }
    if (!options.data) { options.data = false }

    expect(typeof resource).toBe('object')
    expect(typeof resource['@context']).toBe('string')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('MetadataGroup')
    expect(typeof resource['@id']).toBe('string')

    if (
        typeof resource['data'] === 'object' &&
        resource['data'].length > 0
    ) {
        for (let i = 0; i < resource['data'].length; i++) {
            expect(typeof resource['data'][i]).toBe('object')
            if (
                typeof resource['data'][i]['@context'] !== 'string' &&
                typeof resource['data'][i]['@context'] !== 'object'
            ) {
                expect(true).toBe(false)
            }
        }
    }

    if (!options.data) {} else {
        if (
            typeof resource['data'] !== 'object' ||
            resource['data'].length < 1
        ) {
            expect(true).toBe(false)
        }
    }

    if (
        typeof resource['groupDataType'] === 'object' &&
        resource['groupDataType'].length > 0
    ) {
        for (let i = 0; i < resource['groupDataType'].length; i++) {
            expect(typeof resource['groupDataType'][i]).toBe('object')
            if (
                typeof resource['groupDataType'][i]['@context'] !== 'string' &&
                typeof resource['groupDataType'][i]['@context'] !== 'object'
            ) {
                expect(true).toBe(false)
            }
        }
    }

    if (!options.groupDataType) {} else {
        if (
            typeof resource['groupDataType'] !== 'object' ||
            resource['groupDataType'].length < 1
        ) {
            expect(true).toBe(false)
        }
    }

    return true
}

function validateCreatedMetadata(resource, options) {
    expect(validateMetadataGroupResource(resource, options)).toBe(true)

    expect(resource['groupDataType'][0]['@type']).toBe('CreatedMetadata')
    expect(resource['data'][0]['creator']).toBe(options.creatorId)
    expect(Date.parse(resource['data'][0]['created'])).toBeLessThanOrEqual(Date.now())
    expect(Date.parse(resource['data'][0]['created'])).toBeGreaterThanOrEqual(Date.parse('2018-01-01T00:00:00Z'))

    return true
}

function validateLastModifiedMetadata(resource, options) {
    expect(validateMetadataGroupResource(resource, options)).toBe(true)

    expect(resource['groupDataType'][0]['@type']).toBe('LastModifiedMetadata')
    expect(resource['data'][0]['creator']).toBe(options.creatorId)
    expect(Date.parse(resource['data'][0]['modified'])).toBeLessThanOrEqual(Date.now())
    expect(Date.parse(resource['data'][0]['modified'])).toBeGreaterThanOrEqual(Date.parse('2018-01-01T00:00:00Z'))

    return true
}
/* ************************************************************************** */

/* ************************************************************************** */
// Test CIDME init

test('Include CIDME JS', () => {
    let Cidme = require('../dist/cidme')

    expect(typeof(Cidme)).toBe('function')
})

test('Init CIDME JS object', () => {
    let Cidme = require('../dist/cidme')
    let cidme = new Cidme(ajv, UUID)

    expect(typeof(cidme)).toBe('object')
    expect(cidme.debug).toBe(false)
})

test('Init CIDME JS object with debug argument', () => {
    let Cidme = require('../dist/cidme')
    let cidme = new Cidme(ajv, UUID, true)

    expect(typeof(cidme)).toBe('object')
    expect(cidme.debug).toBe(true)
})

test('Init CIDME JS object - BAD: Null jsonSchemaValidator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme(null, UUID)

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Empty jsonSchemaValidator resource object', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({}, UUID)

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Blank jsonSchemaValidator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({}, UUID)

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Null uuidGenerator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme(ajv, null)

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Empty uuidGenerator resource object', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme(ajv, {})

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Blank uuidGenerator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme(ajv, '')

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Set CIDME debug option to false', () => {
        let Cidme = require('../dist/cidme')
        let cidme = new Cidme(ajv, UUID, true)
        expect(typeof(cidme)).toBe('object')
        expect(cidme.debug).toBe(true)

        cidme.debug = false

        expect(cidme.debug).toBe(false)
    })
    /* ************************************************************************** */

/* ************************************************************************** */
// Init CIDME core

let Cidme = require('../dist/cidme')
let cidme = new Cidme(ajv, UUID)
    /* ************************************************************************** */

/* ************************************************************************** */
// Test validate() with bad data

test('Validate null resource - BAD', () => {
    let resource = null

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate blank resource - BAD', () => {
    let resource = ''

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate empty resource object - BAD', () => {
        let resource = {}

        expect(cidme.validate(resource)).toBe(false)
    })
    /* ************************************************************************** */

/* ************************************************************************** */
// Test other validation functions

test('Validate datastore (local)', () => {
    let datastore = 'local'

    expect(cidme.validateDatastore(datastore, true)).toBe(true)
})

test('Validate datastore (public)', () => {
    let datastore = 'public'

    expect(cidme.validateDatastore(datastore, true)).toBe(true)
})

test('Validate datastore (UUID)', () => {
    let datastore = UUID.genV4().hexString

    expect(cidme.validateDatastore(datastore, true)).toBe(true)
})

test('Validate datastore - BAD: Bad value', () => {
        let datastore = 'xyz'

        expect(cidme.validateDatastore(datastore, true)).toBe(false)
    })
    /* ************************************************************************** */

/* ************************************************************************** */
// Test misc. functions

test('Validate getCidmeUrl', () => {
    let datastore = 'local'
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)
    let cidmeUri2 = 'cidme://' + datastore + '/' + resourceType + '/' + id

    expect(cidmeUri).toBe(cidmeUri2)
})

test('Validate getCidmeUrl - BAD: Null datastore value', () => {
    let datastore = null
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Blank datastore value', () => {
    let datastore = ''
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Bad datastore value', () => {
    let datastore = 'xyz'
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Null resourceType value', () => {
    let datastore = 'local'
    let resourceType = null
    let id = UUID.genV4().hexString

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Blank resourceType value', () => {
    let datastore = 'local'
    let resourceType = ''
    let id = UUID.genV4().hexString

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Bad resourceType value', () => {
    let datastore = 'local'
    let resourceType = 'xyz'
    let id = UUID.genV4().hexString

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Null UUID value', () => {
    let datastore = 'local'
    let resourceType = 'Entity'
    let id = null

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Blank UUID value', () => {
    let datastore = 'local'
    let resourceType = 'Entity'
    let id = ''

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate getCidmeUrl - BAD: Bad UUID value', () => {
    let datastore = 'local'
    let resourceType = 'Entity'
    let id = 'xyz'

    expect(() => {
        let cidmeUri = cidme.getCidmeUri(datastore, resourceType, id)

        /* Stop StandardJS from complaining */
        if (cidmeUri) { /* */ }
    }).toThrow()
})

test('Validate parseCidmeUrl', () => {
    let datastore = 'local'
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    let cidmeUri = 'cidme://' + datastore + '/' + resourceType + '/' + id
    let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

    expect(cidmeUri2.datastore).toBe(datastore)
    expect(cidmeUri2.resourceType).toBe(resourceType)
    expect(cidmeUri2.id).toBe(id)
})

test('Validate parseCidmeUrl - BAD: Bad URI scheme', () => {
    let datastore = 'local'
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    let cidmeUri = 'http://' + datastore + '/' + resourceType + '/' + id
    expect(() => {
        let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

        /* Stop StandardJS from complaining */
        if (cidmeUri2) { /* */ }
    }).toThrow()
})

test('Validate parseCidmeUrl - BAD: Bad datastore', () => {
    let datastore = 'xyz'
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    let cidmeUri = 'cidme://' + datastore + '/' + resourceType + '/' + id
    expect(() => {
        let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

        /* Stop StandardJS from complaining */
        if (cidmeUri2) { /* */ }
    }).toThrow()
})

test('Validate parseCidmeUrl - BAD: Bad resourceType', () => {
    let datastore = 'local'
    let resourceType = 'xyz'
    let id = UUID.genV4().hexString

    let cidmeUri = 'cidme://' + datastore + '/' + resourceType + '/' + id
    expect(() => {
        let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

        /* Stop StandardJS from complaining */
        if (cidmeUri2) { /* */ }
    }).toThrow()
})

test('Validate parseCidmeUrl - BAD: Bad ID', () => {
        let datastore = 'local'
        let resourceType = 'Entity'
        let id = 'xyz'

        let cidmeUri = 'cidme://' + datastore + '/' + resourceType + '/' + id
        expect(() => {
            let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

            /* Stop StandardJS from complaining */
            if (cidmeUri2) { /* */ }
        }).toThrow()
    })
    /* ************************************************************************** */

/* ************************************************************************** */
// Create and validate internally created resources

test('Validate internally-created basic Entity w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = cidme.createEntityResource(options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})

test('Validate internally-created basic Entity', () => {
    let options = []

    let resource = cidme.createEntityResource()

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})

test('Validate internally-created basic Entity w/creatorId', () => {
    let options = []
    options.creatorId = creatorId
    let resource = cidme.createEntityResource(options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})

test('Validate internally-created basic Entity - BAD: Invalid datastore', () => {
    expect(() => {
        cidme.createEntityResource({ 'datastore': 'xyz' })
    }).toThrow()
})

test('Validate internally-created basic EntityContext w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createEntityContextResource(resourceEntity['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContext', () => {
    let options = []

    let resourceEntity = cidme.createEntityResource()

    let resource = cidme.createEntityContextResource(resourceEntity['@id'])

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resourceEntity, options)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContext w/creatorId', () => {
    let options = []
    options.creatorId = creatorId
    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createEntityContextResource(resourceEntity['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resourceEntity, options)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContext - BAD: No parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextResource()

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContext - BAD: Blank parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextResource('')

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContext - BAD: Null parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextResource(null)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContext - BAD: Bad parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextResource('http://local/Entity/xyz')

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic MetadataGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createMetadataGroupResource(resourceEntity['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetadataGroup', () => {
    let options = []

    let resourceEntity = cidme.createEntityResource()

    let resource = cidme.createMetadataGroupResource(resourceEntity['@id'])

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetadataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId
    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createMetadataGroupResource(resourceEntity['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetadataGroup - with data', () => {
    let options = []
    options['data'] = [{
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        'cidmeUri': 'cidme://public/EntityContext/88a9724e-4b38-4cd8-80a3-70e7c0c1d1bf'
    }]

    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createMetadataGroupResource(resourceEntity['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetadataGroup - BAD: with bad data', () => {
    let options = []
    options['data'] = [{
        'x': 'y'
    }]

    let resourceEntity = cidme.createEntityResource()

    expect(() => {
        let resource = cidme.createMetadataGroupResource(resourceEntity['@id'], options)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic MetadataGroup - BAD: No parentId specified', () => {
    expect(() => {
        let resource = cidme.createMetadataGroupResource()

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic MetadataGroup - BAD: Blank parentId specified', () => {
    expect(() => {
        let resource = cidme.createMetadataGroupResource('')

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic MetadataGroup - BAD: Null parentId specified', () => {
    expect(() => {
        let resource = cidme.createMetadataGroupResource(null)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic MetadataGroup - BAD: Bad parentId specified', () => {
    expect(() => {
        let resource = cidme.createMetadataGroupResource('http://local/Entity/xyz')

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextDataGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'], options)

    let resource = cidme.createEntityContextDataGroupResource(resourceEntityContext['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextDataGroup', () => {
    let options = []

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'])

    let resource = cidme.createEntityContextDataGroupResource(resourceEntityContext['@id'])

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextDataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId
    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'], options)

    let resource = cidme.createEntityContextDataGroupResource(resourceEntityContext['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextDataGroup - with data', () => {
    let options = []
    options['data'] = [{
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        'cidmeUri': 'cidme://public/EntityContext/88a9724e-4b38-4cd8-80a3-70e7c0c1d1bf'
    }]

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'], options)

    let resource = cidme.createEntityContextDataGroupResource(resourceEntityContext['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextDataGroup - BAD: with bad data', () => {
    let options = []
    options['data'] = [{
        'x': 'y'
    }]

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'])

    expect(() => {
        let resource = cidme.createEntityContextDataGroupResource(resourceEntityContext['@id'], options)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextDataGroup - BAD: No parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextDataGroupResource()

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextDataGroup - BAD: Blank parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextDataGroupResource('')

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextDataGroup - BAD: Null parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextDataGroupResource(null)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextDataGroup - BAD: Bad parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextDataGroupResource('http://local/Entity/xyz')

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextLinkGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'], options)

    let resource = cidme.createEntityContextLinkGroupResource(resourceEntityContext['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkGroup', () => {
    let options = []

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'])

    let resource = cidme.createEntityContextLinkGroupResource(resourceEntityContext['@id'])

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'], options)

    let resource = cidme.createEntityContextLinkGroupResource(resourceEntityContext['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkGroup - with data', () => {
    let options = []
    options['data'] = [{
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        'cidmeUri': 'cidme://public/EntityContext/88a9724e-4b38-4cd8-80a3-70e7c0c1d1bf'
    }]

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'], options)

    let resource = cidme.createEntityContextLinkGroupResource(resourceEntityContext['@id'], options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkGroup - BAD: with bad data', () => {
    let options = []
    options['data'] = [{
        'x': 'y'
    }]

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource(resourceEntity['@id'])

    expect(() => {
        let resource = cidme.createEntityContextLinkGroupResource(resourceEntityContext['@id'], options)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextLinkGroup - BAD: No parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextLinkGroupResource()

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextLinkGroup - BAD: Blank parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextLinkGroupResource('')

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextlinkGroup - BAD: Null parentId specified', () => {
    expect(() => {
        let resource = cidme.createEntityContextLinkGroupResource(null)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextLinkGroup - BAD: Bad parentId specified', () => {
        expect(() => {
            let resource = cidme.createEntityContextLinkGroupResource('http://local/Entity/xyz')

            /* Stop StandardJS from complaining */
            if (resource) { /* */ }
        }).toThrow()
    })
    /* ************************************************************************** */

/* ************************************************************************** */
// Test resource adding functions

test('Test addMetadataGroupToResource to Entity resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let metadataGroupResource = cidme.createMetadataGroupResource(resource['@id'])

    resource = cidme.addMetadataGroupToResource(resource, metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[2], options)).toBe(true)
})

test('Test adding MetadataGroup to Entity via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let metadataGroupResource = cidme.createMetadataGroupResource(resource['@id'])

    resource = cidme.addResourceToParent(resource['@id'], resource, metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[2], options)).toBe(true)
})

test('Test multiple addMetadataGroupToResource\'s to Entity resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let metadataGroupResource = cidme.createMetadataGroupResource(resource['@id'])
    let metadataGroupResource2 = cidme.createMetadataGroupResource(resource['@id'])

    resource = cidme.addMetadataGroupToResource(resource, metadataGroupResource)
    resource = cidme.addMetadataGroupToResource(resource, metadataGroupResource2)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[2], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[3], options)).toBe(true)
})

test('Test addMetadataGroupToResource to EntityContext', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let metadataGroupResource = cidme.createMetadataGroupResource(entityContextResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource.entityContexts[0] = cidme.addMetadataGroupToResource(resource.entityContexts[0], metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].metadata[2], options)).toBe(true)
})

test('Test adding MetadataGroup to EntityContext via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let metadataGroupResource = cidme.createMetadataGroupResource(entityContextResource['@id'])

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(entityContextResource['@id'], resource, metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].metadata[2], options)).toBe(true)
})

test('Test addMetadataGroupToResource - BAD: null resource', () => {
    let resource = cidme.createEntityResource()

    expect(() => {
        resource = cidme.addMetadataGroupToResource(null, cidme.createMetadataGroupResource(resource['@id']))
    }).toThrow()
})

test('Test addMetadataGroupToResource - BAD: null MetadataGroup', () => {
    let resource = cidme.createEntityResource()

    expect(() => {
        resource = cidme.addMetadataGroupToResource(resource, null)
    }).toThrow()
})

test('Test addMetadataGroupToResource - BAD: Wrong resource type', () => {
    let resource = cidme.createEntityResource()
    let metadataGroupResource = cidme.createEntityContextResource(resource['@id'])

    expect(() => {
        resource = cidme.addMetadataGroupToResource(resource, metadataGroupResource)
    }).toThrow()
})

test('Test addEntityContextToResource to Entity resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Test adding EntityContext to Entity via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Test addEntityContextToResource - BAD: null resource', () => {
    let options = []

    let resource = cidme.createEntityResource()

    expect(() => {
        resource = cidme.addEntityContextToResource(null, cidme.createEntityContextResource(resource['@id']))

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextToResource - BAD: null MetadataGroup', () => {
    let options = []

    let resource = cidme.createEntityResource()

    expect(() => {
        resource = cidme.addEntityContextToResource(resource, null)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextToResource - BAD: Wrong resource type', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let metadataGroupResource = cidme.createMetadataGroupResource(resource['@id'])

    expect(() => {
        resource = cidme.addEntityContextToResource(resource, metadataGroupResource)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextLinkGroupToResource to EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextLinkGroupResource = cidme.createEntityContextLinkGroupResource(entityContextResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource.entityContexts[0] = cidme.addEntityContextLinkGroupToResource(resource.entityContexts[0], entityContextLinkGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
})

test('Test adding EntityContextLinkGroup to EntityContext via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextLinkGroupResource = cidme.createEntityContextLinkGroupResource(entityContextResource['@id'])

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource.entityContexts[0]['@id'], resource, entityContextLinkGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
})

test('Test addMetadataGroupToResource to EntityContextLinkGroup resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextLinkGroupResource = cidme.createEntityContextLinkGroupResource(entityContextResource['@id'])
    let metadataGroupResource = cidme.createMetadataGroupResource(entityContextLinkGroupResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource.entityContexts[0] = cidme.addEntityContextLinkGroupToResource(resource.entityContexts[0], entityContextLinkGroupResource)
    resource.entityContexts[0].entityContextLinks[0] = cidme.addMetadataGroupToResource(resource.entityContexts[0].entityContextLinks[0], metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextLinks[0].metadata[2], options)).toBe(true)
})

test('Test adding MetadataGroup to EntityContextLinkGroup via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextLinkGroupResource = cidme.createEntityContextLinkGroupResource(entityContextResource['@id'])
    let metadataGroupResource = cidme.createMetadataGroupResource(entityContextLinkGroupResource['@id'])

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource.entityContexts[0]['@id'], resource, entityContextLinkGroupResource)
    resource = cidme.addResourceToParent(resource.entityContexts[0].entityContextLinks[0]['@id'], resource, metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextLinks[0].metadata[1], options)).toBe(true)
})

test('Test addEntityContextLinkGroupToResource - BAD: pass EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextLinkGroupResource = cidme.createEntityContextResource(entityContextResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)

    expect(() => {
        resource.entityContexts[0] = cidme.addEntityContextLinkGroupToResource(resource.entityContexts[0], entityContextLinkGroupResource)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextLinkGroupToResource - BAD: null resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource(resource['@id']))

    expect(() => {
        resource.entityContexts[0] = cidme.addEntityContextLinkGroupToResource(null, cidme.createEntityContextLinkGroupResource(resource.entityContexts[0]['@id']))

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextLinkGroupToResource - BAD: null MetadataGroup', () => {
    let options = []

    let resource = cidme.createEntityResource()
    resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource(resource['@id']))

    expect(() => {
        resource.entityContexts[0] = cidme.addEntityContextLinkGroupToResource(resource, null)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextDataGroupToResource to EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource(entityContextResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource.entityContexts[0] = cidme.addEntityContextDataGroupToResource(resource.entityContexts[0], entityContextDataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Test adding EntityContextDataGroup to EntityContext via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource(entityContextResource['@id'])

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource.entityContexts[0]['@id'], resource, entityContextDataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Test addMetadataGroupToResource to EntityContextDataGroup resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource(entityContextResource['@id'])
    let metadataGroupResource = cidme.createMetadataGroupResource(entityContextDataGroupResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource.entityContexts[0] = cidme.addEntityContextDataGroupToResource(resource.entityContexts[0], entityContextDataGroupResource)
    resource.entityContexts[0].entityContextData[0] = cidme.addMetadataGroupToResource(resource.entityContexts[0].entityContextData[0], metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextData[0].metadata[2], options)).toBe(true)
})

test('Test adding MetadataGroup to EntityContextDataGroup via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource(entityContextResource['@id'])
    let metadataGroupResource = cidme.createMetadataGroupResource(entityContextDataGroupResource['@id'])

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource.entityContexts[0]['@id'], resource, entityContextDataGroupResource)
    resource = cidme.addResourceToParent(resource.entityContexts[0].entityContextData[0]['@id'], resource, metadataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextData[0].metadata[2], options)).toBe(true)
})

test('Test addEntityContextDataGroupToResource - BAD: pass EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextDataGroupResource = cidme.createEntityContextResource(entityContextResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)

    expect(() => {
        resource.entityContexts[0] = cidme.addEntityContextDataGroupToResource(resource.entityContexts[0], entityContextDataGroupResource)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextDataGroupToResource - BAD: pass EntityContextLinkGroup resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource(resource['@id'])
    let entityContextDataGroupResource = cidme.createEntityContextLinkGroupResource(entityContextResource['@id'])

    resource = cidme.addEntityContextToResource(resource, entityContextResource)

    expect(() => {
        resource.entityContexts[0] = cidme.addEntityContextDataGroupToResource(resource.entityContexts[0], entityContextDataGroupResource)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextDataGroupToResource - BAD: null resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource(resource['@id']))

    expect(() => {
        resource.entityContexts[0] = cidme.addEntityContextDataGroupToResource(null, cidme.createEntityContextDataGroupResource(resource.entityContexts[0]['@id']))
    }).toThrow()

    /* Stop StandardJS from complaining */
    if (options) { /* */ }
})

test('Test addEntityContextDataGroupToResource - BAD: null MetadataGroup', () => {
        let options = []

        let resource = cidme.createEntityResource()
        resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource(resource['@id']))

        expect(() => {
            resource.entityContexts[0] = cidme.addEntityContextDataGroupToResource(resource, null)

            /* Stop StandardJS from complaining */
            if (resource || options) { /* */ }
        }).toThrow()
    })
    /* ************************************************************************** */

/* ************************************************************************** */
// Validate externally-created resource

test('Validate externally-created basic Entity w/no metadata', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34'
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(true)
})

test('Validate externally-created basic Entity', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ]
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})

test('Validate externally-created basic Entity w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ]
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})

test('Validate externally-created basic Entity - BAD: with extra data', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'extra': 'Extra stuff here.'
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate externally-created basic EntityContext w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c'
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContext', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContext w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContext - BAD: with extra data', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'extra': 'Extra stuff here.'
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate externally-created Entity/EntityContext w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c'
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/b3e4a853-ae11-467b-8d77-247309bf8c8f',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/5f2d7957-c79f-4585-8532-d2c5247f6f62',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                }
            ]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext w/CreatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/b3e4a853-ae11-467b-8d77-247309bf8c8f',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/5f2d7957-c79f-4585-8532-d2c5247f6f62',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                }
            ]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextLinkGroup',
        '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827'
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextLinkGroup',
        '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextLinkGroup',
        '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup - with empty data array', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextLinkGroup',
        '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'data': []
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup - with data', () => {
    let options = []
    options.createMetadata = false
    options.hasEntityContextLinkGroupData = true

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextLinkGroup',
        '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'data': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            'cidmeUri': 'cidme://public/EntityContext/88a9724e-4b38-4cd8-80a3-70e7c0c1d1bf'
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup - with data - BAD: bad data', () => {
    let options = []
    options.createMetadata = false
    options.hasEntityContextLinkGroupData = true

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextLinkGroup',
        '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'data': [{
            'x': 'y'
        }]
    }

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate externally-created basic EntityContextLinkGroup - BAD: with extra data', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextLinkGroup',
        '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'extra': 'Extra stuff here.'
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827'
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/8350c887-c142-4e24-8317-3cb08780bfa8',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                }
            ],
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/9de1438c-c7e7-4140-9227-299646977336',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    }
                ]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup - with data', () => {
    let options = []
    options.hasEntityContextLinkGroupData = true

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/8350c887-c142-4e24-8317-3cb08780bfa8',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                }
            ],
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/9de1438c-c7e7-4140-9227-299646977336',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    }
                ],
                'data': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    'cidmeUri': 'cidme://public/EntityContext/88a9724e-4b38-4cd8-80a3-70e7c0c1d1bf'
                }]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/8350c887-c142-4e24-8317-3cb08780bfa8',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                }
            ],
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/9de1438c-c7e7-4140-9227-299646977336',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    }
                ]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
})

test('Validate externally-created basic EntityContextDataGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextDataGroup',
        '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521'
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextDataGroup', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextDataGroup',
        '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextDataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextDataGroup',
        '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ]
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextDataGroup - with data', () => {
    let options = []
    options.createMetadata = false
    options.hasEntityContextDataGroupData = true

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextDataGroup',
        '@id': 'cidme://local/EntityContextDataGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'data': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            'cidmeUri': 'cidme://public/EntityContext/88a9724e-4b38-4cd8-80a3-70e7c0c1d1bf'
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextDataGroup - with data - BAD: bad data', () => {
    let options = []
    options.createMetadata = false
    options.hasEntityContextDataGroupData = true

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextDataGroup',
        '@id': 'cidme://local/EntityContextDataGroup/08b17205-bb5c-4028-a04d-cc5542619827',
        'data': [{
            'x': 'y'
        }]
    }

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate externally-created basic EntityContextDataGroup - BAD: with extra data', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextDataGroup',
        '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
        'extra': 'Extra stuff here.'
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate externally-created basic EntityContextDataGroup - with empty data array', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'EntityContextDataGroup',
        '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
        'data': []
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextDataGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521'
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextDataGroup', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                }
            ],
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    }
                ]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextDataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                }
            ],
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    }
                ]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup/EntityContextDataGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827'
            }],
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521'
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup/EntityContextDataGroup', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': null
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': null
                    }]
                }
            ],
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/71c18cf6-4ec5-41fc-ac7c-85f78141fe51',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    }
                ]
            }],
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': null
                        }]
                    }
                ]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup/EntityContextDataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            },
            {
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
                'groupDataType': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                }],
                'data': [{
                    '@context': {
                        '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2020-02-01T09:30:00.000Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                }]
            }
        ],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'CreatedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'created': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                },
                {
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
                    'groupDataType': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'LastModifiedMetadata'
                    }],
                    'data': [{
                        '@context': {
                            '@vocab': 'http://purl.org/dc/terms/'
                        },
                        'modified': '2020-02-01T09:30:00.000Z',
                        'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                    }]
                }
            ],
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/71c18cf6-4ec5-41fc-ac7c-85f78141fe51',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    }
                ]
            }],
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
                'metadata': [{
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'CreatedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'created': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    },
                    {
                        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                        '@type': 'MetadataGroup',
                        '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                        'groupDataType': [{
                            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                            '@type': 'LastModifiedMetadata'
                        }],
                        'data': [{
                            '@context': {
                                '@vocab': 'http://purl.org/dc/terms/'
                            },
                            'modified': '2020-02-01T09:30:00.000Z',
                            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                        }]
                    }
                ]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Validate externally-created basic MetadataGroup w/no metadata', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic MetadataGroup - with empty data array', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8',
        'data': []
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic MetadataGroup - BAD: with extra data', () => {
    let options = []

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8',
        'extra': 'Extra stuff here.'
    }

    /* Stop StandardJS from complaining */
    if (options) { /* */ }

    expect(cidme.validate(resource)).toBe(false)
})

test('Validate externally-created nested MetadataGroup', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8',
        'metadata': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/86c8edcf-93d5-4c57-b3f0-c59554fe07ec'
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource, options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
})

test('Validate externally-created Entity/MetadataGroup', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/MetadataGroup', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
        }],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextData/MetadataGroup', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
        }],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
            }],
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/0b91dbb7-0814-4b4a-8347-4dad29ba1239'
                }]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].metadata[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextData[0].metadata[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLink/MetadataGroup', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
        }],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
            }],
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/0b91dbb7-0814-4b4a-8347-4dad29ba1239'
                }]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].metadata[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextLinks[0].metadata[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLink/EntityContextData/MetadataGroup', () => {
    let options = []
    options.createMetadata = false

    let resource = {
        '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
        '@type': 'Entity',
        '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
        'metadata': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
        }],
        'entityContexts': [{
            '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
            '@type': 'EntityContext',
            '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
            'metadata': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
            }],
            'entityContextLinks': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextLinkGroup',
                '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
                'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/0b91dbb7-0814-4b4a-8347-4dad29ba1239'
                }]
            }],
            'entityContextData': [{
                '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                '@type': 'EntityContextDataGroup',
                '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
                'metadata': [{
                    '@context': 'http://cidme.net/vocab/core/0.4.0/jsonldcontext.json',
                    '@type': 'MetadataGroup',
                    '@id': 'cidme://local/MetadataGroup/d9166d1d-b320-42a8-ac79-f3a732e94b7c'
                }]
            }]
        }]
    }

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
    expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].metadata[0], options)).toBe(true)
    expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextLinks[0].metadata[0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
    expect(validateMetadataGroupResource(resource.entityContexts[0].entityContextData[0].metadata[0], options)).toBe(true)
})

/* ************************************************************************** */


/* ************************************************************************** */
// Test helper functions

let testResource = { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "Entity", "@id": "cidme://local/Entity/4308edca-3788-4ab4-9d87-c5ec1c37705f", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/f96c7c3e-3970-44a4-91b0-c0c1789f34cf", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:00:17.119Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/17dfa7b0-4bdd-4e1f-9e03-4ab7f43b6259", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:00:17.122Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/44afa961-6946-4570-be4c-66b87947bb21", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LabelMetadata" }, { "@context": { "@vocab": "http://www.w3.org/2004/02/skos/core#" }, "prefLabel": "CIDME Example Resource Entity V0.3.0" }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/efa4bd4c-8103-4099-b74b-8b7a36eabef5", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:23:01.049Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/8c46a3b1-1ab3-4900-8b1b-c337b9b55991", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:23:01.050Z", "creator": null }] }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/3f9bb027-6d86-4300-8914-cbe801420e39", "data": [{ "@context": "http://cidme.net/vocab/ext/0.1.0/jsonldcontext.json", "@type": "entityTypeMetadata", "entityType": "http://cidme.net/vocab/ext/0.1.0/ThingEntityType" }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/082f8be8-f11d-469c-b2d0-85688d7702db", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:23:09.072Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/093d218d-1340-40a2-9042-c0b09fe0f962", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:23:09.072Z", "creator": null }] }] }], "entityContexts": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContext", "@id": "cidme://local/EntityContext/b278c894-58fe-478b-99c4-a119651d3417", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/dbc6bd2d-beae-4d75-9106-3b85e9ffb13d", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:00:17.123Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/a644c7de-0984-4f39-8bd6-1a78f1340314", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:00:17.124Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/9370e2cb-5984-4e01-b66d-67f1141ee521", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LabelMetadata" }, { "@context": { "@vocab": "http://www.w3.org/2004/02/skos/core#" }, "prefLabel": "CIDME Example Resource Entity EntityContext #1 (DEFAULT) V0.3.0" }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/e4117745-ffe5-4d85-83b1-57ec4bfc3f1b", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:02:04.132Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/557f52d1-fc6d-4668-9902-571ee74b9ebf", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:02:04.133Z", "creator": null }] }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/d87c12b3-c722-489e-b800-9572e44c5cd1", "data": [{ "@context": "http://cidme.net/vocab/ext/0.1.0/jsonldcontext.json", "@type": "DefaultMetadata", "default": true }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/6da1869c-0dc0-4786-84da-41b5bbb78434", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:12:42.094Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/274db826-f283-44cb-a9d0-b288fc1cb400", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:12:42.095Z", "creator": null }] }] }], "entityContextLinks": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextLinkGroup", "@id": "cidme://local/EntityContextLinkGroup/122634c3-e607-4472-acdc-e0e080919170", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/dd21e3b7-353e-4422-9d44-9a12e2961354", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-17T13:44:12.552Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/8c4f3fdd-1297-4a7e-99d2-8a660dbdeb9a", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-17T13:44:12.552Z", "creator": null }] }] }], "entityContextData": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextDataGroup", "@id": "cidme://local/EntityContextDataGroup/454a13cc-07ee-4e17-ae81-6b01fc158544", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/99d3f8c2-894c-4ffb-9a9d-1adeb512c02a", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-17T13:44:34.671Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/92d53725-7b46-4185-bbd4-e9eaab257d99", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-17T13:44:34.672Z", "creator": null }] }] }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContext", "@id": "cidme://local/EntityContext/dd506b14-b1ff-4da5-87d5-2b733eaa3e2f", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/c9e7f0cb-718c-4f61-b314-8fb8b989abbe", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:00:17.125Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/e6a08810-2194-4e8b-9502-d2e0d3d5ba6b", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:00:17.126Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/593a5efc-0505-4c7a-8230-4b83b3755494", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LabelMetadata" }, { "@context": { "@vocab": "http://www.w3.org/2004/02/skos/core#" }, "prefLabel": "CIDME Example Resource Entity EntityContext #2 V0.3.0" }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/631d3879-0a26-4b3c-bec0-e8fa268f7325", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:02:17.376Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/87dd16ad-6952-4e57-9e06-94652c2d14d4", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:02:17.376Z", "creator": null }] }] }], "entityContextLinks": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextLinkGroup", "@id": "cidme://local/EntityContextLinkGroup/6235f661-7c4a-4425-88f8-d69af0bdc0eb", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/72ec15ab-6dbf-483b-bbd8-e95d40995ec8", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-17T13:45:09.301Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/08234a49-38f2-4505-9559-abb5280dbf71", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-17T13:45:09.302Z", "creator": null }] }] }], "entityContextData": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextDataGroup", "@id": "cidme://local/EntityContextDataGroup/1976bf1c-6bbe-4238-b4e2-354108291a61", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/b16e9270-1214-42d3-91b2-c85e75ec68e1", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-17T13:45:15.929Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/939f169b-3583-46da-81d9-000c12fa91b4", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-17T13:45:15.929Z", "creator": null }] }] }], "entityContexts": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContext", "@id": "cidme://local/EntityContext/23f111f9-557b-44be-ac6c-1cad12187b56", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/317b8f37-12ab-472e-bed2-ed5c48e54d76", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:22:32.971Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/1dc3af10-b127-40d4-823a-aad6e4bc8ff8", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:22:32.972Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/f5f7202c-3e28-4d78-aee2-065d1bef7067", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LabelMetadata" }, { "@context": { "@vocab": "http://www.w3.org/2004/02/skos/core#" }, "prefLabel": "CIDME Example Resource Entity EntityContext #2-A V0.3.0" }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/cb057290-ef3d-41e4-a4d7-a72a161b54dc", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:23:26.599Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/39105a8d-c952-44d4-90b6-1b0f9111d37d", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:23:26.600Z", "creator": null }] }] }], "entityContextData": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextDataGroup", "@id": "cidme://local/EntityContextDataGroup/d404fd9e-3704-4ecc-be14-4ba31b0c8342", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/939ea1b8-74d7-4056-8689-edc664fa32c1", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:26:46.545Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/0e4e1564-cf14-46e1-9601-b96531226723", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:26:46.545Z", "creator": null }] }] }], "entityContextLinks": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextLinkGroup", "@id": "cidme://local/EntityContextLinkGroup/39f30804-8025-44ea-9b73-af2016de4798", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/38f3a632-58a1-461e-ac7b-7f6d80f2faea", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:27:00.363Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/dd2e793b-a8b3-463d-95a2-b155e4262262", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:27:00.363Z", "creator": null }] }] }] }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContext", "@id": "cidme://local/EntityContext/61b6918e-ca4e-46fc-bd4a-5aa0bd72cd65", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/811f35ac-9728-4e48-8932-1637e27e087a", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:00:17.127Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/cac1e39b-7cc9-4e02-9ddd-c77862ebc204", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:00:17.127Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/ba1c90c2-4b9d-4fec-9120-82641ad68719", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LabelMetadata" }, { "@context": { "@vocab": "http://www.w3.org/2004/02/skos/core#" }, "prefLabel": "CIDME Example Resource Entity EntityContext #3 V0.3.0" }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/89b95f5a-48a1-4b45-b574-da72696cc3a4", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-12T19:02:29.405Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/2744c833-489b-4918-b7a3-d480f885c3b6", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-12T19:02:29.406Z", "creator": null }] }] }], "entityContextLinks": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextLinkGroup", "@id": "cidme://local/EntityContextLinkGroup/cbc1ae2c-59c6-4398-af9f-7208c4f5972f", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/beb7afdc-9c61-427b-b395-12278ffe6195", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-17T13:45:39.670Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/9d3f6e9a-b60e-41a5-84d6-03799676349c", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-17T13:45:39.670Z", "creator": null }] }] }], "entityContextData": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextDataGroup", "@id": "cidme://local/EntityContextDataGroup/5aab590f-5aeb-4db0-b407-949b7cbd262b", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/04c4eeda-9634-40d2-92fb-84e09fee87a6", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-17T13:45:49.359Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/50872b88-3673-4dba-9598-d11300b39c6b", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-17T13:45:49.360Z", "creator": null }] }] }], "entityContexts": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContext", "@id": "cidme://local/EntityContext/1e7b4196-1211-4de6-96bc-c15a8899a57c", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/c9c1d1e9-e238-4baa-8297-3dc18de66be0", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:28:30.454Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/7017fc45-6a7f-4629-ad05-e85211f902ab", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:28:30.455Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/977fec9a-e643-44d3-9533-02eb1057e6e7", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LabelMetadata" }, { "@context": { "@vocab": "http://www.w3.org/2004/02/skos/core#" }, "prefLabel": "CIDME Example Resource Entity EntityContext #3-A V0.3.0" }], "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/6832638b-7fe6-4cc1-9567-08c619cc6a43", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:29:09.687Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/013c74ed-ad06-4f61-9251-fc996e21c907", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:29:09.688Z", "creator": null }] }] }], "entityContextData": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextDataGroup", "@id": "cidme://local/EntityContextDataGroup/815b3bd3-f96c-46cd-a2ee-271abb5a1994", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/6e942a09-632c-4b12-aa0b-d72d6b835daa", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:29:41.750Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/6e89bc60-0cc8-4655-850f-5c4576c12fb3", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:29:41.750Z", "creator": null }] }] }], "entityContextLinks": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "EntityContextLinkGroup", "@id": "cidme://local/EntityContextLinkGroup/76f124bd-9a79-4a51-ae5c-b5d1fc651fc0", "metadata": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/d49b236c-023f-4265-86a2-fe9bb3dc043f", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "CreatedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "created": "2020-01-19T18:30:01.345Z", "creator": null }] }, { "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "MetadataGroup", "@id": "cidme://local/MetadataGroup/f452a384-e7bb-4239-9bc8-536bf8c5a75a", "data": [{ "@context": "http://cidme.net/vocab/core/0.4.0/jsonldcontext.json", "@type": "LastModifiedMetadata" }, { "@context": { "@vocab": "http://purl.org/dc/terms/" }, "modified": "2020-01-19T18:30:01.346Z", "creator": null }] }] }] }] }] }


test('Test getResourceById - Invalid resource ID', () => {
    expect(cidme.getResourceById('cidme://local/Entity/abccb1fd-fdf4-4384-b464-37221fea2199', testResource)).toBe(false)
})

test('Test getResourceById - Invalid resource ID 2', () => {
    expect(() => {
        let returnVal = cidme.getResourceById('Test1234', testResource)
    }).toThrow()
})

test('Test getResourceById', () => {
    expect(cidme.getResourceById(testResource['@id'], testResource)).toBe(testResource)
})

test('Test getResourceById - Entity Metadata', () => {
    expect(cidme.getResourceById(testResource['metadata'][0]['@id'], testResource)).toBe(testResource['metadata'][0])
})

test('Test getResourceById - Entity Context', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][0]['@id'], testResource)).toBe(testResource['entityContexts'][0])
})

test('Test getResourceById - Entity Context Metadata', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][0]['metadata'][0]['@id'], testResource)).toBe(testResource['entityContexts'][0]['metadata'][0])
})

test('Test getResourceById - Entity Context EntityContextData', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][0]['entityContextData'][0]['@id'], testResource)).toBe(testResource['entityContexts'][0]['entityContextData'][0])
})

test('Test getResourceById - Entity Context EntityContextData Metadata', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][0]['entityContextData'][0]['metadata'][0]['@id'], testResource)).toBe(testResource['entityContexts'][0]['entityContextData'][0]['metadata'][0])
})

test('Test getResourceById - Entity Context EntityContextLinks', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][0]['entityContextLinks'][0]['@id'], testResource)).toBe(testResource['entityContexts'][0]['entityContextLinks'][0])
})

test('Test getResourceById - Entity Context EntityContextLinks Metadata', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][0]['entityContextLinks'][0]['metadata'][0]['@id'], testResource)).toBe(testResource['entityContexts'][0]['entityContextLinks'][0]['metadata'][0])
})

test('Test getResourceById - EntityContext EntityContext', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][1]['entityContexts'][0]['@id'], testResource)).toBe(testResource['entityContexts'][1]['entityContexts'][0])
})

test('Test getResourceById - EntityContext EntityContext Metadata', () => {
    expect(cidme.getResourceById(testResource['entityContexts'][1]['entityContexts'][0]['metadata'][0]['@id'], testResource)).toBe(testResource['entityContexts'][1]['entityContexts'][0]['metadata'][0])
})

test('Test getResourceByIdWithBreadcrumbs - Entity', () => {
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(1)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - Entity Metadata', () => {
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['metadata'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['metadata'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(2)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['metadata'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['metadata'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext', () => {
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['entityContexts'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['entityContexts'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(2)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['entityContexts'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext Metadata', () => {
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['entityContexts'][0]['metadata'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['entityContexts'][0]['metadata'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(3)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['entityContexts'][0]['@id'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceType']).toBe(testResource['entityContexts'][0]['metadata'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceId']).toBe(testResource['entityContexts'][0]['metadata'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext EntityContext', () => {
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['entityContexts'][1]['entityContexts'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['entityContexts'][1]['entityContexts'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(3)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['entityContexts'][1]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['entityContexts'][1]['@id'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceType']).toBe(testResource['entityContexts'][1]['entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceId']).toBe(testResource['entityContexts'][1]['entityContexts'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext EntityContext Metadata', () => {
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['entityContexts'][1]['entityContexts'][0]['metadata'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['entityContexts'][1]['entityContexts'][0]['metadata'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(4)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['entityContexts'][1]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['entityContexts'][1]['@id'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceType']).toBe(testResource['entityContexts'][1]['entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceId']).toBe(testResource['entityContexts'][1]['entityContexts'][0]['@id'])
    expect(x['cidmeBreadcrumbs'][3]['cidmeResourceType']).toBe(testResource['entityContexts'][1]['entityContexts'][0]['metadata'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][3]['cidmeResourceId']).toBe(testResource['entityContexts'][1]['entityContexts'][0]['metadata'][0]['@id'])
})

/* ************************************************************************** */