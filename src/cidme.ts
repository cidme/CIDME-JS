/**
 * @file Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.3.0.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2019
 * @license MIT
 */

'use strict'

/**
 * Define an interface for optional arguments to be passed.
 */
interface Options {
  id?: string,
  datastore?: string,
  createMetadata?: boolean,
  creatorId?: string,
  data?: object
}

/**
 * Define an interface for a CIDME URI.
 */
interface CidmeUri {
  datastore: string,
  resourceType: string,
  id: string
}

/**
 * Define an interface for a CIDME resource.
 */
interface CidmeResource {
  '@id': string,
  '@context': string,
  '@type': string,
  entityContexts?: any,
  entityContextData?: any,
  entityContextLinks?: any,
  metadata?: any,
  data?: object
}

/**
 * Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.3.0.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018
 * @license MIT
 * @version 0.4.0
 */
class Cidme {

  cidmeVersion:string

  jsonSchemaValidator:any
  uuidGenerator:any

  debug:boolean

  schemaJsonLd:object
  schemaCidme:object

  validateJsonLd:any
  validateCidme:any

  jsonLdContext:string
  jsonLdVocabUrl:string

  resourceTypes:string[]

  /**
     * CIDME class constructor
     * @constructor
     * @param {object} jsonSchemaValidator - An instance of an Ajv compatible JSON schema validator (https://ajv.js.org/)
     * @param {object} uuidGenerator - An instance of an LiosK/UUID.js compatible UUID generator (https://github.com/LiosK/UUID.js)
     * @param {boolean} [debug] - Set true to enable debugging
     */
  constructor (jsonSchemaValidator:any, uuidGenerator:any, debug:boolean=false) {
    // Ensure we have required parameters
    if (
      !jsonSchemaValidator ||
            !uuidGenerator ||
            typeof jsonSchemaValidator !== 'object' ||
            typeof uuidGenerator !== 'function'
    ) {
      throw new Error('Missing required arguments.')
    }

    this['cidmeVersion'] = '0.3.0'

    this['jsonSchemaValidator'] = jsonSchemaValidator
    this['uuidGenerator'] = uuidGenerator

    this['debug'] = debug

    /**
         * JSON schema for JSON-LD.  Taken from: http://json.schemastore.org/jsonld
         * Original doesn't seem to work when $schema is included...
         * @member {string}
         */
    // this.schema = {"title":"Schema for JSON-LD","$schema":"http://json-schema.org/draft-04/schema#","definitions":{"context":{"additionalProperties":true,"properties":{"@context":{"description":"Used to define the short-hand names that are used throughout a JSON-LD document.","type":["object","string","array","null"]}}},"graph":{"additionalProperties":true,"properties":{"@graph":{"description":"Used to express a graph.","type":["array","object"],"additionalItems":{"anyOf":[{"$ref":"#/definitions/common"}]}}}},"common":{"additionalProperties":{"anyOf":[{"$ref":"#/definitions/common"}]},"properties":{"@id":{"description":"Used to uniquely identify things that are being described in the document with IRIs or blank node identifiers.","type":"string","format":"uri"},"@value":{"description":"Used to specify the data that is associated with a particular property in the graph.","type":["string","boolean","number","null"]},"@language":{"description":"Used to specify the language for a particular string value or the default language of a JSON-LD document.","type":["string","null"]},"@type":{"description":"Used to set the data type of a node or typed value.","type":["string","null","array"]},"@container":{"description":"Used to set the default container type for a term.","type":["string","null"],"enum":["@language","@list","@index","@set"]},"@list":{"description":"Used to express an ordered set of data."},"@set":{"description":"Used to express an unordered set of data and to ensure that values are always represented as arrays."},"@reverse":{"description":"Used to express reverse properties.","type":["string","object","null"],"additionalProperties":{"anyOf":[{"$ref":"#/definitions/common"}]}},"@base":{"description":"Used to set the base IRI against which relative IRIs are resolved","type":["string","null"],"format":"uri"},"@vocab":{"description":"Used to expand properties and values in @type with a common prefix IRI","type":["string","null"],"format":"uri"}}}},"allOf":[{"$ref":"#/definitions/context"},{"$ref":"#/definitions/graph"},{"$ref":"#/definitions/common"}],"type":["object","array"],"additionalProperties":true};
    this['schemaJsonLd'] = { 'title': 'Schema for JSON-LD', 'definitions': { 'context': { 'additionalProperties': true, 'properties': { '@context': { 'description': 'Used to define the short-hand names that are used throughout a JSON-LD document.', 'type': ['object', 'string', 'array', 'null'] } } }, 'graph': { 'additionalProperties': true, 'properties': { '@graph': { 'description': 'Used to express a graph.', 'type': ['array', 'object'], 'additionalItems': { 'anyOf': [{ '$ref': '#/definitions/common' }] } } } }, 'common': { 'additionalProperties': { 'anyOf': [{ '$ref': '#/definitions/common' }] }, 'properties': { '@id': { 'description': 'Used to uniquely identify things that are being described in the document with IRIs or blank node identifiers.', 'type': 'string', 'format': 'uri' }, '@value': { 'description': 'Used to specify the data that is associated with a particular property in the graph.', 'type': ['string', 'boolean', 'number', 'null'] }, '@language': { 'description': 'Used to specify the language for a particular string value or the default language of a JSON-LD document.', 'type': ['string', 'null'] }, '@type': { 'description': 'Used to set the data type of a node or typed value.', 'type': ['string', 'null', 'array'] }, '@container': { 'description': 'Used to set the default container type for a term.', 'type': ['string', 'null'], 'enum': ['@language', '@list', '@index', '@set'] }, '@list': { 'description': 'Used to express an ordered set of data.' }, '@set': { 'description': 'Used to express an unordered set of data and to ensure that values are always represented as arrays.' }, '@reverse': { 'description': 'Used to express reverse properties.', 'type': ['string', 'object', 'null'], 'additionalProperties': { 'anyOf': [{ '$ref': '#/definitions/common' }] } }, '@base': { 'description': 'Used to set the base IRI against which relative IRIs are resolved', 'type': ['string', 'null'], 'format': 'uri' }, '@vocab': { 'description': 'Used to expand properties and values in @type with a common prefix IRI', 'type': ['string', 'null'], 'format': 'uri' } } } }, 'allOf': [{ '$ref': '#/definitions/context' }, { '$ref': '#/definitions/graph' }, { '$ref': '#/definitions/common' }], 'type': ['object', 'array'], 'additionalProperties': true }

    /**
         * JSON schema for CIDME resource.
         * @member {string}
         */
    this['schemaCidme'] = {
      'id': 'http://cidme.net/vocab/core/' + this['cidmeVersion'] + '/cidme.schema.json',
      'title': 'CIDME Entity',
      'type': 'object',
      'definitions': {
        '@context': {
          'type': 'string',
          'format': 'uri'
        },
        '@dataContext': {
          'type': ['string', 'object']
        },
        'Entity': {
          'title': 'CIDME Entity Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/[a-zA-Z0-9\\-]+\\/Entity\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['Entity']
            },
            'entityContexts': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContext'
              }
            },
            'metadata': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetadataGroup'
              }
            }
          },
          'required': ['@context', '@id', '@type'],
          'additionalProperties': false
        },
        'EntityContext': {
          'title': 'CIDME EntityContext Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/[a-zA-Z0-9\\-]+\\/EntityContext\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['EntityContext']
            },
            'entityContexts': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContext'
              }
            },
            'entityContextLinks': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContextLinkGroup'
              }
            },
            'entityContextData': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContextDataGroup'
              }
            },
            'metadata': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetadataGroup'
              }
            }
          },
          'required': ['@context', '@id', '@type'],
          'additionalProperties': false
        },
        'EntityContextLinkGroup': {
          'title': 'CIDME EntityContextLinkGroup Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/[a-zA-Z0-9\\-]+\\/EntityContextLinkGroup\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['EntityContextLinkGroup']
            },
            'metadata': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetadataGroup'
              }
            },
            'data': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Data'
              }
            }
          },
          'required': ['@context', '@id', '@type'],
          'additionalProperties': false
        },
        'EntityContextDataGroup': {
          'title': 'CIDME EntityContextDataGroup Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/[a-zA-Z0-9\\-]+\\/EntityContextDataGroup\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['EntityContextDataGroup']
            },
            'metadata': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetadataGroup'
              }
            },
            'data': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Data'
              }
            }
          },
          'required': ['@context', '@id', '@type'],
          'additionalProperties': false
        },
        'MetadataGroup': {
          'title': 'CIDME MetadataGroup Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/[a-zA-Z0-9\\-]+\\/MetadataGroup\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['MetadataGroup']
            },
            'metadata': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetadataGroup'
              }
            },
            'data': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Data'
              }
            }
          },
          'required': ['@context', '@id', '@type'],
          'additionalProperties': false
        },
        'Data': {
          'title': 'CIDME RDF Data Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@dataContext'
            }
          },
          'required': ['@context'],
          'additionalProperties': true
        }
      },
      'if': {
        'properties': {
          '@type': { 'enum': ['Entity'] }
        }
      },
      'then': {
        '$ref': '#/definitions/Entity'
      },
      'else': {
        'if': {
          'properties': {
            '@type': { 'enum': ['EntityContext'] }
          }
        },
        'then': {
          '$ref': '#/definitions/EntityContext'
        },
        'else': {
          'if': {
            'properties': {
              '@type': { 'enum': ['EntityContextLinkGroup'] }
            }
          },
          'then': {
            '$ref': '#/definitions/EntityContextLinkGroup'
          },
          'else': {
            'if': {
              'properties': {
                '@type': { 'enum': ['EntityContextDataGroup'] }
              }
            },
            'then': {
              '$ref': '#/definitions/EntityContextDataGroup'
            },
            'else': {
              'if': {
                'properties': {
                  '@type': { 'enum': ['MetadataGroup'] }
                }
              },
              'then': {
                '$ref': '#/definitions/MetadataGroup'
              },
              'else': false
            }
          }
        }
      }
    }

    /**
         * Set up json schema validator function for JSON-LD validation.
         * @member {object}
         */
    this['validateJsonLd'] = jsonSchemaValidator.compile(this['schemaJsonLd'])

    /**
         * Set up json schema validator function for CIDME resource validation.
         * @member {object}
         */
    this['validateCidme'] = Object(jsonSchemaValidator.compile(this['schemaCidme']))

    /**
         * URL of JSON-LD vocab for CIDME resources.
         * @member {string}
         */
    this['jsonLdVocabUrl'] = 'http://cidme.net/vocab/core/' + this['cidmeVersion']

    /**
         * URL of JSON-LD context for CIDME resources.
         * @member {string}
         */
    this['jsonLdContext'] = this['jsonLdVocabUrl'] + '/jsonldcontext.json'

    /**
         * Array of CIDME resource types
         */
    this['resourceTypes'] = [
      'Entity',
      'EntityContext',
      'EntityContextLinkGroup',
      'EntityContextDataGroup',
      'MetadataGroup'
    ]
  }

  /* ********************************************************************** */
  // VALIDATION FUNCTIONS

  /**
     * Validate a CIDME resource
     * @param {object} cidmeResource - Validates a JSON-LD string representation of a CIDME resource.
     * @returns {boolean} Success
     */
  validate (cidmeResource:any):boolean {
    // Validate as JSON-LD (via JSON schema validation)
    let validJsonLd:object = this['validateJsonLd'](cidmeResource)
    if (!validJsonLd) {
      this.debugOutput('- INVALID as JSON-LD!')
      this.debugOutput(this['validateJsonLd'].errors)
      return false
    } else {
      this.debugOutput('- VALID as JSON-LD!')
    }

    // Validate as CIDME (via JSON schema validation)
    let validCidme:object = this['validateCidme'](cidmeResource)
    if (!validCidme) {
      this.debugOutput('- INVALID as CIDME Schema!')
      this.debugOutput(this['validateCidme'].errors)
      return false
    } else {
      this.debugOutput('- VALID as CIDME Schema!')
    }

    // Validate metadata, if applicable
    if (cidmeResource.hasOwnProperty('metadata')) {
      for (let i:number = 0; i < cidmeResource['metadata'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['metadata'][i]['@id'])['resourceType'] !== 'MetadataGroup') { return false }
        if (!this.validate(cidmeResource['metadata'][i])) {
          // this.debugOutput('  -- METADATA VALIDATION ERROR!');
          return false
        }
      }
    }

    // Validate entity context link groups, if applicable
    if (cidmeResource.hasOwnProperty('entityContextLinks')) {
      for (let i:number = 0; i < cidmeResource['entityContextLinks'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['entityContextLinks'][i]['@id'])['resourceType'] !== 'EntityContextLinkGroup') { return false }
        if (!this.validate(cidmeResource['entityContextLinks'][i])) {
          // this.debugOutput('  -- ENTITY CONTEXT LINK GROUPS VALIDATION ERROR!');
          return false
        }
      }
    }

    // Validate entity context data groups, if applicable
    if (cidmeResource.hasOwnProperty('entityContextData')) {
      for (let i:number = 0; i < cidmeResource['entityContextData'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['entityContextData'][i]['@id'])['resourceType'] !== 'EntityContextDataGroup') { return false }
        if (!this.validate(cidmeResource['entityContextData'][i])) {
          // this.debugOutput('  -- ENTITY CONTEXT DATA GROUPS VALIDATION ERROR!');
          return false
        }
      }
    }

    // Validate entity subcontexts, if applicable
    if (cidmeResource.hasOwnProperty('entityContexts')) {
      for (let i:number = 0; i < cidmeResource['entityContexts'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['entityContexts'][i]['@id'])['resourceType'] !== 'EntityContext') { return false }
        if (!this.validate(cidmeResource['entityContexts'][i])) {
          // this.debugOutput('  -- ENTITY CONTEXT VALIDATION ERROR!');
          return false
        }
      }
    }

    return true
  }

  /**
     * Validates a CIDME datastore name
     * @param {string} datastore
     * @returns {boolean}
     */
  validateDatastore (datastore:string):boolean {
    if (
      datastore === 'public' ||
            datastore === 'local' ||
            (
              this['uuidGenerator'].parse(datastore) !== false &&
                this['uuidGenerator'].parse(datastore) !== null
            )
    ) {
      return true
    }

    return false
  }

  /**
     * Validates a CIDME resource type name
     * @param {string} resourceType
     * @returns {boolean}
     */
  validateResourceType (resourceType:string):boolean {
    if (this['resourceTypes'].indexOf(resourceType) >= 0) { return true }
    //if (this['resourceTypes'].hasOwnProperty(resourceType)) { return true }
    //console.log(this['resourceTypes'].find(x => x.id === resourceType))
    //if (this['resourceTypes'].find(x => x.id === resourceType)) { return true }

    return false
  }
  /* ********************************************************************** */

  /* ********************************************************************** */
  // CIDME RESOURCE CREATION FUNCTIONS

  /**
     * Returns a CIDME entity resource.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.datastore=local] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
  createEntityResource (options:Options):CidmeResource {
    let datastore:string = 'local'
    if (!options || !options['datastore']) {} else { datastore = options['datastore'] }
    if (!this.validateDatastore(datastore)) {
      throw new Error('Invalid datastore specified.')
    }

    // Is this a brand new resource?
    let newResource:boolean = false
    if (!options || !options['id']) { newResource = true }

    // Determine resource UUID.
    var idUuid:string 
    if (newResource === true) {
      idUuid = this['uuidGenerator'].genV4().hexString
    } else {
      idUuid = String(options['id'])
    }

    let entity:CidmeResource = {
      '@context': this['jsonLdContext'],
      '@type': 'Entity',
      '@id': this.getCidmeUri(datastore, 'Entity', idUuid)
    }

    // Add metadata?
    let createMetadata:boolean = true
    if (!options) {} else {
      if (options['createMetadata'] === false) { createMetadata = false }
    }
    if (createMetadata === true) {
      let metadataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metadataOptions['creatorId'] = options['creatorId']
      }
      entity = this.addCreatedMetadataToResource(entity['@id'], entity, metadataOptions)
      entity = this.addLastModifiedMetadataToResource(entity['@id'], entity, metadataOptions)
    }

    if (!this.validate(entity)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entity
  }

  /**
     * Add a MetadataGroup resource to an existing resource with a type of CreatedMetadata.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
  addCreatedMetadataToResource (parentId:string, cidmeResource:CidmeResource, options:Options):CidmeResource {
    let isoDate:any = new Date()

    let creatorId:string|null = null
    if (!options || !options['creatorId']) {} else { creatorId = options['creatorId'] }

    let newOptions:Options = {}
    newOptions['createMetadata'] = false
    newOptions['data'] = [
      {
        '@context': this['jsonLdContext'],
        '@type': 'CreatedMetadata'
      },
      {
        '@context': {
          '@vocab': 'http://purl.org/dc/terms/'
        },
        'created': isoDate.toISOString(),
        'creator': creatorId
      }
    ]

    let createdMetadataGroupResource:CidmeResource = this.createMetadataGroupResource(parentId, newOptions)

    if (!this.validate(createdMetadataGroupResource)) {
      throw new Error('ERROR:  An error occured while validating the new Metadata resource.')
    }

    cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetadataGroupResource)

    return cidmeResource
  }

  /**
     * Add a MetadataGroup resource to an existing resource with a type of LastModifiedMetadata.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @returns {object}
     */
  addLastModifiedMetadataToResource (parentId:string, cidmeResource:CidmeResource, options:Options):CidmeResource {
    let isoDate:any = new Date()

    let creatorId:string|null = null
    if (!options || !options['creatorId']) {} else { creatorId = options['creatorId'] }

    let newOptions:Options = {}
    newOptions['createMetadata'] = false
    newOptions['data'] = [
      {
        '@context': this['jsonLdContext'],
        '@type': 'LastModifiedMetadata'
      },
      {
        '@context': {
          '@vocab': 'http://purl.org/dc/terms/'
        },
        'modified': isoDate.toISOString(),
        'creator': creatorId
      }
    ]

    let createdMetadataGroupResource:CidmeResource = this.createMetadataGroupResource(parentId, newOptions)

    if (!this.validate(createdMetadataGroupResource)) {
      throw new Error('ERROR:  An error occured while validating the new Metadata resource.')
    }

    cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetadataGroupResource)

    return cidmeResource
  }

  /**
     * Returns a CIDME entity context resource.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
  createEntityContextResource (parentId:string, options:Options):CidmeResource {
    // Validate parentId.
    let parentIdObject:CidmeUri = this.parseCidmeUri(parentId)

    // ParentId resourceType MUST be Entity or EntityContext.
    if (parentIdObject['resourceType'] !== 'Entity' && parentIdObject['resourceType'] !== 'EntityContext') {
      throw new Error('ERROR:  ParentId contains an invalid resource type.')
    }

    // Is this a brand new resource?
    let newResource:boolean = false
    if (!options || !options['id']) { newResource = true }

    // Determine resource UUID.
    var idUuid:string 
    if (newResource === true) {
      idUuid = this['uuidGenerator'].genV4().hexString
    } else {
      idUuid = String(options['id'])
    }

    // Create the resource.
    let entityContext:CidmeResource = {
      '@context': this['jsonLdContext'],
      '@type': 'EntityContext',
      '@id': this.getCidmeUri(parentIdObject['datastore'], 'EntityContext', idUuid)
    }

    // Add metadata?
    let createMetadata:boolean = true
    if (!options) {} else {
      if (options['createMetadata'] === false) { createMetadata = false }
    }
    if (createMetadata === true) {
      let metadataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metadataOptions['creatorId'] = options['creatorId']
      }
      entityContext = this.addCreatedMetadataToResource(entityContext['@id'], entityContext, metadataOptions)
      entityContext = this.addLastModifiedMetadataToResource(entityContext['@id'], entityContext, metadataOptions)
    }

    if (!this.validate(entityContext)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entityContext
  }



  /**
     * Returns a CIDME metadata resource.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.data] - RDF data in JSON-LD format to be added to the metadata data[] array.
     * @param {string} [options.createMetadata=true] - Whether or not to add metadata to this metadata.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
  createMetadataGroupResource (parentId:string, options:Options):CidmeResource {
    // Validate parentId.
    let parentIdObject:CidmeUri = this.parseCidmeUri(parentId)

    // Is this a brand new resource?
    let newResource:boolean = false
    if (!options || !options['id']) { newResource = true }

    // Determine resource UUID.
    var idUuid:string 
    if (newResource === true) {
      idUuid = this['uuidGenerator'].genV4().hexString
    } else {
      idUuid = String(options['id'])
    }

    // Create the resource.
    let metadata:CidmeResource = {
      '@context': this['jsonLdContext'],
      '@type': 'MetadataGroup',
      '@id': this.getCidmeUri(parentIdObject['datastore'], 'MetadataGroup', idUuid)
    }

    if (!options || !options['data']) {} else {
      metadata['data'] = options['data']

      if (!this.validate(metadata)) {
        throw new Error('ERROR:  An error occured while validating the new resource.')
      }
    }

    // Add metadata?
    let createMetadata:boolean = true
    if (!options) {} else {
      if (options['createMetadata'] === false) { createMetadata = false }
    }
    if (createMetadata === true) {
      let metadataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metadataOptions['creatorId'] = options['creatorId']
      }
      metadata = this.addCreatedMetadataToResource(metadata['@id'], metadata, metadataOptions)
      metadata = this.addLastModifiedMetadataToResource(metadata['@id'], metadata, metadataOptions)
    }

    if (!this.validate(metadata)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return metadata
  }

  /**
     * Returns a CIDME entity context link group resource.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
  createEntityContextLinkGroupResource (parentId:string, options:Options):CidmeResource {
    // Validate parentId.
    let parentIdObject:CidmeUri = this.parseCidmeUri(parentId)

    // ParentId resourceType MUST be EntityContext.
    if (parentIdObject['resourceType'] !== 'EntityContext') {
      throw new Error('ERROR:  ParentId contains an invalid resource type.')
    }

    // Is this a brand new resource?
    let newResource:boolean = false
    if (!options || !options['id']) { newResource = true }

    // Determine resource UUID.
    var idUuid:string 
    if (newResource === true) {
      idUuid = this['uuidGenerator'].genV4().hexString
    } else {
      idUuid = String(options['id'])
    }

    // Create the resource.
    let entityContextLink:CidmeResource = {
      '@context': this['jsonLdContext'],
      '@type': 'EntityContextLinkGroup',
      '@id': this.getCidmeUri(parentIdObject['datastore'], 'EntityContextLinkGroup', idUuid)
    }

    if (!options || !options['data']) {} else {
      entityContextLink['data'] = options['data']

      if (!this.validate(entityContextLink)) {
        throw new Error('ERROR:  An error occured while validating the new resource.')
      }
    }

    // Add metadata?
    let createMetadata:boolean = true
    if (!options) {} else {
      if (options['createMetadata'] === false) { createMetadata = false }
    }
    if (createMetadata === true) {
      let metadataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metadataOptions['creatorId'] = options['creatorId']
      }
      entityContextLink = this.addCreatedMetadataToResource(entityContextLink['@id'], entityContextLink, metadataOptions)
      entityContextLink = this.addLastModifiedMetadataToResource(entityContextLink['@id'], entityContextLink, metadataOptions)
    }

    if (!this.validate(entityContextLink)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entityContextLink
  }

  /**
     * Returns a CIDME entity context data group resource.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
  createEntityContextDataGroupResource (parentId:string, options:Options):CidmeResource {
    // Validate parentId.
    let parentIdObject:CidmeUri = this.parseCidmeUri(parentId)

    // ParentId resourceType MUST be EntityContext.
    if (parentIdObject['resourceType'] !== 'EntityContext') {
      throw new Error('ERROR:  ParentId contains an invalid resource type.')
    }

    // Is this a brand new resource?
    let newResource:boolean = false
    if (!options || !options['id']) { newResource = true }

    // Determine resource UUID.
    var idUuid:string 
    if (newResource === true) {
      idUuid = this['uuidGenerator'].genV4().hexString
    } else {
      idUuid = String(options['id'])
    }

    // Create the resource.
    let entityContextData:CidmeResource = {
      '@context': this['jsonLdContext'],
      '@type': 'EntityContextDataGroup',
      '@id': this.getCidmeUri(parentIdObject['datastore'], 'EntityContextDataGroup', idUuid)
    }

    if (!options || !options['data']) {} else {
      entityContextData['data'] = options['data']

      if (!this.validate(entityContextData)) {
        throw new Error('ERROR:  An error occured while validating the new resource.')
      }
    }

    // Add metadata?
    let createMetadata:boolean = true
    if (!options) {} else {
      if (options['createMetadata'] === false) { createMetadata = false }
    }
    if (createMetadata === true) {
      let metadataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metadataOptions['creatorId'] = options['creatorId']
      }
      entityContextData = this.addCreatedMetadataToResource(entityContextData['@id'], entityContextData, metadataOptions)
      entityContextData = this.addLastModifiedMetadataToResource(entityContextData['@id'], entityContextData, metadataOptions)
    }

    if (!this.validate(entityContextData)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entityContextData
  }
  /* ********************************************************************** */

  /* ********************************************************************** */
  // CIDME RESOURCE MANIPULATION FUNCTIONS

  /*
     * Adds a CIDME resource to another CIDME resource.  The resource is added to the appropriate place by specifying the parent ID to add to.  The type of resource to add is specified as well, indicating whether we're adding a MetadataGroup, an EntityContext, or another type of resource.
     * @param {string} parentId - The @id of the resource to add to.
     * @param {object} cidmeResource - CIDME resource to add to.
     * @param {object} resourceToAdd - The resource to add.
     * @returns {object}
     */
  addResourceToParent (parentId:string, cidmeResource:CidmeResource, resourceToAdd:CidmeResource):CidmeResource {
    if (!resourceToAdd || !this.validate(resourceToAdd)) {
      throw new Error('ERROR:  Missing or invalid resourceToAdd.')
    }
    let resourceToAddType:string = this.parseCidmeUri(resourceToAdd['@id'])['resourceType']

    if (!parentId || !cidmeResource || !resourceToAddType || !resourceToAdd) {
      throw new Error('ERROR:  Missing or invalid argument.')
    }

    if (cidmeResource['@id'] === parentId) {
      if (resourceToAddType === 'MetadataGroup') {
        cidmeResource = this.addMetadataGroupToResource(cidmeResource, resourceToAdd)
      } else if (resourceToAddType === 'EntityContext') {
        cidmeResource = this.addEntityContextToResource(cidmeResource, resourceToAdd)
      } else if (resourceToAddType === 'EntityContextLinkGroup') {
        cidmeResource = this.addEntityContextLinkGroupToResource(cidmeResource, resourceToAdd)
      } else if (resourceToAddType === 'EntityContextDataGroup') {
        cidmeResource = this.addEntityContextDataGroupToResource(cidmeResource, resourceToAdd)
      } else {
        throw new Error('ERROR:  Invalid resourceToAddType.')
      }
    }

    if (cidmeResource.hasOwnProperty('metadata')) {
      for (let i:number = 0; i < cidmeResource['metadata'].length; i++) {
        cidmeResource['metadata'][i] = this.addResourceToParent(parentId, cidmeResource['metadata'][i], resourceToAdd)
      }
    }

    if (cidmeResource.hasOwnProperty('entityContexts')) {
      for (let i:number = 0; i < cidmeResource['entityContexts'].length; i++) {
        cidmeResource['entityContexts'][i] = this.addResourceToParent(parentId, cidmeResource['entityContexts'][i], resourceToAdd)
      }
    }

    if (cidmeResource.hasOwnProperty('entityContextData')) {
      for (let i:number = 0; i < cidmeResource['entityContextData'].length; i++) {
        cidmeResource['entityContextData'][i] = this.addResourceToParent(parentId, cidmeResource['entityContextData'][i], resourceToAdd)
      }
    }

    if (cidmeResource.hasOwnProperty('entityContextLinks')) {
      for (let i:number = 0; i < cidmeResource['entityContextLinks'].length; i++) {
        cidmeResource['entityContextLinks'][i] = this.addResourceToParent(parentId, cidmeResource['entityContextLinks'][i], resourceToAdd)
      }
    }

    return cidmeResource
  }

  /**
     * Adds a MetadataGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add MetadataGroup to.
     * @param {object} metadataGroup - MetadataGroup resource to add to CIDME resource.
     * @returns {object}
     */
  addMetadataGroupToResource (cidmeResource:CidmeResource, metadataGroup:CidmeResource):CidmeResource {
    if (!cidmeResource ||
            !metadataGroup ||
            !this.validate(cidmeResource) ||
            !this.validate(metadataGroup) ||
            this.parseCidmeUri(metadataGroup['@id'])['resourceType'] !== 'MetadataGroup'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    if (!cidmeResource.hasOwnProperty('metadata')) {
      cidmeResource['metadata'] = []
    }

    cidmeResource['metadata'].push(metadataGroup)

    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return cidmeResource
  }

  /**
     * Adds an EntityContext to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add EntityContext to.
     * @param {object} entityContext - EntityContext resource to add to CIDME resource.
     * @returns {object}
     */
  addEntityContextToResource (cidmeResource:CidmeResource, entityContext:CidmeResource):CidmeResource {
    if (!cidmeResource ||
            !entityContext ||
            !this.validate(entityContext) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContext['@id'])['resourceType'] !== 'EntityContext'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    if (!cidmeResource.hasOwnProperty('entityContexts')) {
      cidmeResource['entityContexts'] = []
    }

    cidmeResource['entityContexts'].push(entityContext)

    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return cidmeResource
  }

  /**
     * Adds an EntityContextLinkGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add EntityContextLinkGroup to.
     * @param {object} entityContextLinkGroup - EntityContextLinkGroup resource to add to CIDME resource.
     * @returns {object}
     */
  addEntityContextLinkGroupToResource (cidmeResource:CidmeResource, entityContextLinkGroup:CidmeResource):CidmeResource {
    if (!cidmeResource ||
            !entityContextLinkGroup ||
            !this.validate(entityContextLinkGroup) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContextLinkGroup['@id'])['resourceType'] !== 'EntityContextLinkGroup'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    if (!cidmeResource.hasOwnProperty('entityContextLinkGroups')) {
      cidmeResource['entityContextLinks'] = []
    }

    cidmeResource['entityContextLinks'].push(entityContextLinkGroup)

    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return cidmeResource
  }

  /**
     * Adds an EntityContextDataGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add EntityContextDataGroup to.
     * @param {object} entityContextDataGroup - EntityContextDataGroup resource to add to CIDME resource.
     * @returns {object}
     */
  addEntityContextDataGroupToResource (cidmeResource:CidmeResource, entityContextDataGroup:CidmeResource):CidmeResource {
    if (!cidmeResource ||
            !entityContextDataGroup ||
            !this.validate(entityContextDataGroup) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContextDataGroup['@id'])['resourceType'] !== 'EntityContextDataGroup'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    if (!cidmeResource.hasOwnProperty('entityContextDataGroups')) {
      cidmeResource['entityContextData'] = []
    }

    cidmeResource['entityContextData'].push(entityContextDataGroup)

    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return cidmeResource
  }
  /* ********************************************************************** */

  /* ********************************************************************** */
  // MISC. FUNCTIONS

  /**
     * Returns a CIDME resource URI given a datastore, resourceType , and ID.
     * @param {string} datastore
     * @param {string} resourceType
     * @param {(string|boolean)} id
     * @returns {string}
     */
  getCidmeUri (datastore:string, resourceType:string, id:string):string {
    if (!this.validateDatastore(datastore)) {
      throw new Error('ERROR:  Invalid datastore specified.')
    }

    if (!this.validateResourceType(resourceType)) {
      throw new Error('ERROR:  Invalid resourceType specified.')
    }

    if (
      !this['uuidGenerator'].parse(id) ||
            this['uuidGenerator'].parse(id) === null
    ) {
      throw new Error('ERROR:  Invalid id specified.')
    }

    return 'cidme://' + datastore + '/' + resourceType + '/' + id
  }

  /**
     * Returns an object containing CIDME resource URI elements.
     * @param {string} CIDME resource ID
     * @returns {object}
     */
  parseCidmeUri (id:string):CidmeUri {
    if (!id) {
      throw new Error('ERROR:  No URI specified.')
    }

    // Ensure the URI scheme is good.
    if (id.substring(0, 8) !== 'cidme://') {
      throw new Error('ERROR:  Invalid URI scheme specified.')
    }

    // Use the getCidmeUri function to test for errors.  It will throw an
    // exception if any are found.
    this.getCidmeUri(String(id.split('/')[2]), String(id.split('/')[3]), String(id.split('/')[4]))

    return {
      'datastore': String(id.split('/')[2]),
      'resourceType': String(id.split('/')[3]),
      'id': String(id.split('/')[4])
    }
  }

  /**
     * Output debugging information
     * @param {*} data - The data to output
     */
  debugOutput (data:any):void {
    if (this['debug'] === true) {
      console.log(data)
    }
  }
  /* ********************************************************************** */
}

//module.exports = Cidme
export = Cidme
