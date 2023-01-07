/**
 * @file Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.6.0.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2023
 * @license MIT
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.6.0.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2023
 * @license MIT
 * @version 0.6.1
 */
var Cidme = /** @class */ (function () {
    /**
     * CIDME class constructor
     * @constructor
     * @param {ConstructorOptions} constructorOptions - An object containing arguments.
     * @param {object} constructorOptions.jsonSchemaValidator - An instance of an Ajv compatible JSON schema validator (https://ajv.js.org/)
     * @param {object} constructorOptions.uuidGenerator - An instance of an LiosK/UUID.js compatible UUID generator (https://github.com/LiosK/UUID.js)
     * @param {boolean} [constructorOptions.debug=false] - Set true to enable debugging
     */
    function Cidme(constructorOptions) {
        // Ensure we have required parameters
        if (!constructorOptions['jsonSchemaValidator'] ||
            !constructorOptions['uuidGenerator'] ||
            typeof constructorOptions['jsonSchemaValidator'] !== 'object' ||
            typeof constructorOptions['uuidGenerator'] !== 'function') {
            throw new Error('Missing required arguments.');
        }
        this['cidmeVersion'] = '0.6.0';
        this['jsonSchemaValidator'] = constructorOptions['jsonSchemaValidator'];
        this['uuidGenerator'] = constructorOptions['uuidGenerator'];
        /**
         * URL of JSON-LD vocab for CIDME resources.
         * @member {string}
         */
        this['jsonLdVocabUrl'] = 'http://cidme.net/vocab/core/' + this['cidmeVersion'] + '/';
        /**
         * URL of JSON-LD context for CIDME resources.
         * @member {string}
         */
        this['jsonLdContext'] = this['jsonLdVocabUrl'] + 'jsonldcontext.json';
        /**
         * Known RDF Vocabs/Taxonomies
         */
        this['rdfVocabs'] = {};
        this['rdfVocabs']['rdf'] = {
            'prefix': 'rdf',
            'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        };
        this['rdfVocabs']['dc'] = {
            'prefix': 'dc',
            'url': 'http://purl.org/dc/terms/'
        };
        this['rdfVocabs']['cidme'] = {
            'prefix': 'cidme',
            'url': this['jsonLdVocabUrl']
        };
        this['rdfVocabs']['cidmeext'] = {
            'prefix': 'cidmeext',
            'url': 'http://cidme.net/vocab/ext/0.1.0/'
        };
        this['rdfVocabs']['skos'] = {
            'prefix': 'skos',
            'url': 'http://www.w3.org/2004/02/skos/core#'
        };
        /**
         * URL of JSON-LD vocab for CIDME resources.
         * @member {string}
         */
        this['jsonLdVocabUrl'] = 'http://cidme.net/vocab/core/' + this['cidmeVersion'] + '/';
        /**
         * URL of JSON-LD context for CIDME resources.
         * @member {string}
         */
        this['jsonLdContext'] = this['jsonLdVocabUrl'] + 'jsonldcontext.json';
        /**
         * Debug status.  Whether to show debug output or not.
         * @member {boolean}
         */
        this['debug'] = true;
        if (!constructorOptions['debug']) {
            this['debug'] = false;
        }
        /**
         * JSON schema for JSON-LD.  Taken from: http://json.schemastore.org/jsonld
         * Original doesn't seem to work when $schema is included...
         * @member {string}
         */
        // this.schema = {"title":"Schema for JSON-LD","$schema":"http://json-schema.org/draft-04/schema#","definitions":{"context":{"additionalProperties":true,"properties":{"@context":{"description":"Used to define the short-hand names that are used throughout a JSON-LD document.","type":["object","string","array","null"]}}},"graph":{"additionalProperties":true,"properties":{"@graph":{"description":"Used to express a graph.","type":["array","object"],"additionalItems":{"anyOf":[{"$ref":"#/definitions/common"}]}}}},"common":{"additionalProperties":{"anyOf":[{"$ref":"#/definitions/common"}]},"properties":{"@id":{"description":"Used to uniquely identify things that are being described in the document with IRIs or blank node identifiers.","type":"string","format":"uri"},"@value":{"description":"Used to specify the data that is associated with a particular property in the graph.","type":["string","boolean","number","null"]},"@language":{"description":"Used to specify the language for a particular string value or the default language of a JSON-LD document.","type":["string","null"]},"@type":{"description":"Used to set the data type of a node or typed value.","type":["string","null","array"]},"@container":{"description":"Used to set the default container type for a term.","type":["string","null"],"enum":["@language","@list","@index","@set"]},"@list":{"description":"Used to express an ordered set of data."},"@set":{"description":"Used to express an unordered set of data and to ensure that values are always represented as arrays."},"@reverse":{"description":"Used to express reverse properties.","type":["string","object","null"],"additionalProperties":{"anyOf":[{"$ref":"#/definitions/common"}]}},"@base":{"description":"Used to set the base IRI against which relative IRIs are resolved","type":["string","null"],"format":"uri"},"@vocab":{"description":"Used to expand properties and values in @type with a common prefix IRI","type":["string","null"],"format":"uri"}}}},"allOf":[{"$ref":"#/definitions/context"},{"$ref":"#/definitions/graph"},{"$ref":"#/definitions/common"}],"type":["object","array"],"additionalProperties":true};
        this['schemaJsonLd'] = { 'title': 'Schema for JSON-LD', 'definitions': { 'context': { 'additionalProperties': true, 'properties': { '@context': { 'description': 'Used to define the short-hand names that are used throughout a JSON-LD document.', 'type': ['object', 'string', 'array', 'null'] } } }, 'graph': { 'additionalProperties': true, 'properties': { '@graph': { 'description': 'Used to express a graph.', 'type': ['array', 'object'], 'additionalItems': { 'anyOf': [{ '$ref': '#/definitions/common' }] } } } }, 'common': { 'additionalProperties': { 'anyOf': [{ '$ref': '#/definitions/common' }] }, 'properties': { '@id': { 'description': 'Used to uniquely identify things that are being described in the document with IRIs or blank node identifiers.', 'type': 'string', 'format': 'uri' }, '@value': { 'description': 'Used to specify the data that is associated with a particular property in the graph.', 'type': ['string', 'boolean', 'number', 'null'] }, '@language': { 'description': 'Used to specify the language for a particular string value or the default language of a JSON-LD document.', 'type': ['string', 'null'] }, '@type': { 'description': 'Used to set the data type of a node or typed value.', 'type': ['string', 'null', 'array'] }, '@container': { 'description': 'Used to set the default container type for a term.', 'type': ['string', 'null'], 'enum': ['@language', '@list', '@index', '@set'] }, '@list': { 'description': 'Used to express an ordered set of data.' }, '@set': { 'description': 'Used to express an unordered set of data and to ensure that values are always represented as arrays.' }, '@reverse': { 'description': 'Used to express reverse properties.', 'type': ['string', 'object', 'null'], 'additionalProperties': { 'anyOf': [{ '$ref': '#/definitions/common' }] } }, '@base': { 'description': 'Used to set the base IRI against which relative IRIs are resolved', 'type': ['string', 'null'], 'format': 'uri' }, '@vocab': { 'description': 'Used to expand properties and values in @type with a common prefix IRI', 'type': ['string', 'null'], 'format': 'uri' } } } }, 'allOf': [{ '$ref': '#/definitions/context' }, { '$ref': '#/definitions/graph' }, { '$ref': '#/definitions/common' }], 'type': ['object', 'array'], 'additionalProperties': true };
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
        };
        /**
         * Set up json schema validator function for JSON-LD validation.
         * @member {object}
         */
        this['validateJsonLd'] = this['jsonSchemaValidator'].compile(this['schemaJsonLd']);
        /**
         * Set up json schema validator function for CIDME resource validation.
         * @member {object}
         */
        this['validateCidme'] = Object(this['jsonSchemaValidator'].compile(this['schemaCidme']));
        /**
         * Array of CIDME resource types
         */
        this['resourceTypes'] = [
            'Entity',
            'EntityContext',
            'DataGroup',
            'RdfData'
        ];
    }
    /* ********************************************************************** */
    // VALIDATION FUNCTIONS
    /**
     * Validate a CIDME resource
     * @param {object} cidmeResource - Validates a JSON-LD string representation of a CIDME resource.
     * @returns {boolean} Success
     */
    Cidme.prototype.validate = function (cidmeResource) {
        // Validate as JSON-LD (via JSON schema validation)
        var validJsonLd = this['validateJsonLd'](cidmeResource);
        if (!validJsonLd) {
            this.debugOutput('- INVALID as JSON-LD!');
            this.debugOutput(this['validateJsonLd'].errors);
            return false;
        }
        else {
            this.debugOutput('- VALID as JSON-LD!');
        }
        // Validate as CIDME (via JSON schema validation)
        var validCidme = this['validateCidme'](cidmeResource);
        if (!validCidme) {
            this.debugOutput('- INVALID as CIDME Schema!');
            this.debugOutput(this['validateCidme'].errors);
            return false;
        }
        else {
            this.debugOutput('- VALID as CIDME Schema!');
        }
        // Validate metaData, if applicable
        if (cidmeResource.hasOwnProperty('cidme:metaDataGroups')) {
            for (var i = 0; i < cidmeResource['cidme:metaDataGroups'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['cidme:metaDataGroups'][i]['@id'])['resourceType'] !== 'DataGroup') {
                    return false;
                }
                if (!this.validate(cidmeResource['cidme:metaDataGroups'][i])) {
                    // this.debugOutput('  -- METADATA VALIDATION ERROR!');
                    return false;
                }
            }
        }
        // Validate entity context link groups, if applicable
        if (cidmeResource.hasOwnProperty('cidme:entityContextLinkDataGroups')) {
            for (var i = 0; i < cidmeResource['cidme:entityContextLinkDataGroups'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['cidme:entityContextLinkDataGroups'][i]['@id'])['resourceType'] !== 'DataGroup') {
                    return false;
                }
                if (!this.validate(cidmeResource['cidme:entityContextLinkDataGroups'][i])) {
                    // this.debugOutput('  -- ENTITY CONTEXT LINK GROUPS VALIDATION ERROR!');
                    return false;
                }
            }
        }
        // Validate entity context data groups, if applicable
        if (cidmeResource.hasOwnProperty('cidme:entityContextDataGroups')) {
            for (var i = 0; i < cidmeResource['cidme:entityContextDataGroups'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['cidme:entityContextDataGroups'][i]['@id'])['resourceType'] !== 'DataGroup') {
                    return false;
                }
                if (!this.validate(cidmeResource['cidme:entityContextDataGroups'][i])) {
                    // this.debugOutput('  -- ENTITY CONTEXT DATA GROUPS VALIDATION ERROR!');
                    return false;
                }
            }
        }
        // Validate entity subcontexts, if applicable
        if (cidmeResource.hasOwnProperty('cidme:entityContexts')) {
            for (var i = 0; i < cidmeResource['cidme:entityContexts'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['cidme:entityContexts'][i]['@id'])['resourceType'] !== 'EntityContext') {
                    return false;
                }
                if (!this.validate(cidmeResource['cidme:entityContexts'][i])) {
                    // this.debugOutput('  -- ENTITY CONTEXT VALIDATION ERROR!');
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Validates a CIDME resource type name
     * @param {string} resourceType
     * @returns {boolean}
     */
    Cidme.prototype.validateResourceType = function (resourceType) {
        if (this['resourceTypes'].indexOf(resourceType) >= 0) {
            return true;
        }
        return false;
    };
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
    Cidme.prototype.createEntityResource = function (options) {
        // Is this a brand new resource?
        var newResource = false;
        if (!options || !options['id']) {
            newResource = true;
        }
        // Determine resource UUID.
        var idUuid;
        if (newResource === true) {
            idUuid = this['uuidGenerator'].genV4().hexString;
        }
        else {
            idUuid = String(options['id']);
        }
        var entity = {
            '@context': {
                'cidme': this['rdfVocabs']['cidme']['url'],
                'rdf': this['rdfVocabs']['rdf']['url']
            },
            '@type': this['rdfVocabs']['cidme']['prefix'] + ':Entity',
            '@id': this.getCidmeUri('Entity', idUuid)
        };
        // Add metaData?
        var createMetaData = true;
        if (!options) { }
        else {
            if (options['createMetaData'] === false) {
                createMetaData = false;
            }
        }
        if (createMetaData === true) {
            var metaDataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metaDataOptions['creatorId'] = options['creatorId'];
            }
            entity = this.addCreatedMetaDataToResource(entity['@id'], entity, metaDataOptions);
            entity = this.addLastModifiedMetaDataToResource(entity['@id'], entity, metaDataOptions);
        }
        // Validate the resource.
        if (!this.validate(entity)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entity;
    };
    /**
     * Add a MetaDataGroup resource to an existing resource with a type of CreatedMetaData.
     * @param {string} parentId - The '@id' from the parent resource.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
     * @returns {object}
     */
    Cidme.prototype.addCreatedMetaDataToResource = function (parentId, cidmeResource, options) {
        var _a, _b, _c, _d;
        var isoDate = new Date();
        var creatorId = null;
        if (!options || !options['creatorId']) { }
        else {
            creatorId = options['creatorId'];
        }
        if (creatorId) { }
        var newOptions = {};
        newOptions['createMetaData'] = false;
        newOptions['data'] = [
            this.createRdfDataResource([
                this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
            ], {
                '@context': (_a = {}, _a[this['rdfVocabs']['rdf']['prefix']] = this['rdfVocabs']['rdf']['url'], _a),
                '@id': this['rdfVocabs']['rdf']['prefix'] + ':type'
            }, {
                '@context': (_b = {}, _b[this['rdfVocabs']['cidme']['prefix']] = this['rdfVocabs']['cidme']['url'], _b),
                '@id': this['rdfVocabs']['cidme']['prefix'] + ':CreatedMetaData'
            }),
            this.createRdfDataResource([
                this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
            ], {
                '@context': (_c = {}, _c[this['rdfVocabs']['dc']['prefix']] = this['rdfVocabs']['dc']['url'], _c),
                '@id': this['rdfVocabs']['dc']['prefix'] + ':created'
            }, {
                '@value': isoDate.toISOString()
            })
        ];
        if (creatorId) {
            newOptions['data'].push(this.createRdfDataResource([
                this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
            ], {
                '@context': (_d = {}, _d[this['rdfVocabs']['dc']['prefix']] = this['rdfVocabs']['dc']['url'], _d),
                '@id': this['rdfVocabs']['dc']['prefix'] + ':creator'
            }, {
                '@value': creatorId
            }));
        }
        var createdMetaDataGroupResource = this.createMetaDataGroupResource(newOptions);
        // Validate the resource.
        if (!this.validate(createdMetaDataGroupResource)) {
            throw new Error('ERROR:  An error occured while validating the new MetaData resource.');
        }
        cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetaDataGroupResource, this['rdfVocabs']['cidme']['prefix'] + ':metaDataGroups');
        return cidmeResource;
    };
    /**
     * Add a MetaDataGroup resource to an existing resource with a type of LastModifiedMetaData.
     * @param {string} parentId - The '@id' from the parent resource.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
     * @returns {object}
     */
    Cidme.prototype.addLastModifiedMetaDataToResource = function (parentId, cidmeResource, options) {
        var _a, _b, _c, _d;
        var isoDate = new Date();
        var creatorId = null;
        if (!options || !options['creatorId']) { }
        else {
            creatorId = options['creatorId'];
        }
        if (creatorId) { }
        var newOptions = {};
        newOptions['createMetaData'] = false;
        newOptions['data'] = [
            this.createRdfDataResource([
                this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
            ], {
                '@context': (_a = {}, _a[this['rdfVocabs']['rdf']['prefix']] = this['rdfVocabs']['rdf']['url'], _a),
                '@id': this['rdfVocabs']['rdf']['prefix'] + ':type'
            }, {
                '@context': (_b = {}, _b[this['rdfVocabs']['cidme']['prefix']] = this['rdfVocabs']['cidme']['url'], _b),
                '@id': this['rdfVocabs']['cidme']['prefix'] + ':LastModifiedMetaData'
            }),
            this.createRdfDataResource([
                this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
            ], {
                '@context': (_c = {}, _c[this['rdfVocabs']['dc']['prefix']] = this['rdfVocabs']['dc']['url'], _c),
                '@id': this['rdfVocabs']['dc']['prefix'] + ':modified'
            }, {
                '@value': isoDate.toISOString()
            })
        ];
        if (creatorId) {
            newOptions['data'].push(this.createRdfDataResource([
                this['rdfVocabs']['cidme']['prefix'] + ':MetaData'
            ], {
                '@context': (_d = {}, _d[this['rdfVocabs']['dc']['prefix']] = this['rdfVocabs']['dc']['url'], _d),
                '@id': this['rdfVocabs']['dc']['prefix'] + ':creator'
            }, {
                '@value': creatorId
            }));
        }
        var createdMetaDataGroupResource = this.createMetaDataGroupResource(newOptions);
        // Validate the resource.
        if (!this.validate(createdMetaDataGroupResource)) {
            throw new Error('ERROR:  An error occured while validating the new MetaData resource.');
        }
        cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetaDataGroupResource, this['rdfVocabs']['cidme']['prefix'] + ':metaDataGroups');
        return cidmeResource;
    };
    /**
     * Returns a CIDME entity context resource.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
     * @returns {object}
     */
    Cidme.prototype.createEntityContextResource = function (options) {
        var _a;
        // Is this a brand new resource?
        var newResource = false;
        if (!options || !options['id']) {
            newResource = true;
        }
        // Determine resource UUID.
        var idUuid;
        if (newResource === true) {
            idUuid = this['uuidGenerator'].genV4().hexString;
        }
        else {
            idUuid = String(options['id']);
        }
        // Create the resource.
        var entityContext = {
            '@context': (_a = {},
                _a[this['rdfVocabs']['cidme']['prefix']] = this['rdfVocabs']['cidme']['url'],
                _a[this['rdfVocabs']['rdf']['prefix']] = this['rdfVocabs']['rdf']['url'],
                _a),
            '@type': this['rdfVocabs']['cidme']['prefix'] + ':EntityContext',
            '@id': this.getCidmeUri('EntityContext', idUuid)
        };
        // Add metaData?
        var createMetaData = true;
        if (!options) { }
        else {
            if (options['createMetaData'] === false) {
                createMetaData = false;
            }
        }
        if (createMetaData === true) {
            var metaDataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metaDataOptions['creatorId'] = options['creatorId'];
            }
            entityContext = this.addCreatedMetaDataToResource(entityContext['@id'], entityContext, metaDataOptions);
            entityContext = this.addLastModifiedMetaDataToResource(entityContext['@id'], entityContext, metaDataOptions);
        }
        // Validate the resource.
        if (!this.validate(entityContext)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entityContext;
    };
    /**
     * Returns a CIDME RdfData resource.
     * @param {array} type - An array of one or more strings to include in the '@type' property of the RdfData resource.  NOTE:  cidme:RdfData and rdf:statement will already be included.
     * @param {CidmeRdfPredicate} rdfPredicate - An object containing RDF predicate information.
     * @param {CidmeRdfObjectUri|CidmeRdfObjectJsonValue} rdfObject - An object containing RDF object information.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @returns {object}
     */
    Cidme.prototype.createRdfDataResource = function (type, rdfPredicate, rdfObject, options) {
        if (options === void 0) { options = {}; }
        // Is this a brand new resource?
        var newResource = false;
        if (!options['id']) {
            newResource = true;
        }
        // Determine resource UUID.
        var idUuid;
        if (newResource === true) {
            idUuid = this['uuidGenerator'].genV4().hexString;
        }
        else {
            idUuid = String(options['id']);
        }
        type.push(this['rdfVocabs']['rdf']['prefix'] + ':statement');
        type.push(this['rdfVocabs']['cidme']['prefix'] + ':RdfData');
        // Create the resource.
        var rdfData = {
            '@type': type,
            '@id': this.getCidmeUri('RdfData', idUuid),
            'rdf:predicate': rdfPredicate,
            'rdf:object': rdfObject
        };
        //console.log(rdfData)
        // Validate the resource.
        if (!this.validate(rdfData)) {
            throw new Error('ERROR:  An error occured while validating the new RdfData resource.');
        }
        return rdfData;
    };
    /**
     * Returns a CIDME metaData resource.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {CidmeRdfDataResource} [options.data] - RDF data to be added to the cidme:data[] array.
     * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
     * @returns {object}
     */
    Cidme.prototype.createMetaDataGroupResource = function (options) {
        // Is this a brand new resource?
        var newResource = false;
        if (!options || !options['id']) {
            newResource = true;
        }
        // Determine resource UUID.
        var idUuid;
        if (newResource === true) {
            idUuid = this['uuidGenerator'].genV4().hexString;
        }
        else {
            idUuid = String(options['id']);
        }
        // Create the resource.
        var metaData = {
            '@type': this['rdfVocabs']['cidme']['prefix'] + ':MetaDataGroup',
            '@id': this.getCidmeUri('DataGroup', idUuid)
        };
        if (!options || !options['data']) { }
        else {
            metaData['cidme:data'] = options['data'];
            //console.log(metaData)
            // Validate the resource.
            if (!this.validate(metaData)) {
                throw new Error('ERROR:  x2An error occured while validating the new resource.');
            }
        }
        // Add metaData?
        var createMetaData = true;
        if (!options) { }
        else {
            if (options['createMetaData'] === false) {
                createMetaData = false;
            }
        }
        if (createMetaData === true) {
            var metaDataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metaDataOptions['creatorId'] = options['creatorId'];
            }
            metaData = this.addCreatedMetaDataToResource(metaData['@id'], metaData, metaDataOptions);
            metaData = this.addLastModifiedMetaDataToResource(metaData['@id'], metaData, metaDataOptions);
        }
        // Validate the resource.
        if (!this.validate(metaData)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return metaData;
    };
    /**
     * Returns a CIDME entity context data group resource.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {CidmeRdfDataResource} [options.data] - RDF data to be added to the cidme:data[] array.
     * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
     * @returns {object}
     */
    Cidme.prototype.createEntityContextDataGroupResource = function (options) {
        // Is this a brand new resource?
        var newResource = false;
        if (!options || !options['id']) {
            newResource = true;
        }
        // Determine resource UUID.
        var idUuid;
        if (newResource === true) {
            idUuid = this['uuidGenerator'].genV4().hexString;
        }
        else {
            idUuid = String(options['id']);
        }
        // Create the resource.
        var entityContextData = {
            '@type': this['rdfVocabs']['cidme']['prefix'] + ':EntityContextDataGroup',
            '@id': this.getCidmeUri('DataGroup', idUuid)
        };
        // If we were given data, add it.
        if (!options || !options['data']) { }
        else {
            entityContextData['cidme:data'] = options['data'];
            // Validate the resource.
            if (!this.validate(entityContextData)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        // Add metaData?
        var createMetaData = true;
        if (!options) { }
        else {
            if (options['createMetaData'] === false) {
                createMetaData = false;
            }
        }
        if (createMetaData === true) {
            var metaDataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metaDataOptions['creatorId'] = options['creatorId'];
            }
            entityContextData = this.addCreatedMetaDataToResource(entityContextData['@id'], entityContextData, metaDataOptions);
            entityContextData = this.addLastModifiedMetaDataToResource(entityContextData['@id'], entityContextData, metaDataOptions);
        }
        // Validate the resource.
        if (!this.validate(entityContextData)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entityContextData;
    };
    /**
     * Returns a CIDME entity context link data group resource.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {CidmeRdfDataResource} [options.data] - RDF data to be added to the cidme:data[] array.
     * @param {boolean} [options.createMetaData=true] - Indicates if created/last modified metaData should automatically be created.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metaData.
     * @returns {object}
     */
    Cidme.prototype.createEntityContextLinkDataGroupResource = function (options) {
        // Is this a brand new resource?
        var newResource = false;
        if (!options || !options['id']) {
            newResource = true;
        }
        // Determine resource UUID.
        var idUuid;
        if (newResource === true) {
            idUuid = this['uuidGenerator'].genV4().hexString;
        }
        else {
            idUuid = String(options['id']);
        }
        // Create the resource.
        var entityContextLink = {
            '@type': this['rdfVocabs']['cidme']['prefix'] + ':EntityContextLinkDataGroup',
            '@id': this.getCidmeUri('DataGroup', idUuid)
        };
        if (!options || !options['data']) { }
        else {
            entityContextLink['cidme:data'] = options['data'];
            // Validate the resource.
            if (!this.validate(entityContextLink)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        // Add metaData?
        var createMetaData = true;
        if (!options) { }
        else {
            if (options['createMetaData'] === false) {
                createMetaData = false;
            }
        }
        if (createMetaData === true) {
            var metaDataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metaDataOptions['creatorId'] = options['creatorId'];
            }
            entityContextLink = this.addCreatedMetaDataToResource(entityContextLink['@id'], entityContextLink, metaDataOptions);
            entityContextLink = this.addLastModifiedMetaDataToResource(entityContextLink['@id'], entityContextLink, metaDataOptions);
        }
        //console.log(JSON.stringify(entityContextLink))
        // Validate the resource.
        if (!this.validate(entityContextLink)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entityContextLink;
    };
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
    Cidme.prototype.addResourceToParent = function (parentId, cidmeResource, resourceToAdd, dataTypeToAdd) {
        if (!resourceToAdd || !this.validate(resourceToAdd)) {
            throw new Error('ERROR:  Missing or invalid resourceToAdd.');
        }
        var resourceToAddType = this.parseCidmeUri(resourceToAdd['@id'])['resourceType'];
        if (!parentId || !cidmeResource || !resourceToAddType || !resourceToAdd) {
            throw new Error('ERROR:  Missing or invalid argument.');
        }
        if (cidmeResource['@id'] === parentId) {
            if (resourceToAddType === 'DataGroup') {
                if (!dataTypeToAdd) {
                    throw new Error('ERROR:  Missing or invalid dataTypeToAdd argument.');
                }
                cidmeResource = this.addDataGroupToResource(cidmeResource, dataTypeToAdd, resourceToAdd);
            }
            else if (resourceToAddType === 'MetaDataGroup') {
                cidmeResource = this.addMetaDataGroupToResource(cidmeResource, resourceToAdd);
            }
            else if (resourceToAddType === 'EntityContext') {
                cidmeResource = this.addEntityContextToResource(cidmeResource, resourceToAdd);
            }
            else if (resourceToAddType === 'EntityContextLinkDataGroup') {
                cidmeResource = this.addEntityContextLinkDataGroupToResource(cidmeResource, resourceToAdd);
            }
            else if (resourceToAddType === 'EntityContextDataGroup') {
                cidmeResource = this.addEntityContextDataGroupToResource(cidmeResource, resourceToAdd);
            }
            else {
                throw new Error('ERROR:  Invalid resourceToAddType.');
            }
        }
        // Cycle through metaDataGroups
        if (cidmeResource['cidme:metaDataGroups']) {
            for (var i = 0; i < cidmeResource['cidme:metaDataGroups'].length; i++) {
                cidmeResource['cidme:metaDataGroups'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:metaDataGroups'][i], resourceToAdd, dataTypeToAdd);
            }
        }
        // Cycle through entityContexts
        if (cidmeResource['cidme:entityContexts']) {
            for (var i = 0; i < cidmeResource['cidme:entityContexts'].length; i++) {
                cidmeResource['cidme:entityContexts'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:entityContexts'][i], resourceToAdd, dataTypeToAdd);
            }
        }
        // Cycle through entityContextDataGroups
        if (cidmeResource['cidme:entityContextDataGroups']) {
            for (var i = 0; i < cidmeResource['cidme:entityContextDataGroups'].length; i++) {
                cidmeResource['cidme:entityContextDataGroups'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:entityContextDataGroups'][i], resourceToAdd, dataTypeToAdd);
            }
        }
        // Cycle through entityContextLinkataGroups
        if (cidmeResource['cidme:entityContextLinkDataGroups']) {
            for (var i = 0; i < cidmeResource['cidme:entityContextLinkDataGroups'].length; i++) {
                cidmeResource['cidme:entityContextLinkDataGroups'][i] = this.addResourceToParent(parentId, cidmeResource['cidme:entityContextLinkDataGroups'][i], resourceToAdd, dataTypeToAdd);
            }
        }
        return cidmeResource;
    };
    /**
     * Adds a DataGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add DataGroup to.
     * @param {object} dataGroup - DataGroup resource to add to CIDME resource.
     * @param {object} dataTypeToAdd - 'cidme:metaDataGroups' or 'cidme:entityContextDataGroups' or 'cidme:entityContextLinkDataGroups'
     * @returns {object}
     */
    Cidme.prototype.addDataGroupToResource = function (cidmeResource, dataTypeToAdd, dataGroup) {
        if (!cidmeResource ||
            !dataGroup ||
            !this.validate(cidmeResource) ||
            !this.validate(dataGroup) ||
            this.parseCidmeUri(dataGroup['@id'])['resourceType'] !== 'DataGroup') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        if (dataTypeToAdd === 'cidme:metaDataGroups') {
            if (!cidmeResource['cidme:metaDataGroups']) {
                cidmeResource['cidme:metaDataGroups'] = [];
            }
            cidmeResource['cidme:metaDataGroups'].push(dataGroup);
        }
        else if (dataTypeToAdd === 'cidme:entityContextDataGroups') {
            if (!cidmeResource['cidme:entityContextDataGroups']) {
                cidmeResource['cidme:entityContextDataGroups'] = [];
            }
            cidmeResource['cidme:entityContextDataGroups'].push(dataGroup);
        }
        else if (dataTypeToAdd === 'cidme:entityContextLinkDataGroups') {
            if (!cidmeResource['cidme:entityContextLinkDataGroups']) {
                cidmeResource['cidme:entityContextLinkDataGroups'] = [];
            }
            cidmeResource['cidme:entityContextLinkDataGroups'].push(dataGroup);
        }
        else {
            throw new Error('ERROR:  dataTypeToAdd argument is invalid.');
        }
        // Validate the resource.
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return cidmeResource;
    };
    /**
     * Adds a MetaDataGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add MetaDataGroup to.
     * @param {object} metaDataGroup - MetaDataGroup resource to add to CIDME resource.
     * @returns {object}
     */
    Cidme.prototype.addMetaDataGroupToResource = function (cidmeResource, metaDataGroup) {
        if (!cidmeResource ||
            !metaDataGroup ||
            !this.validate(cidmeResource) ||
            !this.validate(metaDataGroup) ||
            this.parseCidmeUri(metaDataGroup['@id'])['resourceType'] !== 'DataGroup') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        // DO NOT REMOVE OR REPLACE 'cidme:' text below or you will incur a Typescript error...
        if (!cidmeResource['cidme:metaDataGroups']) {
            // DO NOT REMOVE OR REPLACE 'cidme:' text below or you will incur a Typescript error...
            cidmeResource['cidme:metaDataGroups'] = [];
        }
        // DO NOT REMOVE OR REPLACE 'cidme:' text below or you will incur a Typescript error...
        cidmeResource['cidme:metaDataGroups'].push(metaDataGroup);
        // Validate the resource.
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return cidmeResource;
    };
    /**
     * Adds an EntityContext to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add EntityContext to.
     * @param {object} entityContext - EntityContext resource to add to CIDME resource.
     * @returns {object}
     */
    Cidme.prototype.addEntityContextToResource = function (cidmeResource, entityContext) {
        if (!cidmeResource ||
            !entityContext ||
            !this.validate(entityContext) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContext['@id'])['resourceType'] !== 'EntityContext') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        if (!cidmeResource['cidme:entityContexts']) {
            cidmeResource['cidme:entityContexts'] = [];
        }
        cidmeResource['cidme:entityContexts'].push(entityContext);
        // Validate the resource.
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return cidmeResource;
    };
    /**
     * Adds an EntityContextLinkDataGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add EntityContextLinkDataGroup to.
     * @param {object} entityContextLinkDataGroup - EntityContextLinkDataGroup resource to add to CIDME resource.
     * @returns {object}
     */
    Cidme.prototype.addEntityContextLinkDataGroupToResource = function (cidmeResource, entityContextLinkDataGroup) {
        if (!cidmeResource ||
            !entityContextLinkDataGroup ||
            !this.validate(entityContextLinkDataGroup) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContextLinkDataGroup['@id'])['resourceType'] !== 'DataGroup') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        if (!cidmeResource['cidme:entityContextLinkDataGroups']) {
            cidmeResource['cidme:entityContextLinkDataGroups'] = [];
        }
        cidmeResource['cidme:entityContextLinkDataGroups'].push(entityContextLinkDataGroup);
        // Validate the resource.
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return cidmeResource;
    };
    /**
     * Adds an EntityContextDataGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add EntityContextDataGroup to.
     * @param {object} entityContextDataGroup - EntityContextDataGroup resource to add to CIDME resource.
     * @returns {object}
     */
    Cidme.prototype.addEntityContextDataGroupToResource = function (cidmeResource, entityContextDataGroup) {
        if (!cidmeResource ||
            !entityContextDataGroup ||
            !this.validate(entityContextDataGroup) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContextDataGroup['@id'])['resourceType'] !== 'DataGroup') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        if (!cidmeResource['cidme:entityContextDataGroups']) {
            cidmeResource['cidme:entityContextDataGroups'] = [];
        }
        cidmeResource['cidme:entityContextDataGroups'].push(entityContextDataGroup);
        // Validate the resource.
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return cidmeResource;
    };
    /**
     * Deletes a CIDME resource from a CIDME resource.
     * @param {string} resourceId - The '@id' of the resource to delete.
     * @param {object} cidmeResource - CIDME resource to delete from.
     * @returns {(object)}
     */
    Cidme.prototype.deleteResource = function (resourceId, cidmeResource) {
        var _a, _b, _c, _d;
        if (!resourceId || !cidmeResource) {
            throw new Error('ERROR:  Missing or invalid argument.');
        }
        if (cidmeResource['@id'] === resourceId) {
            throw new Error('ERROR:  Can not delete top level resource.');
        }
        if (!cidmeResource['cidme:metaDataGroups']) { }
        else {
            for (var i = 0; i < ((_a = cidmeResource['cidme:metaDataGroups']) === null || _a === void 0 ? void 0 : _a.length); i++) {
                if (cidmeResource['cidme:metaDataGroups'][i]['@id'] === resourceId) {
                    cidmeResource['cidme:metaDataGroups'].splice(i, 1);
                    i++;
                }
                else {
                    // Recursively check metaDataGroups
                    cidmeResource['cidme:metaDataGroups'][i] = this.deleteResource(resourceId, cidmeResource['cidme:metaDataGroups'][i]);
                    // TypeScript REALLY hates this code block.  Hence the excessive use of exclaimation point/bangs ('!') as well as excessive checks in the initial if block.
                    if (!cidmeResource['cidme:metaDataGroups'][i]['cidme:data']
                        || !Array.isArray(cidmeResource['cidme:metaDataGroups'][i]['cidme:data'])
                        || cidmeResource['cidme:metaDataGroups'][i]['cidme:data'].length < 1) { }
                    else {
                        for (var i2 = 0; i2 < cidmeResource['cidme:metaDataGroups'][i]['cidme:data'].length; i2++) {
                            if (cidmeResource['cidme:metaDataGroups'][i]['cidme:data'][i2]['@id'] === resourceId) {
                                cidmeResource['cidme:metaDataGroups'][i]['cidme:data'].splice(i2, 1);
                                i2++;
                            }
                        }
                        if (cidmeResource['cidme:metaDataGroups'][i]['cidme:data'].length < 1) {
                            delete cidmeResource['cidme:metaDataGroups'][i]['cidme:data'];
                        }
                    }
                }
            }
            if (cidmeResource['cidme:metaDataGroups'].length < 1) {
                delete cidmeResource['cidme:metaDataGroups'];
            }
        }
        if (!cidmeResource['cidme:entityContexts']) { }
        else {
            for (var i = 0; i < ((_b = cidmeResource['cidme:entityContexts']) === null || _b === void 0 ? void 0 : _b.length); i++) {
                if (cidmeResource['cidme:entityContexts'][i]['@id'] === resourceId) {
                    cidmeResource['cidme:entityContexts'].splice(i, 1);
                    i++;
                }
                else {
                    // Recursively check entityContexts
                    cidmeResource['cidme:entityContexts'][i] = this.deleteResource(resourceId, cidmeResource['cidme:entityContexts'][i]);
                }
            }
            if (cidmeResource['cidme:entityContexts'].length < 1) {
                delete cidmeResource['cidme:entityContexts'];
            }
        }
        if (!cidmeResource['cidme:entityContextDataGroups']) { }
        else {
            for (var i = 0; i < ((_c = cidmeResource['cidme:entityContextDataGroups']) === null || _c === void 0 ? void 0 : _c.length); i++) {
                if (cidmeResource['cidme:entityContextDataGroups'][i]['@id'] === resourceId) {
                    cidmeResource['cidme:entityContextDataGroups'].splice(i, 1);
                    i++;
                }
                else {
                    // Recursively check entityContextDataGroups
                    cidmeResource['cidme:entityContextDataGroups'][i] = this.deleteResource(resourceId, cidmeResource['cidme:entityContextDataGroups'][i]);
                    // TypeScript REALLY hates this code block.  Hence the excessive use of exclaimation point/bangs ('!') as well as excessive checks in the initial if block.
                    if (!cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data']
                        || !Array.isArray(cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'])
                        || cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'].length < 1) { }
                    else {
                        for (var i2 = 0; i2 < cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'].length; i2++) {
                            if (cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'][i2]['@id'] === resourceId) {
                                cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'].splice(i2, 1);
                                i2++;
                            }
                        }
                        if (cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'].length < 1) {
                            delete cidmeResource['cidme:entityContextDataGroups'][i]['cidme:data'];
                        }
                    }
                }
            }
            if (cidmeResource['cidme:entityContextDataGroups'].length < 1) {
                delete cidmeResource['cidme:entityContextDataGroups'];
            }
        }
        if (!cidmeResource['cidme:entityContextLinkDataGroups']) { }
        else {
            for (var i = 0; i < ((_d = cidmeResource['cidme:entityContextLinkDataGroups']) === null || _d === void 0 ? void 0 : _d.length); i++) {
                if (cidmeResource['cidme:entityContextLinkDataGroups'][i]['@id'] === resourceId) {
                    cidmeResource['cidme:entityContextLinkDataGroups'].splice(i, 1);
                    i++;
                }
                else {
                    // Recursively check entityContextLinkDataGroups
                    cidmeResource['cidme:entityContextLinkDataGroups'][i] = this.deleteResource(resourceId, cidmeResource['cidme:entityContextLinkDataGroups'][i]);
                    // TypeScript REALLY hates this code block.  Hence the excessive use of exclaimation point/bangs ('!') as well as excessive checks in the initial if block.
                    if (!cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data']
                        || !Array.isArray(cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'])
                        || cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'].length < 1) { }
                    else {
                        for (var i2 = 0; i2 < cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'].length; i2++) {
                            if (cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'][i2]['@id'] === resourceId) {
                                cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'].splice(i2, 1);
                                i2++;
                            }
                        }
                        if (cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'].length < 1) {
                            delete cidmeResource['cidme:entityContextLinkDataGroups'][i]['cidme:data'];
                        }
                    }
                }
            }
            if (cidmeResource['cidme:entityContextLinkDataGroups'].length < 1) {
                delete cidmeResource['cidme:entityContextLinkDataGroups'];
            }
        }
        return cidmeResource;
    };
    /* ********************************************************************** */
    /* ********************************************************************** */
    // CIDME SQL FUNCTIONS
    Cidme.prototype.getSqlJsonForResource = function (parentId, cidmeResource, retSql, sqlDialect) {
        var _a, _b, _c, _d;
        if (parentId === void 0) { parentId = null; }
        if (retSql === void 0) { retSql = []; }
        if (sqlDialect === void 0) { sqlDialect = 'sqlite'; }
        return __awaiter(this, void 0, void 0, function () {
            var resourceIdParsed, retSqlNewItem, parentIdParsed, i, err_1, i, err_2, i, err_3, i, err_4;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // Make sure we have a valid CIDME resource
                        if (!this.validate(cidmeResource)) {
                            throw new Error('ERROR:  Invalid passed CIDME resource.');
                        }
                        if (cidmeResource['@type'] !== 'Entity' && parentId === null) {
                            throw new Error('ERROR:  Invalid passed parentId argument.');
                        }
                        resourceIdParsed = this.parseCidmeUri(cidmeResource['@id']);
                        retSqlNewItem = {};
                        // @ts-ignore
                        //if (sqlDialect.toLowerCase === 'sqlite') {
                        // Get the SQL for the JSON-LD node itself
                        if (sqlDialect === 'sqlite') {
                            retSqlNewItem.sqlValues = {};
                            retSqlNewItem.sqlQueryType = 'REPLACE';
                            retSqlNewItem.sqlQuery = [];
                            retSqlNewItem.sqlQuery[0] = { 'type': 'text', 'text': 'REPLACE INTO nodes (' };
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'id' };
                            retSqlNewItem.sqlValues.id = resourceIdParsed['id'];
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'parent_id' };
                            if (parentId === null) {
                                retSqlNewItem.sqlValues.parent_id = null;
                            }
                            else {
                                parentIdParsed = this.parseCidmeUri(parentId);
                                retSqlNewItem.sqlValues.parent_id = parentIdParsed['id'];
                            }
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'context' };
                            retSqlNewItem.sqlValues.context = cidmeResource['@context'];
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'type' };
                            retSqlNewItem.sqlValues.type = cidmeResource['@type'];
                            if (cidmeResource['@type'] === 'MetaDataGroup' ||
                                cidmeResource['@type'] === 'EntityContextDataGroup' ||
                                cidmeResource['@type'] === 'EntityContextLinkDataGroup') {
                                retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'data' };
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
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'text', 'text': ') VALUES (' };
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'valuesPlaceholder' };
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'text', 'text': ')' };
                            //console.log(retSqlNewItem)
                        }
                        retSql.push(retSqlNewItem);
                        if (!!cidmeResource['cidme:metaDataGroups']) return [3 /*break*/, 1];
                        return [3 /*break*/, 7];
                    case 1:
                        i = 0;
                        _e.label = 2;
                    case 2:
                        if (!(i < ((_a = cidmeResource['cidme:metaDataGroups']) === null || _a === void 0 ? void 0 : _a.length))) return [3 /*break*/, 7];
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:metaDataGroups'][i], retSql)];
                    case 4:
                        retSql = _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _e.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_1.message);
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7:
                        if (!!cidmeResource['cidme:entityContexts']) return [3 /*break*/, 8];
                        return [3 /*break*/, 14];
                    case 8:
                        i = 0;
                        _e.label = 9;
                    case 9:
                        if (!(i < ((_b = cidmeResource['cidme:entityContexts']) === null || _b === void 0 ? void 0 : _b.length))) return [3 /*break*/, 14];
                        _e.label = 10;
                    case 10:
                        _e.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:entityContexts'][i], retSql)];
                    case 11:
                        retSql = _e.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        err_2 = _e.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_2.message);
                    case 13:
                        i++;
                        return [3 /*break*/, 9];
                    case 14:
                        if (!!cidmeResource['cidme:entityContextDataGroups']) return [3 /*break*/, 15];
                        return [3 /*break*/, 21];
                    case 15:
                        i = 0;
                        _e.label = 16;
                    case 16:
                        if (!(i < ((_c = cidmeResource['cidme:entityContextDataGroups']) === null || _c === void 0 ? void 0 : _c.length))) return [3 /*break*/, 21];
                        _e.label = 17;
                    case 17:
                        _e.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:entityContextDataGroups'][i], retSql)];
                    case 18:
                        retSql = _e.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        err_3 = _e.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_3.message);
                    case 20:
                        i++;
                        return [3 /*break*/, 16];
                    case 21:
                        if (!!cidmeResource['cidme:entityContextLinkDataGroups']) return [3 /*break*/, 22];
                        return [3 /*break*/, 28];
                    case 22:
                        i = 0;
                        _e.label = 23;
                    case 23:
                        if (!(i < ((_d = cidmeResource['cidme:entityContextLinkDataGroups']) === null || _d === void 0 ? void 0 : _d.length))) return [3 /*break*/, 28];
                        _e.label = 24;
                    case 24:
                        _e.trys.push([24, 26, , 27]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['cidme:entityContextLinkDataGroups'][i], retSql)];
                    case 25:
                        retSql = _e.sent();
                        return [3 /*break*/, 27];
                    case 26:
                        err_4 = _e.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_4.message);
                    case 27:
                        i++;
                        return [3 /*break*/, 23];
                    case 28: return [2 /*return*/, retSql];
                }
            });
        });
    };
    /* ********************************************************************** */
    /* ********************************************************************** */
    // HELPER FUNCTIONS
    /**
     * Return a portion (or all) of a cidmeResource based on the requested resourceId.
     * @param {string} resourceId - The '@id' of the resource to get.
     * @param {object} cidmeResource - CIDME resource to search through.
     * @returns {(boolean|object)}
     */
    Cidme.prototype.getResourceById = function (resourceId, cidmeResource) {
        var _a, _b, _c, _d;
        if (!resourceId || !cidmeResource) {
            throw new Error('ERROR:  Missing or invalid argument.');
        }
        // Make sure we have a valid CIDME resource
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  Invalid passed CIDME resource.');
        }
        // Make sure we have a valid CIDME resource ID
        try {
            var resourceIdParsed = this.parseCidmeUri(resourceId);
            /* Stop StandardJS from complaining */
            if (resourceIdParsed) { /* */ }
        }
        catch (err) {
            throw new Error('ERROR:  Invalid passed CIDME resource ID.');
        }
        var returnVal;
        if (cidmeResource['@id'] === resourceId) {
            return cidmeResource;
        }
        if (!cidmeResource['cidme:metaDataGroups']) { }
        else {
            for (var i = 0; i < ((_a = cidmeResource['cidme:metaDataGroups']) === null || _a === void 0 ? void 0 : _a.length); i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['cidme:metaDataGroups'][i]);
                if (!returnVal) { }
                else {
                    return returnVal;
                }
            }
        }
        if (!cidmeResource['cidme:entityContexts']) { }
        else {
            for (var i = 0; i < ((_b = cidmeResource['cidme:entityContexts']) === null || _b === void 0 ? void 0 : _b.length); i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['cidme:entityContexts'][i]);
                if (!returnVal) { }
                else {
                    return returnVal;
                }
            }
        }
        if (!cidmeResource['cidme:entityContextDataGroups']) { }
        else {
            for (var i = 0; i < ((_c = cidmeResource['cidme:entityContextDataGroups']) === null || _c === void 0 ? void 0 : _c.length); i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['cidme:entityContextDataGroups'][i]);
                if (!returnVal) { }
                else {
                    return returnVal;
                }
            }
        }
        if (!cidmeResource['cidme:entityContextLinkDataGroups']) { }
        else {
            for (var i = 0; i < ((_d = cidmeResource['cidme:entityContextLinkDataGroups']) === null || _d === void 0 ? void 0 : _d.length); i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['cidme:entityContextLinkDataGroups'][i]);
                if (!returnVal) { }
                else {
                    return returnVal;
                }
            }
        }
        return false;
    };
    /**
     * Returns an object containing a portion (or all) of a cidmeResource based on the requested resourceId as well as an array containing the 'breadcrumb' path to find the specificed resourceId within the full resource.
     * @param {string} resourceId - The '@id' of the resource to get.
     * @param {object} cidmeResource - CIDME resource to search through.
     * @param {object} [cidmeBreadcrumbs] - CIDME breadcrumbs array for recursive calls, this should NOT be specified for normal calls.
     * @returns {(object|boolean)}
     */
    Cidme.prototype.getResourceByIdWithBreadcrumbs = function (resourceId, cidmeResource, cidmeBreadcrumbs) {
        var _a, _b, _c, _d;
        if (cidmeBreadcrumbs === void 0) { cidmeBreadcrumbs = []; }
        if (!resourceId || !cidmeResource) {
            throw new Error('ERROR:  Missing or invalid argument.');
        }
        // Make sure we have a valid CIDME resource
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  Invalid passed CIDME resource.');
        }
        // Make sure we have a valid CIDME resource ID
        try {
            var resourceIdParsed = this.parseCidmeUri(resourceId);
            /* Stop StandardJS from complaining */
            if (resourceIdParsed) { /* */ }
        }
        catch (err) {
            throw new Error('ERROR:  Invalid passed CIDME resource ID.');
        }
        //if (Array.isArray(cidmeBreadcrumbs) === false) {cidmeBreadcrumbs = [];}
        if (cidmeResource['@id'] === resourceId) {
            cidmeBreadcrumbs.unshift({
                cidmeResourceType: cidmeResource['@type'],
                cidmeResourceId: cidmeResource['@id']
            });
            var returnVal2 = {
                cidmeResource: cidmeResource,
                cidmeBreadcrumbs: cidmeBreadcrumbs
            };
            return returnVal2;
        }
        if (!cidmeResource['cidme:metaDataGroups']) { }
        else {
            for (var i = 0; i < ((_a = cidmeResource['cidme:metaDataGroups']) === null || _a === void 0 ? void 0 : _a.length); i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:metaDataGroups'][i], cidmeBreadcrumbs);
                if (!returnVal) { }
                else {
                    cidmeBreadcrumbs.unshift({
                        cidmeResourceType: cidmeResource['@type'],
                        cidmeResourceId: cidmeResource['@id']
                    });
                    var returnVal2 = {
                        cidmeResource: returnVal['cidmeResource'],
                        cidmeBreadcrumbs: cidmeBreadcrumbs
                    };
                    return returnVal2;
                }
            }
        }
        if (!cidmeResource['cidme:entityContexts']) { }
        else {
            for (var i = 0; i < ((_b = cidmeResource['cidme:entityContexts']) === null || _b === void 0 ? void 0 : _b.length); i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:entityContexts'][i], cidmeBreadcrumbs);
                if (!returnVal) { }
                else {
                    cidmeBreadcrumbs.unshift({
                        cidmeResourceType: cidmeResource['@type'],
                        cidmeResourceId: cidmeResource['@id']
                    });
                    var returnVal2 = {
                        cidmeResource: returnVal['cidmeResource'],
                        cidmeBreadcrumbs: cidmeBreadcrumbs
                    };
                    return returnVal2;
                }
            }
        }
        if (!cidmeResource['cidme:entityContextDataGroups']) { }
        else {
            for (var i = 0; i < ((_c = cidmeResource['cidme:entityContextDataGroups']) === null || _c === void 0 ? void 0 : _c.length); i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:entityContextDataGroups'][i], cidmeBreadcrumbs);
                if (!returnVal) { }
                else {
                    cidmeBreadcrumbs.unshift({
                        cidmeResourceType: cidmeResource['@type'],
                        cidmeResourceId: cidmeResource['@id']
                    });
                    var returnVal2 = {
                        cidmeResource: returnVal['cidmeResource'],
                        cidmeBreadcrumbs: cidmeBreadcrumbs
                    };
                    return returnVal2;
                }
            }
        }
        if (!cidmeResource['cidme:entityContextLinkDataGroups']) { }
        else {
            for (var i = 0; i < ((_d = cidmeResource['cidme:entityContextLinkDataGroups']) === null || _d === void 0 ? void 0 : _d.length); i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['cidme:entityContextLinkDataGroups'][i], cidmeBreadcrumbs);
                if (!returnVal) { }
                else {
                    cidmeBreadcrumbs.unshift({
                        cidmeResourceType: cidmeResource['@type'],
                        cidmeResourceId: cidmeResource['@id']
                    });
                    var returnVal2 = {
                        cidmeResource: returnVal['cidmeResource'],
                        cidmeBreadcrumbs: cidmeBreadcrumbs
                    };
                    return returnVal2;
                }
            }
        }
        return false;
    };
    /* ********************************************************************** */
    /* ********************************************************************** */
    // MISC. FUNCTIONS
    /**
     * Returns a CIDME resource URI given a resourceType , and ID.
     * @param {string} resourceType
     * @param {(string|boolean)} id
     * @returns {string}
     */
    Cidme.prototype.getCidmeUri = function (resourceType, id) {
        if (!this.validateResourceType(resourceType)) {
            throw new Error('ERROR:  Invalid resourceType specified.');
        }
        if (!this['uuidGenerator'].parse(id) ||
            this['uuidGenerator'].parse(id) === null) {
            throw new Error('ERROR:  Invalid id specified.');
        }
        return 'cidme://' + resourceType + '/' + id;
    };
    /**
     * Returns an object containing CIDME resource URI elements.
     * @param {string} CIDME resource ID
     * @returns {object}
     */
    Cidme.prototype.parseCidmeUri = function (id) {
        if (!id) {
            throw new Error('ERROR:  No URI specified.');
        }
        // Ensure the URI scheme is good.
        if (id.substring(0, 8) !== 'cidme://') {
            throw new Error('ERROR:  Invalid URI scheme specified.');
        }
        // Use the getCidmeUri function to test for errors.  It will throw an
        // exception if any are found.
        this.getCidmeUri(String(id.split('/')[2]), String(id.split('/')[3]));
        return {
            'resourceType': String(id.split('/')[2]),
            'id': String(id.split('/')[3])
        };
    };
    /**
     * Output debugging information
     * @param {*} data - The data to output
     */
    Cidme.prototype.debugOutput = function (data) {
        if (this['debug'] === true) {
            console.log(data);
        }
    };
    return Cidme;
}());
module.exports = Cidme;
