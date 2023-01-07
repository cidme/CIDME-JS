/**
 * @file Jest JS unit tests for CIDME core.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2023
 * @license MIT
 */

'use strict'

// These are for Jest, but throw errors in StandardJS
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


let creatorId = 'cidme://Entity/db9b4bdb-50b7-483d-95a6-b3884ecd4137'
let cidmeUrl = 'http://cidme.net/vocab/'
let cidmeUrlCore = cidmeUrl + 'core/0.6.0/'
let cidmeUrlExt = cidmeUrl + 'ext/0.1.0/'
let rdfUrl = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
let skosUrl = 'http://www.w3.org/2004/02/skos/core#'

/* ************************************************************************** */


function createCidmeExampleResourceEntity() {
    let options = []

    /* ---------- */
    // Entity
    let resource = cidme.createEntityResource()

    // Entity MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('CIDME Example Resource Entity V0.6.0')
    let resourceEntityMetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['@id'], resource, resourceEntityMetaData1, 'cidme:metaDataGroups')

    // Entity MetaData #2
    options = []
    options['createMetaData'] = false
    options['data'] = createThingEntityTypeMetaData()
    let resourceEntityMetaData2 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['@id'], resource, resourceEntityMetaData2, 'cidme:metaDataGroups')

    /* ---------- */

    // Entity Context #1 (default)
    let resourceEntityContext1 = cidme.createEntityContextResource()
    resource = cidme.addResourceToParent(resource['@id'], resource, resourceEntityContext1)

    // Entity Context #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1 (Default)')
    let resourceEntityContext1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1MetaData1, 'cidme:metaDataGroups')

    // Entity Context #1 MetaData #2
    options = []
    options['createMetaData'] = false
    options['data'] = createDefaultMetaData()
    let resourceEntityContext1MetaData2 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1MetaData2, 'cidme:metaDataGroups')

    // Entity Context #1 Entity Context Data #1
    options = []
    options['data'] = createLabelEntityContextData('Entity Context #1 Entity Context Data #1')
    let resourceEntityContext1EntityContextData1 = cidme.createEntityContextDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1EntityContextData1, 'cidme:entityContextDataGroups')

    // Entity Context #1 Entity Context Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1 Entity Context Data #1')
    let resourceEntityContext1EntityContextData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['@id'], resource, resourceEntityContext1EntityContextData1MetaData1, 'cidme:metaDataGroups')

    // Entity Context #1 Entity Context Data #2
    options = []
    options['data'] = createLabelEntityContextData('Entity Context #1 Entity Context Data #2')
    let resourceEntityContext1EntityContextData2 = cidme.createEntityContextDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1EntityContextData2, 'cidme:entityContextDataGroups')

    // Entity Context #1 Entity Context Data #2 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1 Entity Context Data #1')
    let resourceEntityContext1EntityContextData2MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][1]['@id'], resource, resourceEntityContext1EntityContextData2MetaData1, 'cidme:metaDataGroups')

    // Entity Context #1 Entity Context Link Data #1
    options = []
    options['data'] = createLabelEntityContextLinkData('Entity Context #1 Entity Context Link Data #1')
    let resourceEntityContext1EntityContextLinkData1 = cidme.createEntityContextLinkDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1EntityContextLinkData1, 'cidme:entityContextLinkDataGroups')

    // Entity Context #1 Entity Context Link Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1 Entity Context Link Data #1')
    let resourceEntityContext1EntityContextLinkData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['@id'], resource, resourceEntityContext1EntityContextLinkData1MetaData1, 'cidme:metaDataGroups')

    // Entity Context #1 Entity Context Link Data #2
    options = []
    options['data'] = createLabelEntityContextLinkData('Entity Context #1 Entity Context Data #2')
    let resourceEntityContext1EntityContextLinkData2 = cidme.createEntityContextLinkDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1EntityContextLinkData2, 'cidme:entityContextLinkDataGroups')

    // Entity Context #1 Entity Context Link Data #2 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1 Entity Context Link Data #2')
    let resourceEntityContext1EntityContextLinkData2MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][1]['@id'], resource, resourceEntityContext1EntityContextLinkData2MetaData1, 'cidme:metaDataGroups')

    /* ---------- */


    // Entity Context #1a
    let resourceEntityContext1a = cidme.createEntityContextResource()
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1a)

    // Entity Context #1a MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1a')
    let resourceEntityContext1aMetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1aMetaData1, 'cidme:metaDataGroups')

    // Entity Context #1a Entity Context Data #1
    options = []
    options['data'] = createLabelEntityContextData('Entity Context #1a Entity Context Data #1')
    let resourceEntityContext1aEntityContextData1 = cidme.createEntityContextDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1aEntityContextData1, 'cidme:entityContextDataGroups')

    // Entity Context #1a Entity Context Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1a Entity Context Data #1')
    let resourceEntityContext1aEntityContextData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['@id'], resource, resourceEntityContext1aEntityContextData1MetaData1, 'cidme:metaDataGroups')

    // Entity Context #1a Entity Context Data #2
    options = []
    options['data'] = createLabelEntityContextData('Entity Context #1a Entity Context Data #2')
    let resourceEntityContext1aEntityContextData2 = cidme.createEntityContextDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1aEntityContextData2, 'cidme:entityContextDataGroups')

    // Entity Context #1a Entity Context Data #2 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1a Entity Context Data #2')
    let resourceEntityContext1aEntityContextData2MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][1]['@id'], resource, resourceEntityContext1aEntityContextData2MetaData1, 'cidme:metaDataGroups')


    // Entity Context #1a Entity Context Link Data #1
    options = []
    options['data'] = createLabelEntityContextLinkData('Entity Context #1a Entity Context Link Data #1')
    let resourceEntityContext1aEntityContextLinkData1 = cidme.createEntityContextLinkDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1aEntityContextLinkData1, 'cidme:entityContextLinkDataGroups')

    // Entity Context #1a Entity Context Link Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1a Entity Context Link Data #1')
    let resourceEntityContext1aEntityContextLinkData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['@id'], resource, resourceEntityContext1aEntityContextLinkData1MetaData1, 'cidme:metaDataGroups')


    // Entity Context #1a Entity Context Link Data #2
    options = []
    options['data'] = createLabelEntityContextLinkData('Entity Context #1a Entity Context Link Data #2')
    let resourceEntityContext1aEntityContextLinkData2 = cidme.createEntityContextLinkDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1aEntityContextLinkData2, 'cidme:entityContextLinkDataGroups')

    // Entity Context #1a Entity Context Link Data #2 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1a Entity Context Link Data #2')
    let resourceEntityContext1aEntityContextLinkData2MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][1]['@id'], resource, resourceEntityContext1aEntityContextLinkData2MetaData1, 'cidme:metaDataGroups')


    /* ---------- */

    // Entity Context #1b
    let resourceEntityContext1b = cidme.createEntityContextResource()
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, resourceEntityContext1b)

    // Entity Context #1b MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1b')
    let resourceEntityContext1bMetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][1]['@id'], resource, resourceEntityContext1bMetaData1, 'cidme:metaDataGroups')

    // Entity Context #1b Entity Context Data #1
    options = []
    options['data'] = createLabelEntityContextData('Entity Context #1b Entity Context Data #1')
    let resourceEntityContext1bEntityContextData1 = cidme.createEntityContextDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][1]['@id'], resource, resourceEntityContext1bEntityContextData1, 'cidme:entityContextDataGroups')

    // Entity Context #1b Entity Context Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1b Entity Context Data #1')
    let resourceEntityContext1bEntityContextData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][1]['cidme:entityContextDataGroups'][0]['@id'], resource, resourceEntityContext1bEntityContextData1MetaData1, 'cidme:metaDataGroups')

    // Entity Context #1b Entity Context Link Data #1
    options = []
    options['data'] = createLabelEntityContextLinkData('Entity Context #1b Entity Context Data #1')
    let resourceEntityContext1bEntityContextLinkData1 = cidme.createEntityContextLinkDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][1]['@id'], resource, resourceEntityContext1bEntityContextLinkData1, 'cidme:entityContextLinkDataGroups')

    // Entity Context #1b Entity Context Link Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #1b Entity Context Link Data #1')
    let resourceEntityContext1bEntityContextLinkData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContexts'][1]['cidme:entityContextLinkDataGroups'][0]['@id'], resource, resourceEntityContext1bEntityContextLinkData1MetaData1, 'cidme:metaDataGroups')

    /* ---------- */

    // Entity Context #2
    let resourceEntityContext2 = cidme.createEntityContextResource()
    resource = cidme.addResourceToParent(resource['@id'], resource, resourceEntityContext2)

    // Entity Context #2 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #2')
    let resourceEntityContext2MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][1]['@id'], resource, resourceEntityContext2MetaData1, 'cidme:metaDataGroups')

    // Entity Context #2 Entity Context Data #1
    let resourceEntityContext2EntityContextData1 = cidme.createEntityContextDataGroupResource()
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][1]['@id'], resource, resourceEntityContext2EntityContextData1, 'cidme:entityContextDataGroups')

    // Entity Context #2 Entity Context Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #2 Entity Context Data #1')
    let resourceEntityContext2EntityContextData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][1]['cidme:entityContextDataGroups'][0]['@id'], resource, resourceEntityContext2EntityContextData1MetaData1, 'cidme:metaDataGroups')

    // Entity Context #2 Entity Context Link Data #1
    let resourceEntityContext2EntityContextLinkData1 = cidme.createEntityContextLinkDataGroupResource()
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][1]['@id'], resource, resourceEntityContext2EntityContextLinkData1, 'cidme:entityContextLinkDataGroups')

    // Entity Context #2 Entity Context Link Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #2 Entity Context Link Data #1')
    let resourceEntityContext2EntityContextLinkData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][1]['cidme:entityContextLinkDataGroups'][0]['@id'], resource, resourceEntityContext2EntityContextLinkData1MetaData1, 'cidme:metaDataGroups')


    /* ---------- */

    // Entity Context #3
    let resourceEntityContext3 = cidme.createEntityContextResource()
    resource = cidme.addResourceToParent(resource['@id'], resource, resourceEntityContext3)

    // Entity Context #3 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #3')
    let resourceEntityContext3MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][2]['@id'], resource, resourceEntityContext3MetaData1, 'cidme:metaDataGroups')

    // Entity Context #3 Entity Context Data #1
    let resourceEntityContext3EntityContextData1 = cidme.createEntityContextDataGroupResource()
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][2]['@id'], resource, resourceEntityContext3EntityContextData1, 'cidme:entityContextDataGroups')

    // Entity Context #3 Entity Context Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #3 Entity Context Data #1')
    let resourceEntityContext3EntityContextData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][2]['cidme:entityContextDataGroups'][0]['@id'], resource, resourceEntityContext3EntityContextData1MetaData1, 'cidme:metaDataGroups')

    // Entity Context #3 Entity Context Link Data #1
    let resourceEntityContext3EntityContextLinkData1 = cidme.createEntityContextLinkDataGroupResource()
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][2]['@id'], resource, resourceEntityContext3EntityContextLinkData1, 'cidme:entityContextLinkDataGroups')

    // Entity Context #3 Entity Context Link Data #1 MetaData #1
    options = []
    options['createMetaData'] = false
    options['data'] = createLabelMetaData('Entity Context #3 Entity Context Link Data #1')
    let resourceEntityContext3EntityContextLinkData1MetaData1 = cidme.createMetaDataGroupResource(options)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][2]['cidme:entityContextLinkDataGroups'][0]['@id'], resource, resourceEntityContext3EntityContextLinkData1MetaData1, 'cidme:metaDataGroups')

    /* ---------- */

    //console.log(JSON.stringify(resource))

    return resource
}

function validateEntityResource(resource, options) {
    if (!options) { options = [] };
    if (!options.creatorId) { options.creatorId = null }

    expect(typeof resource).toBe('object')
    expect(typeof resource['@context']).toBe('object')
    expect(resource['@context']['cidme'].substring(0, cidmeUrlCore.length)).toBe(cidmeUrlCore)
    expect(resource['@context']['cidme'].substring(resource['@context']['cidme'].length - 1)).toBe('/')
    expect(resource['@context']['rdf']).toBe(rdfUrl)
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('cidme:Entity')
    expect(typeof resource['@id']).toBe('string')

    if (!options || options.createMetaData !== false) {
        expect(validateCreatedMetaData(resource['cidme:metaDataGroups'][0], options)).toBe(true)
        expect(validateLastModifiedMetaData(resource['cidme:metaDataGroups'][1], options)).toBe(true)
    }

    return true
};

function validateEntityContextResource(resource, options) {
    expect(typeof resource).toBe('object')
    expect(typeof resource['@context']).toBe('object')
    expect(resource['@context']['cidme'].substring(0, cidmeUrlCore.length)).toBe(cidmeUrlCore)
    expect(resource['@context']['cidme'].substring(resource['@context']['cidme'].length - 1)).toBe('/')
    expect(resource['@context']['rdf']).toBe(rdfUrl)
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('cidme:EntityContext')
    expect(typeof resource['@id']).toBe('string')

    if (!options || options.createMetaData !== false) {
        expect(validateCreatedMetaData(resource['cidme:metaDataGroups'][0], options)).toBe(true)
        expect(validateLastModifiedMetaData(resource['cidme:metaDataGroups'][1], options)).toBe(true)
    }

    return true
};

function validateEntityContextDataGroupResource(resource, options) {
    expect(typeof resource).toBe('object')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('cidme:EntityContextDataGroup')
    expect(typeof resource['@id']).toBe('string')

    if (!options || options.createMetaData !== false) {
        expect(validateCreatedMetaData(resource['cidme:metaDataGroups'][0], options)).toBe(true)
        expect(validateLastModifiedMetaData(resource['cidme:metaDataGroups'][1], options)).toBe(true)
    }

    // If we were given data then make sure the number of data elements in our resource is no less than the number of elements in the data we were given.
    if (!options.data) {} else {
        if (
            typeof resource['cidme:data'] !== 'object' ||
            resource['cidme:data'].length < options['data'].length
        ) {
            expect(true).toBe(false)
        }
        //console.log(options['data'].length)
    }

    // If our resource has data, validate each item.
    if (
        typeof resource['cidme:data'] === 'object' &&
        resource['cidme:data'].length > 0
    ) {
        let dataFoundCnt = 0

        for (let i = 0; i < resource['cidme:data'].length; i++) {
            expect(typeof resource['cidme:data'][i]).toBe('object')
            expect(validateRdfDataResource(resource['cidme:data'][i], options)).toBe(true)
            expect(resource['cidme:data'][i]['@type'].indexOf('cidme:EntityContextData')).toBeGreaterThanOrEqual(0)

            if (!options.data) {} else {
                for (let dataCnt = 0; dataCnt < options['data'].length; dataCnt++) {
                    if (resource['cidme:data'][i] === options['data'][dataCnt]) { dataFoundCnt++ }
                }
            }
        }

        // If we were given data, ensure we found it all in the resource.
        if (!options.data) {} else {
            expect(dataFoundCnt).toBe(options['data'].length)
        }
    }


    return true
};

function validateEntityContextLinkDataGroupResource(resource, options) {
    expect(typeof resource).toBe('object')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('cidme:EntityContextLinkDataGroup')
    expect(typeof resource['@id']).toBe('string')

    if (!options || options.createMetaData !== false) {
        expect(validateCreatedMetaData(resource['cidme:metaDataGroups'][0], options)).toBe(true)
        expect(validateLastModifiedMetaData(resource['cidme:metaDataGroups'][1], options)).toBe(true)
    }

    // If we were given data then make sure the number of data elements in our resource is no less than the number of elements in the data we were given.
    if (!options.data) {} else {
        if (
            typeof resource['cidme:data'] !== 'object' ||
            resource['cidme:data'].length < options['data'].length
        ) {
            expect(true).toBe(false)
        }
        //console.log(options['data'].length)
    }

    // If our resource has data, validate each item.
    if (
        typeof resource['cidme:data'] === 'object' &&
        resource['cidme:data'].length > 0
    ) {
        let dataFoundCnt = 0

        for (let i = 0; i < resource['cidme:data'].length; i++) {
            expect(typeof resource['cidme:data'][i]).toBe('object')
            expect(validateRdfDataResource(resource['cidme:data'][i], options)).toBe(true)
            expect(resource['cidme:data'][i]['@type'].indexOf('cidme:EntityContextLinkData')).toBeGreaterThanOrEqual(0)

            if (!options.data) {} else {
                for (let dataCnt = 0; dataCnt < options['data'].length; dataCnt++) {
                    if (resource['cidme:data'][i] === options['data'][dataCnt]) { dataFoundCnt++ }
                }
            }
        }

        // If we were given data, ensure we found it all in the resource.
        if (!options.data) {} else {
            expect(dataFoundCnt).toBe(options['data'].length)
        }
    }

    return true
};

function validateMetaDataGroupResource(resource, options) {
    if (!options) { options = [] };
    if (!options.creatorId) { options.creatorId = null }
    if (!options.data) { options.data = false }

    expect(typeof resource).toBe('object')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('cidme:MetaDataGroup')
    expect(typeof resource['@id']).toBe('string')

    // If we were given data then make sure the number of data elements in our resource is no less than the number of elements in the data we were given.
    if (!options.data) {} else {
        if (
            typeof resource['cidme:data'] !== 'object' ||
            resource['cidme:data'].length < options['data'].length
        ) {
            expect(true).toBe(false)
        }
        //console.log(options['data'].length)
    }

    // If our resource has data, validate each item.
    if (
        typeof resource['cidme:data'] === 'object' &&
        resource['cidme:data'].length > 0
    ) {
        let dataFoundCnt = 0

        for (let i = 0; i < resource['cidme:data'].length; i++) {
            expect(typeof resource['cidme:data'][i]).toBe('object')
            expect(validateRdfDataResource(resource['cidme:data'][i], options)).toBe(true)
            expect(resource['cidme:data'][i]['@type'].indexOf('cidme:MetaData')).toBeGreaterThanOrEqual(0)

            if (!options.data) {} else {
                for (let dataCnt = 0; dataCnt < options['data'].length; dataCnt++) {
                    if (resource['cidme:data'][i] === options['data'][dataCnt]) { dataFoundCnt++ }
                }
            }
        }

        // If we were given data, ensure we found it all in the resource.
        if (!options.data) {} else {
            expect(dataFoundCnt).toBe(options['data'].length)
        }
    }

    /*
    if (!options || !options.createMetaData || options.createMetaData !== false) {
        expect(validateCreatedMetaData(resource['cidme:metaDataGroups'][0], options)).toBe(true)
        expect(validateLastModifiedMetaData(resource['cidme:metaDataGroups'][1], options)).toBe(true)
    }
     */

    return true
}

function validateRdfDataResource(resource, options) {
    if (!options) { options = [] };

    expect(typeof resource).toBe('object')

    expect(typeof resource['@type']).toBe('object')
    expect(resource['@type'].indexOf('rdf:statement')).toBeGreaterThanOrEqual(0)
    expect(resource['@type'].indexOf('cidme:RdfData')).toBeGreaterThanOrEqual(0)

    expect(typeof resource['@id']).toBe('string')

    expect(typeof resource['rdf:predicate']).toBe('object')
    expect(typeof resource['rdf:predicate']['@context']).toBe('object')
    expect(Object.keys(resource['rdf:predicate']['@context']).length).toBeGreaterThan(0)
    expect(typeof resource['rdf:predicate']['@id']).toBe('string')

    expect(typeof resource['rdf:object']).toBe('object')


    return true
}

function validateCreatedMetaData(resource, options) {
    expect(validateMetaDataGroupResource(resource, options)).toBe(true)

    expect(resource['cidme:data'][0]['rdf:predicate']['@id']).toBe('rdf:type')
    expect(resource['cidme:data'][0]['rdf:object']['@id']).toBe('cidme:CreatedMetaData')

    expect(resource['cidme:data'][1]['rdf:predicate']['@id']).toBe('dc:created')
    expect(Date.parse(resource['cidme:data'][1]['rdf:object']['@value'])).toBeLessThanOrEqual(Date.now())
    expect(Date.parse(resource['cidme:data'][1]['rdf:object']['@value'])).toBeGreaterThanOrEqual(Date.parse('2018-01-01T00:00:00Z'))

    if (options.creator) {
        expect(resource['cidme:data'][2]['rdf:predicate']['@id']).toBe('dc:creator')
        expect(resource['cidme:data'][2]['rdf:object']['@value']).toBe(options.creator)
    }

    return true
}

function validateLastModifiedMetaData(resource, options) {
    expect(validateMetaDataGroupResource(resource, options)).toBe(true)

    expect(resource['cidme:data'][0]['rdf:predicate']['@id']).toBe('rdf:type')
    expect(resource['cidme:data'][0]['rdf:object']['@id']).toBe('cidme:LastModifiedMetaData')

    expect(resource['cidme:data'][1]['rdf:predicate']['@id']).toBe('dc:modified')
    expect(Date.parse(resource['cidme:data'][1]['rdf:object']['@value'])).toBeLessThanOrEqual(Date.now())
    expect(Date.parse(resource['cidme:data'][1]['rdf:object']['@value'])).toBeGreaterThanOrEqual(Date.parse('2018-01-01T00:00:00Z'))

    if (options.creator) {
        expect(resource['cidme:data'][2]['rdf:predicate']['@id']).toBe('dc:creator')
        expect(resource['cidme:data'][2]['rdf:object']['@value']).toBe(options.creator)
    }

    return true
}

function createLabelMetaData(labelText = '') {
    let retData = []

    retData.push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidme': cidmeUrlCore },
            '@id': 'cidme:LabelMetaData'
        }
    ))
    retData.push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'skos': skosUrl },
            '@id': 'skos:preflabel'
        }, {
            '@value': labelText
        }
    ))

    return retData
}

function createDefaultMetaData() {
    let retData = []

    retData.push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidmeext': cidmeUrlExt },
            '@id': 'cidmeext:DefaultMetaData'
        }
    ))
    retData.push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'cidmeext': cidmeUrlExt },
            '@id': 'cidmeext:default'
        }, {
            '@value': true
        }
    ))

    return retData
}

function createThingEntityTypeMetaData() {
    let retData = []

    retData.push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidmeext': cidmeUrlExt },
            '@id': 'cidmeext:EntityTypeMetaData'
        }
    ))
    retData.push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'cidmeext': cidmeUrlExt },
            '@id': 'cidmeext:entityType'
        }, {
            '@context': { 'cidmeext': cidmeUrlExt },
            '@id': 'cidmeext:ThingEntityType'
        }
    ))

    return retData
}

function createLabelEntityContextData(labelText = '') {
    let retData = []

    retData.push(cidme.createRdfDataResource(
        ['cidme:EntityContextData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidme': cidmeUrlCore },
            '@id': 'cidme:LabelEntityContextData'
        }
    ))
    retData.push(cidme.createRdfDataResource(
        ['cidme:EntityContextData'], {
            '@context': { 'skos': skosUrl },
            '@id': 'skos:preflabel'
        }, {
            '@value': labelText
        }
    ))

    return retData
}

function createLabelEntityContextLinkData(labelText = '') {
    let retData = []

    retData.push(cidme.createRdfDataResource(
        ['cidme:EntityContextLinkData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidme': cidmeUrlCore },
            '@id': 'cidme:LabelEntityContextLinkData'
        }
    ))
    retData.push(cidme.createRdfDataResource(
        ['cidme:EntityContextLinkData'], {
            '@context': { 'skos': skosUrl },
            '@id': 'skos:preflabel'
        }, {
            '@value': labelText
        }
    ))

    return retData
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
    let cidme = new Cidme({
        'jsonSchemaValidator': ajv,
        'uuidGenerator': UUID
    })

    expect(typeof(cidme)).toBe('object')
    expect(cidme.debug).toBe(false)
})

test('Init CIDME JS object with debug argument', () => {
    let Cidme = require('../dist/cidme')
    let cidme = new Cidme({
        'jsonSchemaValidator': ajv,
        'uuidGenerator': UUID,
        'debug': true
    })
    expect(typeof(cidme)).toBe('object')
    expect(cidme.debug).toBe(true)
})

test('Init CIDME JS object - BAD no arguments', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme()

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD empty arguments', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({})

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD null arguments', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme(null)

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD blank arguments', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme('')

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD incorrectly specified argument', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme(ajv)

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD incorrectly specified arguments', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme(ajv, UUID)

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD incorrectly specified arguments as object', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({
            'ajv': ajv,
            'UUID': UUID
        })

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Null jsonSchemaValidator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({
            'jsonSchemaValidator': null,
            'uuidGenerator': UUID
        })

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Empty jsonSchemaValidator resource object', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({
            'jsonSchemaValidator': {},
            'uuidGenerator': UUID
        })

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Blank jsonSchemaValidator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({
            'jsonSchemaValidator': '',
            'uuidGenerator': UUID
        })

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Null uuidGenerator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({
            'jsonSchemaValidator': ajv,
            'uuidGenerator': null
        })

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Empty uuidGenerator resource object', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({
            'jsonSchemaValidator': ajv,
            'uuidGenerator': {}
        })


        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Init CIDME JS object - BAD: Blank uuidGenerator resource', () => {
    let Cidme = require('../dist/cidme')
    expect(() => {
        let cidme = new Cidme({
            'jsonSchemaValidator': ajv,
            'uuidGenerator': ''
        })

        /* Stop StandardJS from complaining */
        if (cidme) { /* */ }
    }).toThrow()
})

test('Set CIDME debug option to false', () => {
    let Cidme = require('../dist/cidme')
    let cidme = new Cidme({
        'jsonSchemaValidator': ajv,
        'uuidGenerator': UUID,
        'debug': true
    })

    expect(typeof(cidme)).toBe('object')
    expect(cidme.debug).toBe(true)

    cidme.debug = false
    expect(cidme.debug).toBe(false)
})

/* ************************************************************************** */

/* ************************************************************************** */
// Init CIDME core

let Cidme = require('../dist/cidme')

let cidme = new Cidme({
    'jsonSchemaValidator': ajv,
    'uuidGenerator': UUID
})

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

/* ************************************************************************** */

/* ************************************************************************** */
// Test misc. functions

test('Validate getCidmeUrl', () => {
    let datastore = 'local'
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    let cidmeUri = cidme.getCidmeUri(resourceType, id)
    let cidmeUri2 = 'cidme://' + resourceType + '/' + id

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
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    let cidmeUri = 'cidme://' + resourceType + '/' + id
    let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

    expect(cidmeUri2.resourceType).toBe(resourceType)
    expect(cidmeUri2.id).toBe(id)
})

test('Validate parseCidmeUrl - BAD: Bad URI scheme', () => {
    let resourceType = 'Entity'
    let id = UUID.genV4().hexString

    let cidmeUri = 'http://' + resourceType + '/' + id
    expect(() => {
        let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

        /* Stop StandardJS from complaining */
        if (cidmeUri2) { /* */ }
    }).toThrow()
})

test('Validate parseCidmeUrl - BAD: Bad resourceType', () => {
    let resourceType = 'xyz'
    let id = UUID.genV4().hexString

    let cidmeUri = 'cidme://' + resourceType + '/' + id
    expect(() => {
        let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

        /* Stop StandardJS from complaining */
        if (cidmeUri2) { /* */ }
    }).toThrow()
})

test('Validate parseCidmeUrl - BAD: Bad ID', () => {
    let resourceType = 'Entity'
    let id = 'xyz'

    let cidmeUri = 'cidme://' + resourceType + '/' + id
    expect(() => {
        let cidmeUri2 = cidme.parseCidmeUri(cidmeUri)

        /* Stop StandardJS from complaining */
        if (cidmeUri2) { /* */ }
    }).toThrow()
})

/* ************************************************************************** */

/* ************************************************************************** */
// Create and validate internally created resources

test('Validate internally-created basic Entity w/no metaData', () => {
    let options = []
    options.createMetaData = false

    let resource = cidme.createEntityResource(options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})


test('Validate internally-created basic Entity', () => {
    let options = []

    let resource = cidme.createEntityResource()

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})


test('Validate internally-created basic Entity w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = cidme.createEntityResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContext w/no metaData', () => {
    let options = []
    options.createMetaData = false

    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createEntityContextResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContext', () => {
    let options = []

    let resourceEntity = cidme.createEntityResource()

    let resource = cidme.createEntityContextResource()

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContext w/creatorId', () => {
    let options = []
    options.creatorId = creatorId
    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createEntityContextResource(options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetaDataGroup w/no metaData', () => {
    let options = []
    options.createMetaData = false

    let resourceEntity = cidme.createEntityResource(options)

    let resource = cidme.createMetaDataGroupResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetaDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetaDataGroup', () => {
    let options = []

    let resource = cidme.createMetaDataGroupResource()

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetaDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetaDataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resource = cidme.createMetaDataGroupResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetaDataGroupResource(resource, options)).toBe(true)
})


test('Validate internally-created basic MetaDataGroup - with data', () => {
    let options = []
    options['data'] = []
    options['data'].push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidme': cidmeUrlCore },
            '@id': 'cidme:LabelMetaData'
        }
    ))

    let resource = cidme.createMetaDataGroupResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetaDataGroupResource(resource, options)).toBe(true)
})


test('Validate internally-created basic MetaDataGroup - with multiple data', () => {
    let options = []
    options['data'] = []
    options['data'].push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidme': cidmeUrlCore },
            '@id': 'cidme:LabelMetaData'
        }
    ))
    options['data'].push(cidme.createRdfDataResource(
        ['cidme:MetaData'], {
            '@context': { 'skos': skosUrl },
            '@id': 'skos:preflabel'
        }, {
            '@value': 'Test label!'
        }
    ))

    let resource = cidme.createMetaDataGroupResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateMetaDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic MetaDataGroup - BAD: with bad data', () => {
    let options = []
    options['data'] = [{
        'x': 'y'
    }]

    expect(() => {
        let resource = cidme.createMetaDataGroupResource(options)

        /* Stop StandardJS from complaining */
        if (resource) { /* */ }
    }).toThrow()
})

test('Validate internally-created basic EntityContextDataGroup w/no metaData', () => {
    let options = []
    options.createMetaData = false

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(options)

    let resource = cidme.createEntityContextDataGroupResource(options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextDataGroup', () => {
    let options = []

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource()

    let resource = cidme.createEntityContextDataGroupResource()

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextDataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId
    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(options)

    let resource = cidme.createEntityContextDataGroupResource(options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextDataGroup - with multiple data', () => {
    let options = []
    options['createMetaData'] = false
    options['data'] = []
    options['data'].push(cidme.createRdfDataResource(
        ['cidme:EntityContextData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidme': cidmeUrlCore },
            '@id': 'cidme:LabelMetaData'
        }
    ))
    options['data'].push(cidme.createRdfDataResource(
        ['cidme:EntityContextData'], {
            '@context': { 'skos': skosUrl },
            '@id': 'skos:preflabel'
        }, {
            '@value': 'Test label!'
        }
    ))

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource()

    let resource = cidme.createEntityContextDataGroupResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkDataGroup w/no metaData', () => {
    let options = []
    options.createMetaData = false

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(options)

    let resource = cidme.createEntityContextLinkDataGroupResource(options)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkDataGroup', () => {
    let options = []

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource()

    let resource = cidme.createEntityContextLinkDataGroupResource()

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkDataGroup w/creatorId', () => {
    let options = []
    options.creatorId = creatorId

    let resourceEntity = cidme.createEntityResource(options)
    let resourceEntityContext = cidme.createEntityContextResource(options)

    let resource = cidme.createEntityContextLinkDataGroupResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource, options)).toBe(true)
})

test('Validate internally-created basic EntityContextLinkDataGroup - with multiple data', () => {
    let options = []
    options['createMetaData'] = false
    options['data'] = []
    options['data'].push(cidme.createRdfDataResource(
        ['cidme:EntityContextLinkData'], {
            '@context': { 'rdf': rdfUrl },
            '@id': 'rdf:type'
        }, {
            '@context': { 'cidme': cidmeUrlCore },
            '@id': 'cidme:LabelMetaData'
        }
    ))
    options['data'].push(cidme.createRdfDataResource(
        ['cidme:EntityContextLinkData'], {
            '@context': { 'skos': skosUrl },
            '@id': 'skos:preflabel'
        }, {
            '@value': 'Test label!'
        }
    ))

    let resourceEntity = cidme.createEntityResource()
    let resourceEntityContext = cidme.createEntityContextResource()

    let resource = cidme.createEntityContextLinkDataGroupResource(options)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource, options)).toBe(true)
})

// TODO TODO TODO - Add rest of internally created tests

/* ************************************************************************** */


/* ************************************************************************** */
// Test resource adding functions

test('Test addMetaDataGroupToResource to Entity resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    //console.log(JSON.stringify(resource))
    //console.log(JSON.stringify(metaDataGroupResource))

    resource = cidme.addMetaDataGroupToResource(resource, metaDataGroupResource)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:metaDataGroups'][2], options)).toBe(true)
})

test('Test adding MetaDataGroup to Entity via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    resource = cidme.addResourceToParent(resource['@id'], resource, metaDataGroupResource, 'cidme:metaDataGroups')

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:metaDataGroups'][2], options)).toBe(true)
})

test('Test multiple addMetaDataGroupToResource\'s to Entity resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()
    let metaDataGroupResource2 = cidme.createMetaDataGroupResource()

    resource = cidme.addMetaDataGroupToResource(resource, metaDataGroupResource)
    resource = cidme.addMetaDataGroupToResource(resource, metaDataGroupResource2)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:metaDataGroups'][2], options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:metaDataGroups'][3], options)).toBe(true)
})

test('Test addMetaDataGroupToResource to EntityContext', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource['cidme:entityContexts'][0] = cidme.addMetaDataGroupToResource(resource['cidme:entityContexts'][0], metaDataGroupResource)

    //console.log(JSON.stringify(resource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:entityContexts'][0]['cidme:metaDataGroups'][2], options)).toBe(true)
})

test('Test adding MetaDataGroup to EntityContext via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(entityContextResource['@id'], resource, metaDataGroupResource, 'cidme:metaDataGroups')

    //console.log(JSON.stringify(resource))
    //console.log(JSON.stringify(metaDataGroupResource))

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:entityContexts'][0]['cidme:metaDataGroups'][2], options)).toBe(true)
})

test('Test addMetaDataGroupToResource - BAD: null resource', () => {
    let resource = cidme.createEntityResource()

    expect(() => {
        resource = cidme.addMetaDataGroupToResource(null, cidme.createMetaDataGroupResource())
    }).toThrow()
})

test('Test addMetaDataGroupToResource - BAD: null MetaDataGroup', () => {
    let resource = cidme.createEntityResource()

    expect(() => {
        resource = cidme.addMetaDataGroupToResource(resource, null)
    }).toThrow()
})

test('Test addMetaDataGroupToResource - BAD: Wrong resource type', () => {
    let resource = cidme.createEntityResource()
    let metaDataGroupResource = cidme.createEntityContextResource()

    expect(() => {
        resource = cidme.addMetaDataGroupToResource(resource, metaDataGroupResource)
    }).toThrow()
})


test('Test addEntityContextToResource to Entity resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
})

test('Test adding EntityContext to Entity via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
})

test('Test addEntityContextToResource - BAD: null resource', () => {
    let options = []

    let resource = cidme.createEntityResource()

    expect(() => {
        resource = cidme.addEntityContextToResource(null, cidme.createEntityContextResource())

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextToResource - BAD: null MetaDataGroup', () => {
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
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    expect(() => {
        resource = cidme.addEntityContextToResource(resource, metaDataGroupResource)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextDataGroupToResource to EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource['cidme:entityContexts'][0] = cidme.addEntityContextDataGroupToResource(resource['cidme:entityContexts'][0], entityContextDataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0], options)).toBe(true)
})

test('Test adding EntityContextDataGroup to EntityContext via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource()

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, entityContextDataGroupResource, 'cidme:entityContextDataGroups')

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0], options)).toBe(true)
})

test('Test addMetaDataGroupToResource to EntityContextDataGroup resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource['cidme:entityContexts'][0] = cidme.addEntityContextDataGroupToResource(resource['cidme:entityContexts'][0], entityContextDataGroupResource)
    resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0] = cidme.addMetaDataGroupToResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0], metaDataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0], options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'][2], options)).toBe(true)
})

test('Test adding MetaDataGroup to EntityContextDataGroup via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextDataGroupResource = cidme.createEntityContextDataGroupResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, entityContextDataGroupResource, 'cidme:entityContextDataGroups')
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['@id'], resource, metaDataGroupResource, 'cidme:metaDataGroups')

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0], options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'][1], options)).toBe(true)
})

test('Test addEntityContextDataGroupToResource - BAD: pass EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextDataGroupResource = cidme.createEntityContextResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)

    expect(() => {
        resource['cidme:entityContexts'][0] = cidme.addEntityContextDataGroupToResource(resource['cidme:entityContexts'][0], entityContextDataGroupResource)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextDataGroupToResource - BAD: null resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource())

    expect(() => {
        resource['cidme:entityContexts'][0] = cidme.addEntityContextDataGroupToResource(null, cidme.createEntityContextDataGroupResource())

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextDataGroupToResource - BAD: null MetaDataGroup', () => {
    let options = []

    let resource = cidme.createEntityResource()
    resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource())

    expect(() => {
        resource['cidme:entityContexts'][0] = cidme.addEntityContextDataGroupToResource(resource, null)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextLinkDataGroupToResource to EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextLinkDataGroupResource = cidme.createEntityContextLinkDataGroupResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource['cidme:entityContexts'][0] = cidme.addEntityContextLinkDataGroupToResource(resource['cidme:entityContexts'][0], entityContextLinkDataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0], options)).toBe(true)
})

test('Test adding EntityContextLinkDataGroup to EntityContext via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextLinkDataGroupResource = cidme.createEntityContextLinkDataGroupResource()

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, entityContextLinkDataGroupResource, 'cidme:entityContextLinkDataGroups')

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0], options)).toBe(true)
})

test('Test addMetaDataGroupToResource to EntityContextLinkDataGroup resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextLinkDataGroupResource = cidme.createEntityContextLinkDataGroupResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)
    resource['cidme:entityContexts'][0] = cidme.addEntityContextLinkDataGroupToResource(resource['cidme:entityContexts'][0], entityContextLinkDataGroupResource)
    resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0] = cidme.addMetaDataGroupToResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0], metaDataGroupResource)

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0], options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'][2], options)).toBe(true)
})

test('Test adding MetaDataGroup to EntityContextLinkDataGroup via addResourceToParent', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextLinkDataGroupResource = cidme.createEntityContextLinkDataGroupResource()
    let metaDataGroupResource = cidme.createMetaDataGroupResource()

    resource = cidme.addResourceToParent(resource['@id'], resource, entityContextResource)
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['@id'], resource, entityContextLinkDataGroupResource, 'cidme:entityContextLinkDataGroups')
    resource = cidme.addResourceToParent(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['@id'], resource, metaDataGroupResource, 'cidme:metaDataGroups')

    expect(cidme.validate(resource)).toBe(true)
    expect(validateEntityResource(resource, options)).toBe(true)
    expect(validateEntityContextResource(resource['cidme:entityContexts'][0], options)).toBe(true)
    expect(validateEntityContextLinkDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0], options)).toBe(true)
    expect(validateMetaDataGroupResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'][1], options)).toBe(true)
})

test('Test addEntityContextLinkDataGroupToResource - BAD: pass EntityContext resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    let entityContextResource = cidme.createEntityContextResource()
    let entityContextLinkDataGroupResource = cidme.createEntityContextResource()

    resource = cidme.addEntityContextToResource(resource, entityContextResource)

    expect(() => {
        resource['cidme:entityContexts'][0] = cidme.addEntityContextLinkDataGroupToResource(resource['cidme:entityContexts'][0], entityContextLinkDataGroupResource)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextLinkDataGroupToResource - BAD: null resource', () => {
    let options = []

    let resource = cidme.createEntityResource()
    resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource())

    expect(() => {
        resource['cidme:entityContexts'][0] = cidme.addEntityContextLinkDataGroupToResource(null, cidme.createEntityContextLinkDataGroupResource())

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

test('Test addEntityContextLinkDataGroupToResource - BAD: null MetaDataGroup', () => {
    let options = []

    let resource = cidme.createEntityResource()
    resource = cidme.addEntityContextToResource(resource, cidme.createEntityContextResource())

    expect(() => {
        resource['cidme:entityContexts'][0] = cidme.addEntityContextLinkDataGroupToResource(resource, null)

        /* Stop StandardJS from complaining */
        if (resource || options) { /* */ }
    }).toThrow()
})

/* ************************************************************************** */


/* ************************************************************************** */
// Test complete/complex entity creation

test('Create and validate CIDME Example Resource Entity V0.6.0', () => {

    let resource = createCidmeExampleResourceEntity()

    expect(cidme.validate(resource)).toBe(true)
        // Entity
    expect(typeof resource).toBe('object')
    expect(typeof resource['@type']).toBe('string')
    expect(resource['@type']).toBe('cidme:Entity')
    expect(typeof resource['@id']).toBe('string')
        // Entity MetaData #1-#4
    for (let i = 0; i <= 3; i++) {
        expect(typeof resource['cidme:metaDataGroups'][i]).toBe('object')
        expect(typeof resource['cidme:metaDataGroups'][i]['@type']).toBe('string')
        expect(resource['cidme:metaDataGroups'][i]['@type']).toBe('cidme:MetaDataGroup')
        expect(typeof resource['cidme:metaDataGroups'][i]['@id']).toBe('string')
    }
    // Entity Contexts #1-#3
    for (let i = 0; i <= 2; i++) {
        expect(typeof resource['cidme:entityContexts'][i]).toBe('object')
        expect(typeof resource['cidme:entityContexts'][i]['@type']).toBe('string')
        expect(resource['cidme:entityContexts'][i]['@type']).toBe('cidme:EntityContext')
        expect(typeof resource['cidme:entityContexts'][i]['@id']).toBe('string')
            // Entity Contexts #1-#3 MetaData #1-#3
        for (let i2 = 0; i2 <= 2; i2++) {
            expect(typeof resource['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]).toBe('object')
            expect(typeof resource['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]['@type']).toBe('string')
            expect(resource['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]['@type']).toBe('cidme:MetaDataGroup')
            expect(typeof resource['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]['@id']).toBe('string')
        }
        // Entity Contexts #1-#3 EntityContextData #1
        for (let i2 = 0; i2 <= 0; i2++) {
            expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]).toBe('object')
            expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['@type']).toBe('string')
            expect(resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['@type']).toBe('cidme:EntityContextDataGroup')
            expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['@id']).toBe('string')
                // Entity Contexts #1-#3 EntityContextData #1 MetaData #1-#3
            for (let i3 = 0; i3 <= 2; i3++) {
                expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]).toBe('object')
                expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('string')
                expect(resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('cidme:MetaDataGroup')
                expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]['@id']).toBe('string')
            }
        }
        // Entity Contexts #1-#3 EntityContextLinkData #1
        for (let i2 = 0; i2 <= 0; i2++) {
            expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]).toBe('object')
            expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['@type']).toBe('string')
            expect(resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['@type']).toBe('cidme:EntityContextLinkDataGroup')
            expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['@id']).toBe('string')
                // Entity Contexts #1-#3 EntityContextData #1 MetaData #1-#3
            for (let i3 = 0; i3 <= 2; i3++) {
                expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]).toBe('object')
                expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('string')
                expect(resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('cidme:MetaDataGroup')
                expect(typeof resource['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]['@id']).toBe('string')
            }
        }
    }
    // Entity Context #1 Entity Contexts #1a-#1b
    for (let i = 0; i <= 1; i++) {
        expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]).toBe('object')
        expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['@type']).toBe('string')
        expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['@type']).toBe('cidme:EntityContext')
        expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['@id']).toBe('string')
            // Entity Context #1 Entity Contexts #1a-#1b MetaData #1-#3
        for (let i2 = 0; i2 <= 2; i2++) {
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]).toBe('object')
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]['@type']).toBe('string')
            expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]['@type']).toBe('cidme:MetaDataGroup')
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:metaDataGroups'][i2]['@id']).toBe('string')
        }
        // Entity Context #1 Entity Contexts #1a-#1b EntityContextData #1
        for (let i2 = 0; i2 <= 0; i2++) {
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]).toBe('object')
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['@type']).toBe('string')
            expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['@type']).toBe('cidme:EntityContextDataGroup')
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['@id']).toBe('string')
                // Entity Context #1 Entity Contexts #1a-#1b EntityContextData #1 MetaData #1-#3
            for (let i3 = 0; i3 <= 2; i3++) {
                expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]).toBe('object')
                expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('string')
                expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('cidme:MetaDataGroup')
                expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextDataGroups'][i2]['cidme:metaDataGroups'][i3]['@id']).toBe('string')
            }
        }
        // Entity Context #1 Entity Contexts #1a-#1b EntityContextLinkData #1
        for (let i2 = 0; i2 <= 0; i2++) {
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]).toBe('object')
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['@type']).toBe('string')
            expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['@type']).toBe('cidme:EntityContextLinkDataGroup')
            expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['@id']).toBe('string')
                // Entity Context #1 Entity Contexts #1a-#1b EntityContextLinkData #1 MetaData #1-#3
            for (let i3 = 0; i3 <= 2; i3++) {
                expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]).toBe('object')
                expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('string')
                expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]['@type']).toBe('cidme:MetaDataGroup')
                expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContexts'][i]['cidme:entityContextLinkDataGroups'][i2]['cidme:metaDataGroups'][i3]['@id']).toBe('string')
            }
        }
    }
})

/* ************************************************************************** */


/* ************************************************************************** */
// Test delete resource function

test('Test deleteResource() - Entity MetaDataGroup', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:metaDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:metaDataGroups'][1]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:metaDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:metaDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity MetaDataGroup data', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:metaDataGroups'][0]['cidme:data'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:metaDataGroups'][0]['cidme:data'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:metaDataGroups'][0]['cidme:data'].length).toBe(oldCnt - 1)
    expect(resource['cidme:metaDataGroups'][0]['cidme:data'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext MetaDataGroup', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:metaDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:metaDataGroups'][1]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:metaDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:metaDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextData', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextData data', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextData MetaData', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextLinkData', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextLinkData data', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextLinkData MetaData', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContext', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContexts'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextData', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - EntityContext EntityContextLinkData', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    resource = cidme.deleteResource(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['@id'], resource)

    //console.log(JSON.stringify(resource))

    expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'].length).toBe(oldCnt - 1)
    expect(resource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'].length).toBeGreaterThan(0)
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity MetaDataGroup ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:metaDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:metaDataGroups'][0]['@id']
    let id2 = resource['cidme:metaDataGroups'][1]['@id']
    let id3 = resource['cidme:metaDataGroups'][2]['@id']
    let id4 = resource['cidme:metaDataGroups'][3]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)
    resource = cidme.deleteResource(id3, resource)
    resource = cidme.deleteResource(id4, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:metaDataGroups']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity MetaDataGroup data ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:metaDataGroups'][0]['cidme:data'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:metaDataGroups'][0]['cidme:data'][0]['@id']
    let id2 = resource['cidme:metaDataGroups'][0]['cidme:data'][1]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:metaDataGroups'][0]['cidme:data']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity EntityContexts ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:entityContexts'][0]['@id']
    let id2 = resource['cidme:entityContexts'][1]['@id']
    let id3 = resource['cidme:entityContexts'][2]['@id']
        //let id4 = resource['cidme:entityContexts'][3]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)
    resource = cidme.deleteResource(id3, resource)
        //resource = cidme.deleteResource(id4, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:entityContexts']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity EntityContext MetaDataGroups data ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['cidme:data'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['cidme:data'][0]['@id']
    let id2 = resource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['cidme:data'][1]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['cidme:data']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity EntityContext EntityContextDataGroups ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['@id']
    let id2 = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][1]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity EntityContext EntityContextDataGroups data ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data'][0]['@id']
    let id2 = resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data'][1]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:data']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity EntityContext EntityContextLinkDataGroups ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['@id']
    let id2 = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][1]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

test('Test deleteResource() - Entity EntityContext EntityContextLinkDataGroups data ALL', () => {

    let resource = createCidmeExampleResourceEntity()

    let oldCnt = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data'].length
    let oldLength = JSON.stringify(resource).length

    //console.log(JSON.stringify(resource))

    let id1 = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data'][0]['@id']
    let id2 = resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data'][1]['@id']
    resource = cidme.deleteResource(id1, resource)
    resource = cidme.deleteResource(id2, resource)

    //console.log(JSON.stringify(resource))

    expect(typeof resource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:data']).toBe('undefined')
    expect(JSON.stringify(resource).length).toBeLessThan(oldLength)
})

/* ************************************************************************** */


/* ************************************************************************** */

// TODO TODO TODO - Add tests for trying to add resources to places they don't belong...
// For example, add an EntityContextDataGroup to an Entity resource...

/* ************************************************************************** */


/* ************************************************************************** */

// TODO TODO TODO - Add externally-created tests!

/* ************************************************************************** */


/* ************************************************************************** */
// Test helper functions


test('Test getResourceById - Invalid resource ID', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById('cidme://Entity/abccb1fd-fdf4-4384-b464-37221fea2199', testResource)).toBe(false)
})

test('Test getResourceById - Invalid resource ID 2', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(() => {
        let returnVal = cidme.getResourceById('Test1234', testResource)
    }).toThrow()
})

test('Test getResourceById', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['@id'], testResource)).toBe(testResource)
})

test('Test getResourceById - Entity MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:metaDataGroups'][0]['@id'], testResource)).toBe(testResource['cidme:metaDataGroups'][0])
})

test('Test getResourceById - Entity Context', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0])
})

test('Test getResourceById - Entity Context MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0])
})

test('Test getResourceById - Entity Context EntityContextData', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0])
})

test('Test getResourceById - Entity Context EntityContextData MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContextDataGroups'][0]['cidme:metaDataGroups'][0])
})

test('Test getResourceById - Entity Context EntityContextLinks', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0])
})

test('Test getResourceById - Entity Context EntityContextLinks MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContextLinkDataGroups'][0]['cidme:metaDataGroups'][0])
})

test('Test getResourceById - EntityContext EntityContext', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0])
})

test('Test getResourceById - EntityContext EntityContext MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    expect(cidme.getResourceById(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@id'], testResource)).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:metaDataGroups'][0])
})


test('Test getResourceByIdWithBreadcrumbs - Entity', () => {
    let testResource = createCidmeExampleResourceEntity()
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(1)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('cidme:Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - Entity MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['cidme:metaDataGroups'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['cidme:metaDataGroups'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(2)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('cidme:Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['cidme:metaDataGroups'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['cidme:metaDataGroups'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext', () => {
    let testResource = createCidmeExampleResourceEntity()
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['cidme:entityContexts'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['cidme:entityContexts'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(2)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('cidme:Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(3)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('cidme:Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['@id'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext EntityContext', () => {
    let testResource = createCidmeExampleResourceEntity()
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(3)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('cidme:Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['@id'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'])
})

test('Test getResourceByIdWithBreadcrumbs - EntityContext EntityContext MetaData', () => {
    let testResource = createCidmeExampleResourceEntity()
    let x = cidme.getResourceByIdWithBreadcrumbs(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@id'], testResource);
    expect(typeof x).toBe('object')
    expect(typeof x['cidmeResource']).toBe('object')
    expect(x['cidmeResource']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]);
    expect(typeof x['cidmeBreadcrumbs']).toBe('object')
    expect(x['cidmeBreadcrumbs'].length).toBe(4)
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceType']).toBe('cidme:Entity')
    expect(x['cidmeBreadcrumbs'][0]['cidmeResourceId']).toBe(testResource['@id'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][1]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['@id'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][2]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['@id'])
    expect(x['cidmeBreadcrumbs'][3]['cidmeResourceType']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@type'])
    expect(x['cidmeBreadcrumbs'][3]['cidmeResourceId']).toBe(testResource['cidme:entityContexts'][0]['cidme:entityContexts'][0]['cidme:metaDataGroups'][0]['@id'])
})

/* ************************************************************************** */
