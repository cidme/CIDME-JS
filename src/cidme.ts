/**
 * @file Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.6.0.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2023
 * @license MIT
 */

'use strict'

/**
 * Defines an interface for class constructor options.
 */
interface ConstructorOptions {
  jsonSchemaValidator:object, 
  uuidGenerator:object, 
  debug?:boolean
}

/**
 * Define an interface for optional arguments to be passed.
 */
interface Options {
  id?: string,
  createMetaData?: boolean,
  creatorId?: string,
  data?: Array<CidmeRdfDataResource>
}

/**
 * Define an interface for a CIDME URI.
 */
interface CidmeUri {
  resourceType: string,
  id: string
}

/**
 * Define an interface for a CIDME resource.
 */
interface CidmeResource {
  '@id': string,
  '@context'?: object,
  '@type': string,
  'cidme:metaDataGroups'?: Array<CidmeResource>,
  'cidme:data'?: Array<CidmeRdfDataResource>,
  'cidme:entityContexts'?: Array<CidmeResource>,
  'cidme:entityContextLinkDataGroups'?: Array<CidmeResource>,
  'cidme:entityContextDataGroups'?: Array<CidmeResource>
}

/**
 * Define an interface for a CIDME RdfData RDF predicate.
 */
interface CidmeRdfPredicate {
  '@context': object,
  '@id': string
}

/**
 * Define an interface for a CIDME RdfData RDF object (as URI).
 */
 interface CidmeRdfObjectUri {
  '@context': object,
  '@id': string
}

/**
 * Define an interface for a CIDME RdfData RDF object (as a JSON value).
 */
 interface CidmeRdfObjectJsonValue {
  '@value': string | number | null | boolean
}

/**
 * Define an interface for a CIDME RdfData resource.
 */
 interface CidmeRdfDataResource {
  '@id': string,
  '@type': Array<String>,
  'rdf:predicate': CidmeRdfPredicate,
  'rdf:object': CidmeRdfObjectUri | CidmeRdfObjectJsonValue
}

/**
 * Define an interface for an RDF vocabulary/taxonomy.
 */
 interface rdfVocabItem {
  'prefix': string,
  'url': string,
  'name'?: string,
  'description'?: string
}

/**
 * Define an interface for an array of RDF vocabularies/taxonomies.
 */
interface rdfVocabArray {
  [key: string]: rdfVocabItem
}

/**
 * Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.6.0.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2023
 * @license MIT
 * @version 0.6.1
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

  rdfVocabs:rdfVocabArray


  /**
   * CIDME class constructor
   * @constructor
   * @param {ConstructorOptions} constructorOptions - An object containing arguments.
   * @param {object} constructorOptions.jsonSchemaValidator - An instance of an Ajv compatible JSON schema validator (https://ajv.js.org/)
   * @param {object} constructorOptions.uuidGenerator - An instance of an LiosK/UUID.js compatible UUID generator (https://github.com/LiosK/UUID.js)
   * @param {boolean} [constructorOptions.debug=false] - Set true to enable debugging
   */
  constructor (constructorOptions:ConstructorOptions) {
    // Ensure we have required parameters
    if (
      !constructorOptions['jsonSchemaValidator'] ||
      !constructorOptions['uuidGenerator'] ||
      typeof constructorOptions['jsonSchemaValidator'] !== 'object' ||
      typeof constructorOptions['uuidGenerator'] !== 'function'
    ) {
      throw new Error('Missing required arguments.')
    }

    this['cidmeVersion'] = '0.6.0'

    this['jsonSchemaValidator'] = constructorOptions['jsonSchemaValidator']
    this['uuidGenerator'] = constructorOptions['uuidGenerator']

    /**
     * URL of JSON-LD vocab for CIDME resources.
     * @member {string}
     */
    this['jsonLdVocabUrl'] = 'http://cidme.net/vocab/core/' + this['cidmeVersion'] + '/'

    /**
     * URL of JSON-LD context for CIDME resources.
     * @member {string}
     */
    this['jsonLdContext'] = this['jsonLdVocabUrl'] + 'jsonldcontext.json'

    /**
     * Known RDF Vocabs/Taxonomies
     */
    this['rdfVocabs'] = {}
   
    this['rdfVocabs']['rdf'] = {
      'prefix': 'rdf',
      'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
    }

    this['rdfVocabs']['dc'] = {
      'prefix': 'dc',
      'url': 'http://purl.org/dc/terms/'
    }
  
    this['rdfVocabs']['cidme'] = {
      'prefix': 'cidme',
      'url': this['jsonLdVocabUrl']
    }

    this['rdfVocabs']['cidmeext'] = {
      'prefix': 'cidmeext',
      'url': 'http://cidme.net/vocab/ext/0.1.0/'
    }

    this['rdfVocabs']['skos'] = {
      'prefix': 'skos',
      'url': 'http://www.w3.org/2004/02/skos/core#'
    }

    /**
     * URL of JSON-LD vocab for CIDME resources.
     * @member {string}
     */
    this['jsonLdVocabUrl'] = 'http://cidme.net/vocab/core/' + this['cidmeVersion'] + '/'

    /**
     * URL of JSON-LD context for CIDME resources.
     * @member {string}
     */
    this['jsonLdContext'] = this['jsonLdVocabUrl'] + 'jsonldcontext.json'
 
    /**
     * Debug status.  Whether to show debug output or not.
     * @member {boolean}
     */
    this['debug'] = true
    if (!constructorOptions['debug']) {
      this['debug'] = false
    }

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
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/Entity\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['cidme:Entity']
            },
            'cidme:entityContexts': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContext'
              }
            },
            'cidme:metaDataGroups': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetaDataGroup'
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
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/EntityContext\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['cidme:EntityContext']
            },
            'cidme:entityContexts': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContext'
              }
            },
            'cidme:entityContextLinkDataGroups': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContextLinkDataGroup'
              }
            },
            'cidme:entityContextDataGroups': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/EntityContextDataGroup'
              }
            },
            'cidme:metaDataGroups': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetaDataGroup'
              }
            }
          },
          'required': ['@context', '@id', '@type'],
          'additionalProperties': false
        },
        'EntityContextLinkDataGroup': {
          'title': 'CIDME EntityContextLinkDataGroup Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/DataGroup\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['cidme:EntityContextLinkDataGroup']
            },
            'cidme:metaDataGroups': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetaDataGroup'
              }
            },
            'cidme:data': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/RdfData'
              }
            }
          },
          'required': ['@id', '@type'],
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
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/DataGroup\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['cidme:EntityContextDataGroup']
            },
            'cidme:metaDataGroups': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetaDataGroup'
              }
            },
            'cidme:data': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/RdfData'
              }
            }
          },
          'required': ['@id', '@type'],
          'additionalProperties': false
        },
        'MetaDataGroup': {
          'title': 'CIDME MetaDataGroup Resource',
          'type': 'object',
          'properties': {
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/DataGroup\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'string',
              'enum': ['cidme:MetaDataGroup']
            },
            'cidme:metaDataGroups': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/MetaDataGroup'
              }
            },
            'cidme:data': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/RdfData'
              }
            }
          },
          'required': ['@id', '@type'],
          'additionalProperties': false
        },
        'rdfPredicate': {
          'title': 'CIDME RDF Data Resource - rdf:predicate property',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string'
            }
          },
          'required': ['@id', '@context'],
          'additionalProperties': false
        },
        'rdfObject': {
          'title': 'CIDME RDF Data Resource - rdf:object property',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string'
            },
            '@value': {
              'type': ['string', 'null', 'boolean', 'number']
            }
          },
          'additionalProperties': false
        },
        'RdfData': {
          'title': 'CIDME RDF Data Resource',
          'type': 'object',
          'properties': {
            '@context': {
              '$ref': '#/definitions/@context'
            },
            '@id': {
              'type': 'string',
              'pattern': '^[cC][iI][dD][mM][eE]\\:\\/\\/RdfData\\/[a-f0-9]{8}\\-[a-f0-9]{4}\\-4[a-f0-9]{3}\\-(8|9|a|b)[a-f0-9]{3}\\-[a-f0-9]{12}$'
            },
            '@type': {
              'type': 'array',
              'items': {
                  'type': 'string'
              }
            },
            'rdf:predicate': {
              '$ref': '#/definitions/rdfPredicate'
            },
            'rdf:object': {
              '$ref': '#/definitions/rdfObject'
            }
          },
          'required': ['@id', '@type', 'rdf:predicate', 'rdf:object'],
          'additionalProperties': false
        }
      },
      'if': {
        'properties': {
          '@type': { 'enum': ['cidme:Entity'] }
        }
      },
      'then': {
        '$ref': '#/definitions/Entity'
      },
      'else': {
        'if': {
          'properties': {
            '@type': { 'enum': ['cidme:EntityContext'] }
          }
        },
        'then': {
          '$ref': '#/definitions/EntityContext'
        },
        'else': {
          'if': {
            'properties': {
              '@type': { 'enum': ['cidme:EntityContextLinkDataGroup'] }
            }
          },
          'then': {
            '$ref': '#/definitions/EntityContextLinkDataGroup'
          },
          'else': {
            'if': {
              'properties': {
                '@type': { 'enum': ['cidme:EntityContextDataGroup'] }
              }
            },
            'then': {
              '$ref': '#/definitions/EntityContextDataGroup'
            },
            'else': {
              'if': {
                'properties': {
                  '@type': { 'enum': ['cidme:MetaDataGroup'] }
                }
              },
              'then': {
                '$ref': '#/definitions/MetaDataGroup'
              },
              'else': {
                '$ref': '#/definitions/RdfData'
              }
            }
          }
        }
      }
    }


    /**
     * Set up json schema validator function for JSON-LD validation.
     * @member {object}
     */
    this['validateJsonLd'] = this['jsonSchemaValidator'].compile(this['schemaJsonLd'])

    /**
     * Set up json schema validator function for CIDME resource validation.
     * @member {object}
     */
    this['validateCidme'] = Object(this['jsonSchemaValidator'].compile(this['schemaCidme']))

    /**
     * Array of CIDME resource types
     */
    this['resourceTypes'] = [
      'Entity',
      'EntityContext',
      'DataGroup',
      'RdfData'
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

    // Validate metaData, if applicable
    if (cidmeResource.hasOwnProperty('cidme:metaDataGroups')) {
      for (let i:number = 0; i < cidmeResource['cidme:metaDataGroups'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['cidme:metaDataGroups'][i]['@id'])['resourceType'] !== 'DataGroup') { return false }
        if (!this.validate(cidmeResource['cidme:metaDataGroups'][i])) {
          // this.debugOutput('  -- METADATA VALIDATION ERROR!');
          return false
        }
      }
    }

    // Validate entity context link groups, if applicable
    if (cidmeResource.hasOwnProperty('cidme:entityContextLinkDataGroups')) {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextLinkDataGroups'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['cidme:entityContextLinkDataGroups'][i]['@id'])['resourceType'] !== 'DataGroup') { return false }
        if (!this.validate(cidmeResource['cidme:entityContextLinkDataGroups'][i])) {
          // this.debugOutput('  -- ENTITY CONTEXT LINK GROUPS VALIDATION ERROR!');
          return false
        }
      }
    }

    // Validate entity context data groups, if applicable
    if (cidmeResource.hasOwnProperty('cidme:entityContextDataGroups')) {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextDataGroups'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['cidme:entityContextDataGroups'][i]['@id'])['resourceType'] !== 'DataGroup') { return false }
        if (!this.validate(cidmeResource['cidme:entityContextDataGroups'][i])) {
          // this.debugOutput('  -- ENTITY CONTEXT DATA GROUPS VALIDATION ERROR!');
          return false
        }
      }
    }

    // Validate entity subcontexts, if applicable
    if (cidmeResource.hasOwnProperty('cidme:entityContexts')) {
      for (let i:number = 0; i < cidmeResource['cidme:entityContexts'].length; i++) {
        if (this.parseCidmeUri(cidmeResource['cidme:entityContexts'][i]['@id'])['resourceType'] !== 'EntityContext') { return false }
        if (!this.validate(cidmeResource['cidme:entityContexts'][i])) {
          // this.debugOutput('  -- ENTITY CONTEXT VALIDATION ERROR!');
          return false
        }
      }
    }

    return true
  }


  /**
   * Validates a CIDME resource type name
   * @param {string} resourceType
   * @returns {boolean}
   */
  validateResourceType (resourceType:string):boolean {
    if (this['resourceTypes'].indexOf(resourceType) >= 0) { return true }

    return false
  }
  
  /* ********************************************************************** */


  /* ********************************************************************** */
  // CIDME RESOURCE CREATION FUNCTIONS


  /**
   * Returns a CIDME entity resource.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
   * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
   * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
   * @returns {object}
   */
  createEntityResource (options:Options):CidmeResource {
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
      '@context': {
          'cidme': this['rdfVocabs']['cidme']['url'],
          'rdf': this['rdfVocabs']['rdf']['url'],
      },
      '@type': this['rdfVocabs']['cidme']['prefix'] + ':Entity',
      '@id': this.getCidmeUri('Entity', idUuid)
    }

    // Add metaData?
    let createMetaData:boolean = true
    if (!options) {} else {
      if (options['createMetaData'] === false) { createMetaData = false }
    }
    if (createMetaData === true) {
      let metaDataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metaDataOptions['creatorId'] = options['creatorId']
      }
      entity = this.addCreatedMetaDataToResource(entity['@id'], entity, metaDataOptions)
      entity = this.addLastModifiedMetaDataToResource(entity['@id'], entity, metaDataOptions)
    }

    // Validate the resource.
    if (!this.validate(entity)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entity
  }


  /**
   * Add a MetaDataGroup resource to an existing resource with a type of CreatedMetaData.
   * @param {string} parentId - The '@id' from the parent resource.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
   * @returns {object}
   */
  addCreatedMetaDataToResource (parentId:string, cidmeResource:CidmeResource, options:Options):CidmeResource {
    let isoDate:any = new Date()

    let creatorId:string|null = null
    if (!options || !options['creatorId']) {} else { creatorId = options['creatorId'] }
    if (creatorId) {}

    let newOptions:Options = {}
    newOptions['createMetaData'] = false

    newOptions['data'] = [  
      this.createRdfDataResource(
        [
          this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
        ],
        {
          '@context': {[this['rdfVocabs']['rdf']['prefix']]: this['rdfVocabs']['rdf']['url']},
          '@id': this['rdfVocabs']['rdf']['prefix'] + ':type'
        },
        {
          '@context': {[this['rdfVocabs']['cidme']['prefix']]: this['rdfVocabs']['cidme']['url']},
          '@id': this['rdfVocabs']['cidme']['prefix'] + ':CreatedMetaData'
        }
      ),
      this.createRdfDataResource(
        [
          this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
        ],
        {
          '@context': {[this['rdfVocabs']['dc']['prefix']]: this['rdfVocabs']['dc']['url']},
          '@id': this['rdfVocabs']['dc']['prefix'] + ':created'
        },
        {
          '@value': isoDate.toISOString()
        }
      )      
    ]

    if (creatorId) {
      newOptions['data'].push(
        this.createRdfDataResource(
          [
            this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
          ],
          {
            '@context': {[this['rdfVocabs']['dc']['prefix']]: this['rdfVocabs']['dc']['url']},
            '@id': this['rdfVocabs']['dc']['prefix'] + ':creator'
          },
          {
            '@value': creatorId
          }
        )
      )
    }

    let createdMetaDataGroupResource:CidmeResource = this.createMetaDataGroupResource(newOptions)

    // Validate the resource.
    if (!this.validate(createdMetaDataGroupResource)) {
      throw new Error('ERROR:  An error occured while validating the new MetaData resource.')
    }

    cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetaDataGroupResource, this['rdfVocabs']['cidme']['prefix'] + ':metaDataGroups')

    return cidmeResource
  }


  /**
   * Add a MetaDataGroup resource to an existing resource with a type of LastModifiedMetaData.
   * @param {string} parentId - The '@id' from the parent resource.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
   * @returns {object}
   */
  addLastModifiedMetaDataToResource (parentId:string, cidmeResource:CidmeResource, options:Options):CidmeResource {
    let isoDate:any = new Date()

    let creatorId:string|null = null
    if (!options || !options['creatorId']) {} else { creatorId = options['creatorId'] }
    if (creatorId) {}

    let newOptions:Options = {}
    newOptions['createMetaData'] = false

    newOptions['data'] = [  
      this.createRdfDataResource(
        [
          this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
        ],
        {
          '@context': {[this['rdfVocabs']['rdf']['prefix']]: this['rdfVocabs']['rdf']['url']},
          '@id': this['rdfVocabs']['rdf']['prefix'] + ':type'
        },
        {
          '@context': {[this['rdfVocabs']['cidme']['prefix']]: this['rdfVocabs']['cidme']['url']},
          '@id': this['rdfVocabs']['cidme']['prefix'] + ':LastModifiedMetaData'
        }
      ),
      this.createRdfDataResource(
        [
          this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
        ],
        {
          '@context': {[this['rdfVocabs']['dc']['prefix']]: this['rdfVocabs']['dc']['url']},
          '@id': this['rdfVocabs']['dc']['prefix'] + ':modified'
        },
        {
          '@value': isoDate.toISOString()
        }
      )      
    ]

    if (creatorId) {
      newOptions['data'].push(
        this.createRdfDataResource(
          [
            this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
          ],
          {
            '@context': {[this['rdfVocabs']['dc']['prefix']]: this['rdfVocabs']['dc']['url']},
            '@id': this['rdfVocabs']['dc']['prefix'] + ':creator'
          },
          {
            '@value': creatorId
          }
        )
      )
    }

    let createdMetaDataGroupResource:CidmeResource = this.createMetaDataGroupResource(newOptions)

    // Validate the resource.
    if (!this.validate(createdMetaDataGroupResource)) {
      throw new Error('ERROR:  An error occured while validating the new MetaData resource.')
    }

    cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetaDataGroupResource, this['rdfVocabs']['cidme']['prefix'] + ':metaDataGroups')

    return cidmeResource
  }


  /**
   * Returns a CIDME entity context resource.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
   * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
   * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
   * @returns {object}
   */
  createEntityContextResource (options:Options):CidmeResource {
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
      '@context': {
        [this['rdfVocabs']['cidme']['prefix']]: this['rdfVocabs']['cidme']['url'],
        [this['rdfVocabs']['rdf']['prefix']]: this['rdfVocabs']['rdf']['url'],
      },
      '@type': this['rdfVocabs']['cidme']['prefix'] + ':EntityContext',
      '@id': this.getCidmeUri('EntityContext', idUuid)
    }

    // Add metaData?
    let createMetaData:boolean = true
    if (!options) {} else {
      if (options['createMetaData'] === false) { createMetaData = false }
    }
    if (createMetaData === true) {
      let metaDataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metaDataOptions['creatorId'] = options['creatorId']
      }
      entityContext = this.addCreatedMetaDataToResource(entityContext['@id'], entityContext, metaDataOptions)
      entityContext = this.addLastModifiedMetaDataToResource(entityContext['@id'], entityContext, metaDataOptions)
    }

    // Validate the resource.
    if (!this.validate(entityContext)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entityContext
  }


  /**
   * Returns a CIDME RdfData resource.
   * @param {array} type - An array of one or more strings to include in the '@type' property of the RdfData resource.  NOTE:  cidme:RdfData and rdf:statement will already be included.
   * @param {CidmeRdfPredicate} rdfPredicate - An object containing RDF predicate information.
   * @param {CidmeRdfObjectUri|CidmeRdfObjectJsonValue} rdfObject - An object containing RDF object information.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
   * @returns {object}
   */
  createRdfDataResource (type:Array<String>, rdfPredicate:CidmeRdfPredicate, rdfObject:CidmeRdfObjectUri|CidmeRdfObjectJsonValue, options:Options = {}):CidmeRdfDataResource {
    // Is this a brand new resource?
    let newResource:boolean = false
    if (!options['id']) {newResource = true}
    
    // Determine resource UUID.
    var idUuid:string 
    if (newResource === true) {
      idUuid = this['uuidGenerator'].genV4().hexString
    } else {
      idUuid = String(options['id'])
    }

    type.push(this['rdfVocabs']['rdf']['prefix'] + ':statement')
    type.push(this['rdfVocabs']['cidme']['prefix'] + ':RdfData')

    // Create the resource.
    let rdfData:CidmeRdfDataResource = {
      '@type': type,
      '@id': this.getCidmeUri('RdfData', idUuid),
      'rdf:predicate': rdfPredicate,
      'rdf:object': rdfObject
    }

    //console.log(rdfData)

    // Validate the resource.
    if (!this.validate(rdfData)) {
      throw new Error('ERROR:  An error occured while validating the new RdfData resource.')
    }

    return rdfData
  }


  /**
   * Returns a CIDME metaData resource.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
   * @param {CidmeRdfDataResource} [options.data] - RDF data to be added to the cidme:data[] array.
   * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
   * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
   * @returns {object}
   */
  createMetaDataGroupResource (options:Options):CidmeResource {
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
    let metaData:CidmeResource = {
      '@type': this['rdfVocabs']['cidme']['prefix'] + ':MetaDataGroup',
      '@id': this.getCidmeUri('DataGroup', idUuid)
    }

    if (!options || !options['data']) {} else {
      metaData['cidme:data'] = options['data']

      //console.log(metaData)

      // Validate the resource.
      if (!this.validate(metaData)) {
        throw new Error('ERROR:  x2An error occured while validating the new resource.')
      }
    }

    // Add metaData?
    let createMetaData:boolean = true
    if (!options) {} else {
      if (options['createMetaData'] === false) { createMetaData = false }
    }
    if (createMetaData === true) {
      let metaDataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metaDataOptions['creatorId'] = options['creatorId']
      }
      metaData = this.addCreatedMetaDataToResource(metaData['@id'], metaData, metaDataOptions)
      metaData = this.addLastModifiedMetaDataToResource(metaData['@id'], metaData, metaDataOptions)
    }

    // Validate the resource.
    if (!this.validate(metaData)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return metaData
  }


  /**
   * Returns a CIDME entity context data group resource.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
   * @param {CidmeRdfDataResource} [options.data] - RDF data to be added to the cidme:data[] array.
   * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
   * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
   * @returns {object}
   */
  createEntityContextDataGroupResource (options:Options):CidmeResource {
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
      '@type': this['rdfVocabs']['cidme']['prefix'] + ':EntityContextDataGroup',
      '@id': this.getCidmeUri('DataGroup', idUuid)
    }

    // If we were given data, add it.
    if (!options || !options['data']) {} else {
      entityContextData['cidme:data'] = options['data']

      // Validate the resource.
      if (!this.validate(entityContextData)) {
        throw new Error('ERROR:  An error occured while validating the new resource.')
      }
    }

    // Add metaData?
    let createMetaData:boolean = true
    if (!options) {} else {
      if (options['createMetaData'] === false) { createMetaData = false }
    }
    if (createMetaData === true) {
      let metaDataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metaDataOptions['creatorId'] = options['creatorId']
      }
      entityContextData = this.addCreatedMetaDataToResource(entityContextData['@id'], entityContextData, metaDataOptions)
      entityContextData = this.addLastModifiedMetaDataToResource(entityContextData['@id'], entityContextData, metaDataOptions)
    }

    // Validate the resource.
    if (!this.validate(entityContextData)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entityContextData
  }


  /**
   * Returns a CIDME entity context link data group resource.
   * @param {object[]} [options] - An optional object containing optional values.
   * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
   * @param {CidmeRdfDataResource} [options.data] - RDF data to be added to the cidme:data[] array.
   * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
   * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
   * @returns {object}
   */
  createEntityContextLinkDataGroupResource (options:Options):CidmeResource {
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
      '@type': this['rdfVocabs']['cidme']['prefix'] + ':EntityContextLinkDataGroup',
      '@id': this.getCidmeUri('DataGroup', idUuid)
    }

    if (!options || !options['data']) {} else {
      entityContextLink['cidme:data'] = options['data']

      // Validate the resource.
      if (!this.validate(entityContextLink)) {
        throw new Error('ERROR:  An error occured while validating the new resource.')
      }
    }

    // Add metaData?
    let createMetaData:boolean = true
    if (!options) {} else {
      if (options['createMetaData'] === false) { createMetaData = false }
    }
    if (createMetaData === true) {
      let metaDataOptions:Options = {}
      if (!options || !options['creatorId']) {} else {
        metaDataOptions['creatorId'] = options['creatorId']
      }
      entityContextLink = this.addCreatedMetaDataToResource(entityContextLink['@id'], entityContextLink, metaDataOptions)
      entityContextLink = this.addLastModifiedMetaDataToResource(entityContextLink['@id'], entityContextLink, metaDataOptions)
    }

    //console.log(JSON.stringify(entityContextLink))

    // Validate the resource.
    if (!this.validate(entityContextLink)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return entityContextLink
  }

  /* ********************************************************************** */


  /* ********************************************************************** */
  // CIDME RESOURCE MANIPULATION FUNCTIONS


  /**
   * Adds a CIDME resource to another CIDME resource.  The resource is added to the appropriate place by specifying the parent ID to add to.  The type of resource to add is specified as well, indicating whether we're adding a MetaDataGroup, an EntityContext, or another type of resource.
   * @param {string} parentId - The '@id' of the resource to add to.
   * @param {object} cidmeResource - CIDME resource to add to.
   * @param {object} resourceToAdd - The resource to add.
   * @returns {object}
   */
  addResourceToParent (parentId:string, cidmeResource:CidmeResource, resourceToAdd:CidmeResource, dataTypeToAdd?:string):CidmeResource {
    if (!resourceToAdd || !this.validate(resourceToAdd)) {
      throw new Error('ERROR:  Missing or invalid resourceToAdd.')
    }
    let resourceToAddType:string = this.parseCidmeUri(resourceToAdd['@id'])['resourceType']

    if (!parentId || !cidmeResource || !resourceToAddType || !resourceToAdd) {
      throw new Error('ERROR:  Missing or invalid argument.')
    }

    if (cidmeResource['@id'] === parentId) {
      if (resourceToAddType === 'DataGroup') {
        if (!dataTypeToAdd) {
          throw new Error('ERROR:  Missing or invalid dataTypeToAdd argument.')
        } 
        cidmeResource = this.addDataGroupToResource(cidmeResource, dataTypeToAdd, resourceToAdd)
      } else if (resourceToAddType === 'MetaDataGroup') {
        cidmeResource = this.addMetaDataGroupToResource(cidmeResource, resourceToAdd)
      } else if (resourceToAddType === 'EntityContext') {
        cidmeResource = this.addEntityContextToResource(cidmeResource, resourceToAdd)
      } else if (resourceToAddType === 'EntityContextLinkDataGroup') {
        cidmeResource = this.addEntityContextLinkDataGroupToResource(cidmeResource, resourceToAdd)
      } else if (resourceToAddType === 'EntityContextDataGroup') {
        cidmeResource = this.addEntityContextDataGroupToResource(cidmeResource, resourceToAdd)
      } else {
        throw new Error('ERROR:  Invalid resourceToAddType.')
      }
    }

    // Cycle through metaDataGroups
    if (cidmeResource['cidme:metaDataGroups']) {
      for (let i:number = 0; i < cidmeResource['cidme:metaDataGroups'].length; i++) {
        cidmeResource['cidme:metaDataGroups'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:metaDataGroups'][i], resourceToAdd, dataTypeToAdd)
      }
    }

    // Cycle through entityContexts
    if (cidmeResource['cidme:entityContexts']) {
      for (let i:number = 0; i < cidmeResource['cidme:entityContexts'].length; i++) {
        cidmeResource['cidme:entityContexts'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:entityContexts'][i], resourceToAdd, dataTypeToAdd)
      }
    }

    // Cycle through entityContextDataGroups
    if (cidmeResource['cidme:entityContextDataGroups']) {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextDataGroups'].length; i++) {
        cidmeResource['cidme:entityContextDataGroups'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:entityContextDataGroups'][i], resourceToAdd, dataTypeToAdd)
      }
    }

    // Cycle through entityContextLinkataGroups
    if (cidmeResource['cidme:entityContextLinkDataGroups']) {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextLinkDataGroups'].length; i++) {
        cidmeResource['cidme:entityContextLinkDataGroups'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:entityContextLinkDataGroups'][i], resourceToAdd, dataTypeToAdd)
      }
    }

    return cidmeResource
  }


  /**
   * Adds a DataGroup to an existing CIDME resource.
   * @param {object} cidmeResource - CIDME resource to add DataGroup to.
   * @param {object} dataGroup - DataGroup resource to add to CIDME resource.
   * @param {object} dataTypeToAdd - 'cidme:metaDataGroups' or 'cidme:entityContextDataGroups' or 'cidme:entityContextLinkDataGroups'
   * @returns {object}
   */
  addDataGroupToResource (cidmeResource:CidmeResource, dataTypeToAdd:string, dataGroup:CidmeResource):CidmeResource {
    if (!cidmeResource ||
            !dataGroup ||
            !this.validate(cidmeResource) ||
            !this.validate(dataGroup) ||
            this.parseCidmeUri(dataGroup['@id'])['resourceType'] !== 'DataGroup'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    if (dataTypeToAdd === 'cidme:metaDataGroups') {
      if (!cidmeResource['cidme:metaDataGroups']) {
        cidmeResource['cidme:metaDataGroups'] = []
      }

      cidmeResource['cidme:metaDataGroups'].push(dataGroup)
    } else if (dataTypeToAdd === 'cidme:entityContextDataGroups') {
        if (!cidmeResource['cidme:entityContextDataGroups']) {
          cidmeResource['cidme:entityContextDataGroups'] = []
        }
  
        cidmeResource['cidme:entityContextDataGroups'].push(dataGroup)
    } else if (dataTypeToAdd === 'cidme:entityContextLinkDataGroups') {
        if (!cidmeResource['cidme:entityContextLinkDataGroups']) {
          cidmeResource['cidme:entityContextLinkDataGroups'] = []
        }
  
        cidmeResource['cidme:entityContextLinkDataGroups'].push(dataGroup)
  
    } else {
      throw new Error('ERROR:  dataTypeToAdd argument is invalid.')
    }

    // Validate the resource.
    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return cidmeResource
  }


  /**
   * Adds a MetaDataGroup to an existing CIDME resource.
   * @param {object} cidmeResource - CIDME resource to add MetaDataGroup to.
   * @param {object} metaDataGroup - MetaDataGroup resource to add to CIDME resource.
   * @returns {object}
   */
  addMetaDataGroupToResource (cidmeResource:CidmeResource, metaDataGroup:CidmeResource):CidmeResource {
    if (!cidmeResource ||
            !metaDataGroup ||
            !this.validate(cidmeResource) ||
            !this.validate(metaDataGroup) ||
            this.parseCidmeUri(metaDataGroup['@id'])['resourceType'] !== 'DataGroup'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    // DO NOT REMOVE OR REPLACE 'cidme:' text below or you will incur a Typescript error...
    if (!cidmeResource['cidme:metaDataGroups']) {
      // DO NOT REMOVE OR REPLACE 'cidme:' text below or you will incur a Typescript error...
      cidmeResource['cidme:metaDataGroups'] = []
    }

    // DO NOT REMOVE OR REPLACE 'cidme:' text below or you will incur a Typescript error...
    cidmeResource['cidme:metaDataGroups'].push(metaDataGroup)

    // Validate the resource.
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

    if (!cidmeResource['cidme:entityContexts']) {
      cidmeResource['cidme:entityContexts'] = []
    }

    cidmeResource['cidme:entityContexts'].push(entityContext)

    // Validate the resource.
    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return cidmeResource
  }


  /**
   * Adds an EntityContextLinkDataGroup to an existing CIDME resource.
   * @param {object} cidmeResource - CIDME resource to add EntityContextLinkDataGroup to.
   * @param {object} entityContextLinkDataGroup - EntityContextLinkDataGroup resource to add to CIDME resource.
   * @returns {object}
   */
  addEntityContextLinkDataGroupToResource (cidmeResource:CidmeResource, entityContextLinkDataGroup:CidmeResource):CidmeResource {
    if (!cidmeResource ||
            !entityContextLinkDataGroup ||
            !this.validate(entityContextLinkDataGroup) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContextLinkDataGroup['@id'])['resourceType'] !== 'DataGroup'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    if (!cidmeResource['cidme:entityContextLinkDataGroups']) {
      cidmeResource['cidme:entityContextLinkDataGroups'] = []
    }

    cidmeResource['cidme:entityContextLinkDataGroups'].push(entityContextLinkDataGroup)

    // Validate the resource.
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
            this.parseCidmeUri(entityContextDataGroup['@id'])['resourceType'] !== 'DataGroup'
    ) {
      throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.')
    }

    if (!cidmeResource['cidme:entityContextDataGroups']) {
      cidmeResource['cidme:entityContextDataGroups'] = []
    }

    cidmeResource['cidme:entityContextDataGroups'].push(entityContextDataGroup)

    // Validate the resource.
    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  An error occured while validating the new resource.')
    }

    return cidmeResource
  }


  /**
   * Deletes a CIDME resource from a CIDME resource.  
   * @param {string} resourceId - The '@id' of the resource to delete.
   * @param {object} cidmeResource - CIDME resource to delete from.
   * @returns {(object)}
   */
  deleteResource (resourceId:string, cidmeResource:CidmeResource):CidmeResource {
    if (!resourceId || !cidmeResource) {
      throw new Error('ERROR:  Missing or invalid argument.')
    }

    if (cidmeResource['@id'] === resourceId) {
        throw new Error('ERROR:  Can not delete top level resource.')
    }

    if (!cidmeResource['cidme:metaDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:metaDataGroups']?.length; i++) {
        if (cidmeResource['cidme:metaDataGroups'][i]['@id'] === resourceId) {
          cidmeResource['cidme:metaDataGroups'].splice(i, 1)
          i++;
        } else {
          // Recursively check metaDataGroups
          cidmeResource['cidme:metaDataGroups'][i] = this.deleteResource(resourceId, cidmeResource['cidme:metaDataGroups'][i])

          // TypeScript REALLY hates this code block.  Hence the excessive use of exclaimation point/bangs ('!') as well as excessive checks in the initial if block.
          if (
            !cidmeResource['cidme:metaDataGroups'][i]['cidme:data'] 
            || !Array.isArray(cidmeResource['cidme:metaDataGroups'][i]['cidme:data'])
            || cidmeResource['cidme:metaDataGroups'][i]['cidme:data']!.length < 1
            ) {} else {
            for (let i2:number = 0; i2 < cidmeResource['cidme:metaDataGroups'][i]['cidme:data']!.length; i2++) {
              if (cidmeResource['cidme:metaDataGroups'][i]['cidme:data']![i2]['@id'] === resourceId) {
                cidmeResource['cidme:metaDataGroups'][i]['cidme:data']!.splice(i2, 1)
                i2++;
              }
            }

            if (cidmeResource['cidme:metaDataGroups'][i]['cidme:data']!.length < 1) {
              delete cidmeResource['cidme:metaDataGroups'][i]['cidme:data']
            }
          }
        }
      }

      if (cidmeResource['cidme:metaDataGroups'].length < 1) {
        delete cidmeResource['cidme:metaDataGroups']
      }
    }

    if (!cidmeResource['cidme:entityContexts']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContexts']?.length; i++) {
        if (cidmeResource['cidme:entityContexts'][i]['@id'] === resourceId) {
          cidmeResource['cidme:entityContexts'].splice(i, 1)
          i++;
        } else {
          // Recursively check entityContexts
          cidmeResource['cidme:entityContexts'][i] = this.deleteResource(resourceId, cidmeResource['cidme:entityContexts'][i])
        }
      }

      if (cidmeResource['cidme:entityContexts'].length < 1) {
        delete cidmeResource['cidme:entityContexts']
      }
    }

    if (!cidmeResource['cidme:entityContextDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextDataGroups']?.length; i++) {
        if (cidmeResource['cidme:entityContextDataGroups'][i]['@id'] === resourceId) {
          cidmeResource['cidme:entityContextDataGroups'].splice(i, 1)
          i++;
        } else {
          // Recursively check entityContextDataGroups
          cidmeResource['cidme:entityContextDataGroups'][i] = this.deleteResource(resourceId, cidmeResource['cidme:entityContextDataGroups'][i])

          // TypeScript REALLY hates this code block.  Hence the excessive use of exclaimation point/bangs ('!') as well as excessive checks in the initial if block.
          if (
            !cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'] 
            || !Array.isArray(cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'])
            || cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data']!.length < 1
          ) {} else {
            for (let i2:number = 0; i2 < cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data']!.length; i2++) {
              if (cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data']![i2]['@id'] === resourceId) {
                cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data']!.splice(i2, 1)
                i2++;
              }
            }

            if (cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data']!.length < 1) {
              delete cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data']
            }
          }
        }
      }

      if (cidmeResource['cidme:entityContextDataGroups'].length < 1) {
        delete cidmeResource['cidme:entityContextDataGroups']
      }
    }

    if (!cidmeResource['cidme:entityContextLinkDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextLinkDataGroups']?.length; i++) {
        if (cidmeResource['cidme:entityContextLinkDataGroups'][i]['@id'] === resourceId) {
          cidmeResource['cidme:entityContextLinkDataGroups'].splice(i, 1)
          i++;
        } else {
          // Recursively check entityContextLinkDataGroups
          cidmeResource['cidme:entityContextLinkDataGroups'][i] = this.deleteResource(resourceId, cidmeResource['cidme:entityContextLinkDataGroups'][i])

          // TypeScript REALLY hates this code block.  Hence the excessive use of exclaimation point/bangs ('!') as well as excessive checks in the initial if block.
          if (
            !cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'] 
            || !Array.isArray(cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'])
            || cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data']!.length < 1
          ) {} else {
            for (let i2:number = 0; i2 < cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data']!.length; i2++) {
              if (cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data']![i2]['@id'] === resourceId) {
                cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data']!.splice(i2, 1)
                i2++;
              }
            }

            if (cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data']!.length < 1) {
              delete cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data']
            }
          }
        }
      }

      if (cidmeResource['cidme:entityContextLinkDataGroups'].length < 1) {
        delete cidmeResource['cidme:entityContextLinkDataGroups']
      }
    }

    return cidmeResource
  }
  /* ********************************************************************** */


  /* ********************************************************************** */
  // CIDME SQL FUNCTIONS


  async getSqlJsonForResource (parentId:string|null = null, cidmeResource:CidmeResource, retSql:any = [], sqlDialect:string = 'sqlite'): Promise<any> {

    // Make sure we have a valid CIDME resource
    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  Invalid passed CIDME resource.')
    }

    if (cidmeResource['@type'] !== 'Entity' && parentId === null) {
      throw new Error('ERROR:  Invalid passed parentId argument.')
    }

    let resourceIdParsed:CidmeUri = this.parseCidmeUri(cidmeResource['@id'])

    let retSqlNewItem:any = {}

    // @ts-ignore
    //if (sqlDialect.toLowerCase === 'sqlite') {

    // Get the SQL for the JSON-LD node itself
    if (sqlDialect === 'sqlite') {
      retSqlNewItem.sqlValues = {}
      retSqlNewItem.sqlQueryType = 'REPLACE'
      retSqlNewItem.sqlQuery = []
      retSqlNewItem.sqlQuery[0] = {'type': 'text', 'text': 'REPLACE INTO nodes ('}
      retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'value', 'key': 'id'}
      retSqlNewItem.sqlValues.id = resourceIdParsed['id']
      retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'value', 'key': 'parent_id'}
      if (parentId === null) {
        retSqlNewItem.sqlValues.parent_id = null;
      } else {
        let parentIdParsed:CidmeUri = this.parseCidmeUri(parentId)
        retSqlNewItem.sqlValues.parent_id = parentIdParsed['id']
      }
      retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'value', 'key': 'context'}
      retSqlNewItem.sqlValues.context = cidmeResource['@context']
      retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'value', 'key': 'type'}
      retSqlNewItem.sqlValues.type = cidmeResource['@type']

      if (
        cidmeResource['@type'] === 'MetaDataGroup' ||
        cidmeResource['@type'] === 'EntityContextDataGroup' ||
        cidmeResource['@type'] === 'EntityContextLinkDataGroup'
      ) {
        retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'value', 'key': 'data'}

        // TODO TODO TODO
        /*
        if (
          cidmeResource.hasOwnProperty('data')
        ) {
          retSqlNewItem.sqlValues.data = JSON.stringify(cidmeResource['data'])
        } else {
          retSqlNewItem.sqlValues.data = null;
        }
         */
      }

      retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'text', 'text': ') VALUES ('}
      retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'valuesPlaceholder'}
      retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = {'type': 'text', 'text': ')'}

      //console.log(retSqlNewItem)
    }

    retSql.push(retSqlNewItem)

    // /*
    // Get the SQL for the JSON-LD data in the data element, if applicable

    // TODO TODO TODO

    if (!cidmeResource['cidme:metaDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:metaDataGroups']?.length; i++) {
        try {
          retSql = await this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:metaDataGroups'][i], retSql)
        } catch (err) {
          throw new Error('ERROR:  Error creating SQL JSON:  ' + err.message)
        }
      }
    }

    if (!cidmeResource['cidme:entityContexts']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContexts']?.length; i++) {
        try {
          retSql = await this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:entityContexts'][i], retSql)
        } catch (err) {
          throw new Error('ERROR:  Error creating SQL JSON:  ' + err.message)
        }

      }
    }

    if (!cidmeResource['cidme:entityContextDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextDataGroups']?.length; i++) {
        try {
          retSql = await this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:entityContextDataGroups'][i], retSql)
        } catch (err) {
          throw new Error('ERROR:  Error creating SQL JSON:  ' + err.message)
        }

      }
    }

    if (!cidmeResource['cidme:entityContextLinkDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextLinkDataGroups']?.length; i++) {
        try {
          retSql = await this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:entityContextLinkDataGroups'][i], retSql)
        } catch (err) {
          throw new Error('ERROR:  Error creating SQL JSON:  ' + err.message)
        }
      }
    }
    
    return retSql;
  }

  /* ********************************************************************** */


  /* ********************************************************************** */
  // HELPER FUNCTIONS


  /**
   * Return a portion (or all) of a cidmeResource based on the requested resourceId.
   * @param {string} resourceId - The '@id' of the resource to get.
   * @param {object} cidmeResource - CIDME resource to search through.
   * @returns {(boolean|object)}
   */
  getResourceById (resourceId:string, cidmeResource:CidmeResource):CidmeResource | boolean {
    if (!resourceId || !cidmeResource ) {
      throw new Error('ERROR:  Missing or invalid argument.')
    }

    // Make sure we have a valid CIDME resource
    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  Invalid passed CIDME resource.')
    }

    // Make sure we have a valid CIDME resource ID
    try {
      let resourceIdParsed:CidmeUri = this.parseCidmeUri(resourceId)

      /* Stop StandardJS from complaining */
      if (resourceIdParsed) { /* */ }

    } catch (err) {
      throw new Error('ERROR:  Invalid passed CIDME resource ID.')
    }
    
    let returnVal: CidmeResource | boolean;

    if (cidmeResource['@id'] === resourceId) {
      return cidmeResource;
    }

    if (!cidmeResource['cidme:metaDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:metaDataGroups']?.length; i++) {
        returnVal = this.getResourceById(resourceId, cidmeResource['cidme:metaDataGroups'][i])
        if (!returnVal) {} else {return returnVal;}
      }
    }

    if (!cidmeResource['cidme:entityContexts']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContexts']?.length; i++) {
        returnVal = this.getResourceById(resourceId, cidmeResource['cidme:entityContexts'][i])
        if (!returnVal) {} else {return returnVal;}
      }
    }

    if (!cidmeResource['cidme:entityContextDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextDataGroups']?.length; i++) {
        returnVal = this.getResourceById(resourceId, cidmeResource['cidme:entityContextDataGroups'][i])
        if (!returnVal) {} else {return returnVal;}
      }
    }

    if (!cidmeResource['cidme:entityContextLinkDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextLinkDataGroups']?.length; i++) {
        returnVal = this.getResourceById(resourceId, cidmeResource['cidme:entityContextLinkDataGroups'][i])
        if (!returnVal) {} else {return returnVal;}
      }
    }

    return false;
  }


  /**
   * Returns an object containing a portion (or all) of a cidmeResource based on the requested resourceId as well as an array containing the 'breadcrumb' path to find the specificed resourceId within the full resource.
   * @param {string} resourceId - The '@id' of the resource to get.
   * @param {object} cidmeResource - CIDME resource to search through.
   * @param {object} [cidmeBreadcrumbs] - CIDME breadcrumbs array for recursive calls, this should NOT be specified for normal calls.
   * @returns {(object|boolean)}
   */
  getResourceByIdWithBreadcrumbs (resourceId:string, cidmeResource:CidmeResource, cidmeBreadcrumbs:Array<any>=[]): any {
    if (!resourceId || !cidmeResource ) {
      throw new Error('ERROR:  Missing or invalid argument.')
    }

    // Make sure we have a valid CIDME resource
    if (!this.validate(cidmeResource)) {
      throw new Error('ERROR:  Invalid passed CIDME resource.')
    }

    // Make sure we have a valid CIDME resource ID
    try {
      let resourceIdParsed:CidmeUri = this.parseCidmeUri(resourceId)

      /* Stop StandardJS from complaining */
      if (resourceIdParsed) { /* */ }
    } catch (err) {
      throw new Error('ERROR:  Invalid passed CIDME resource ID.')
    }

    //if (Array.isArray(cidmeBreadcrumbs) === false) {cidmeBreadcrumbs = [];}

    if (cidmeResource['@id'] === resourceId) {

      cidmeBreadcrumbs.unshift(
        {
          cidmeResourceType:cidmeResource['@type'],
          cidmeResourceId:cidmeResource['@id']
        }
      )

      let returnVal2 = {
        cidmeResource: cidmeResource,
        cidmeBreadcrumbs: cidmeBreadcrumbs
      };

      return returnVal2;
    }

    if (!cidmeResource['cidme:metaDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:metaDataGroups']?.length; i++) {
        let returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:metaDataGroups'][i], cidmeBreadcrumbs);
        if (!returnVal) {} else {
          cidmeBreadcrumbs.unshift(
            {
              cidmeResourceType:cidmeResource['@type'],
              cidmeResourceId:cidmeResource['@id']
            }
          );

          let returnVal2 = {
            cidmeResource: returnVal['cidmeResource'],
            cidmeBreadcrumbs: cidmeBreadcrumbs
          };

          return returnVal2;
        }
      }
    }

    if (!cidmeResource['cidme:entityContexts']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContexts']?.length; i++) {
        let returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:entityContexts'][i], cidmeBreadcrumbs);
        if (!returnVal) {} else {
          cidmeBreadcrumbs.unshift(
            {
              cidmeResourceType:cidmeResource['@type'],
              cidmeResourceId:cidmeResource['@id']
            }
          );

          let returnVal2 = {
            cidmeResource: returnVal['cidmeResource'],
            cidmeBreadcrumbs: cidmeBreadcrumbs
          };

          return returnVal2;
        }
      }
    }

    if (!cidmeResource['cidme:entityContextDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextDataGroups']?.length; i++) {
        let returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:entityContextDataGroups'][i], cidmeBreadcrumbs);
        if (!returnVal) {} else {
          cidmeBreadcrumbs.unshift(
            {
              cidmeResourceType:cidmeResource['@type'],
              cidmeResourceId:cidmeResource['@id']
            }
          );

          let returnVal2 = {
            cidmeResource: returnVal['cidmeResource'],
            cidmeBreadcrumbs: cidmeBreadcrumbs
          };

          return returnVal2;
        }
      }
    }

    if (!cidmeResource['cidme:entityContextLinkDataGroups']) {} else {
      for (let i:number = 0; i < cidmeResource['cidme:entityContextLinkDataGroups']?.length; i++) {
        let returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:entityContextLinkDataGroups'][i], cidmeBreadcrumbs);
        if (!returnVal) {} else {
          cidmeBreadcrumbs.unshift(
            {
              cidmeResourceType:cidmeResource['@type'],
              cidmeResourceId:cidmeResource['@id']
            }
          );

          let returnVal2 = {
            cidmeResource: returnVal['cidmeResource'],
            cidmeBreadcrumbs: cidmeBreadcrumbs
          };

          return returnVal2;
        }
      }
    }

    return false;
  }

  /* ********************************************************************** */

  
  /* ********************************************************************** */
  // MISC. FUNCTIONS


  /**
   * Returns a CIDME resource URI given a resourceType , and ID.
   * @param {string} resourceType
   * @param {(string|boolean)} id
   * @returns {string}
   */
  getCidmeUri (resourceType:string, id:string):string {
    if (!this.validateResourceType(resourceType)) {
      throw new Error('ERROR:  Invalid resourceType specified.')
    }

    if (
      !this['uuidGenerator'].parse(id) ||
            this['uuidGenerator'].parse(id) === null
    ) {
      throw new Error('ERROR:  Invalid id specified.')
    }

    return 'cidme://' + resourceType + '/' + id
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
    this.getCidmeUri(String(id.split('/')[2]), String(id.split('/')[3]))

    return {
      'resourceType': String(id.split('/')[2]),
      'id': String(id.split('/')[3])
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
