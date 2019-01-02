/**
 * @file Jest JS unit tests for CIDME core.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2019
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

/* ************************************************************************** */
function validateEntityResource (resource, options) {
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

function validateEntityContextResource (resource, options) {
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

function validateEntityContextDataGroupResource (resource, options) {
  expect(typeof resource).toBe('object')
  expect(typeof resource['@context']).toBe('string')
  expect(typeof resource['@type']).toBe('string')
  expect(resource['@type']).toBe('EntityContextDataGroup')
  expect(typeof resource['@id']).toBe('string')

  if (!options || options.createMetadata !== false) {
    expect(validateCreatedMetadata(resource.metadata[0], options)).toBe(true)
    expect(validateLastModifiedMetadata(resource.metadata[1], options)).toBe(true)
  }

  return true
};

function validateEntityContextLinkGroupResource (resource, options) {
  expect(typeof resource).toBe('object')
  expect(typeof resource['@context']).toBe('string')
  expect(typeof resource['@type']).toBe('string')
  expect(resource['@type']).toBe('EntityContextLinkGroup')
  expect(typeof resource['@id']).toBe('string')

  if (!options || options.createMetadata !== false) {
    expect(validateCreatedMetadata(resource.metadata[0], options)).toBe(true)
    expect(validateLastModifiedMetadata(resource.metadata[1], options)).toBe(true)
  }

  return true
};

function validateMetadataGroupResource (resource, options) {
  if (!options) { options = [] };
  if (!options.creatorId) { options.creatorId = null }

  expect(typeof resource).toBe('object')
  expect(typeof resource['@context']).toBe('string')
  expect(typeof resource['@type']).toBe('string')
  expect(resource['@type']).toBe('MetadataGroup')
  expect(typeof resource['@id']).toBe('string')

  return true
}

function validateCreatedMetadata (resource, options) {
  expect(validateMetadataGroupResource(resource, options)).toBe(true)

  expect(resource['data'][0]['@type']).toBe('CreatedMetadata')
  expect(resource['data'][1]['creator']).toBe(options.creatorId)
  expect(Date.parse(resource['data'][1]['created'])).toBeLessThanOrEqual(Date.now())
  expect(Date.parse(resource['data'][1]['created'])).toBeGreaterThanOrEqual(Date.parse('2018-01-01T00:00:00Z'))

  return true
}

function validateLastModifiedMetadata (resource, options) {
  expect(validateMetadataGroupResource(resource, options)).toBe(true)

  expect(resource['data'][0]['@type']).toBe('LastModifiedMetadata')
  expect(resource['data'][1]['creator']).toBe(options.creatorId)
  expect(Date.parse(resource['data'][1]['modified'])).toBeLessThanOrEqual(Date.now())
  expect(Date.parse(resource['data'][1]['modified'])).toBeGreaterThanOrEqual(Date.parse('2018-01-01T00:00:00Z'))

  return true
}
/* ************************************************************************** */

/* ************************************************************************** */
// Test CIDME init

test('Include CIDME JS', () => {
  let Cidme = require('../dist/cidme')

  expect(typeof (Cidme)).toBe('function')
})

test('Init CIDME JS object', () => {
  let Cidme = require('../dist/cidme')
  let cidme = new Cidme(ajv, UUID)

  expect(typeof (cidme)).toBe('object')
})

test('Init CIDME JS object with debug argument', () => {
  let Cidme = require('../dist/cidme')
  let cidme = new Cidme(ajv, UUID, true)

  expect(typeof (cidme)).toBe('object')
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
  expect(typeof (cidme)).toBe('object')

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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'EntityContext',
    '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c'
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContext', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'EntityContext',
    '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'EntityContext',
    '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContext - BAD: with extra data', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c'
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityResource(resource, options)).toBe(true)
  expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/b3e4a853-ae11-467b-8d77-247309bf8c8f',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/5f2d7957-c79f-4585-8532-d2c5247f6f62',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          }
        ]
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityResource(resource, options)).toBe(true)
  expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext w/CreatorId', () => {
  let options = []
  options.creatorId = creatorId

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/b3e4a853-ae11-467b-8d77-247309bf8c8f',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/5f2d7957-c79f-4585-8532-d2c5247f6f62',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          }
        ]
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityResource(resource, options)).toBe(true)
  expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup w/no metadata', () => {
  let options = []
  options.createMetadata = false

  let resource = {
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'EntityContextLinkGroup',
    '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827'
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'EntityContextLinkGroup',
    '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'EntityContextLinkGroup',
    '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'EntityContextLinkGroup',
    '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
    'data': []
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityContextLinkGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextLinkGroup - BAD: with extra data', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827'
          }
        ]
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityResource(resource, options)).toBe(true)
  expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
  expect(validateEntityContextLinkGroupResource(resource.entityContexts[0].entityContextLinks[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextLinkGroup', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/8350c887-c142-4e24-8317-3cb08780bfa8',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          }
        ],
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/9de1438c-c7e7-4140-9227-299646977336',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/8350c887-c142-4e24-8317-3cb08780bfa8',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          }
        ],
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/9de1438c-c7e7-4140-9227-299646977336',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'EntityContextDataGroup',
    '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521'
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextDataGroup', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'EntityContextDataGroup',
    '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'EntityContextDataGroup',
    '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      }
    ]
  }

  /* Stop StandardJS from complaining */
  if (options) { /* */ }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate externally-created basic EntityContextDataGroup - BAD: with extra data', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521'
          }
        ]
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateEntityResource(resource, options)).toBe(true)
  expect(validateEntityContextResource(resource.entityContexts[0], options)).toBe(true)
  expect(validateEntityContextDataGroupResource(resource.entityContexts[0].entityContextData[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/EntityContextDataGroup', () => {
  let options = []

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          }
        ],
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          }
        ],
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827'
          }
        ],
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521'
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': null
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': null
              }
            ]
          }
        ],
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/71c18cf6-4ec5-41fc-ac7c-85f78141fe51',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              }
            ]
          }
        ],
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'CreatedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'created': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      },
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/20ea2712-5f0e-4c96-bfc1-7dbc9eaa91ef',
        'data': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'LastModifiedMetadata'
          },
          {
            '@context': {
              '@vocab': 'http://purl.org/dc/terms/'
            },
            'modified': '2018-11-27T18:19:58.996Z',
            'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
          }
        ]
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/65809583-e337-44ba-ae71-aaeb6057019e',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'CreatedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          },
          {
            '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/842c7a9d-d26f-4ee2-8b73-db191ff9395a',
            'data': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'LastModifiedMetadata'
              },
              {
                '@context': {
                  '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': '2018-11-27T18:19:58.996Z',
                'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
              }
            ]
          }
        ],
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/71c18cf6-4ec5-41fc-ac7c-85f78141fe51',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              }
            ]
          }
        ],
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/75d033d2-e951-46cb-816b-d1147a9c45bb',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'CreatedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'created': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              },
              {
                '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/1f5676ae-00a6-4bf5-a27e-dfd40b0fefda',
                'data': [
                  {
                    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
                    '@type': 'LastModifiedMetadata'
                  },
                  {
                    '@context': {
                      '@vocab': 'http://purl.org/dc/terms/'
                    },
                    'modified': '2018-11-27T18:19:58.996Z',
                    'creator': 'cidme://public/EntityContext/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
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
    '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
    '@type': 'MetadataGroup',
    '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/86c8edcf-93d5-4c57-b3f0-c59554fe07ec'
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateMetadataGroupResource(resource, options)).toBe(true)
  expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
})

test('Validate externally-created Entity/MetadataGroup', () => {
  let options = []
  options.createMetadata = false

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
      }
    ]
  }

  expect(cidme.validate(resource)).toBe(true)
  expect(validateMetadataGroupResource(resource.metadata[0], options)).toBe(true)
})

test('Validate externally-created Entity/EntityContext/MetadataGroup', () => {
  let options = []
  options.createMetadata = false

  let resource = {
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
          }
        ],
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/08b17205-bb5c-4028-a04d-cc5542619827',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/0b91dbb7-0814-4b4a-8347-4dad29ba1239'
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
          }
        ],
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/0b91dbb7-0814-4b4a-8347-4dad29ba1239'
              }
            ]
          }
        ]
      }
    ]
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
    '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
    '@type': 'Entity',
    '@id': 'cidme://local/Entity/38266203-4194-4136-a59a-50fcc7c4da34',
    'metadata': [
      {
        '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
        '@type': 'MetadataGroup',
        '@id': 'cidme://local/MetadataGroup/3dfdc2e5-e1bd-4840-b618-c4146125ace8'
      }
    ],
    'entityContexts': [
      {
        '@context': 'http://cidme.net/vocab/core/0.3.0/jsonldcontext.json',
        '@type': 'EntityContext',
        '@id': 'cidme://local/EntityContext/47a0f527-0482-498b-80ba-357021381f6c',
        'metadata': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'MetadataGroup',
            '@id': 'cidme://local/MetadataGroup/2a1f4a85-6219-45dd-aaba-515b163ca3ce'
          }
        ],
        'entityContextLinks': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextLinkGroup',
            '@id': 'cidme://local/EntityContextLinkGroup/08b17205-bb5c-4028-a04d-cc5542619827',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/0b91dbb7-0814-4b4a-8347-4dad29ba1239'
              }
            ]
          }
        ],
        'entityContextData': [
          {
            '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
            '@type': 'EntityContextDataGroup',
            '@id': 'cidme://local/EntityContextDataGroup/bac33cc9-c09e-43b3-8d63-f283047c7521',
            'metadata': [
              {
                '@context': 'http://cidme.net/vocab/0.1.0/jsonldcontext.json',
                '@type': 'MetadataGroup',
                '@id': 'cidme://local/MetadataGroup/d9166d1d-b320-42a8-ac79-f3a732e94b7c'
              }
            ]
          }
        ]
      }
    ]
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
