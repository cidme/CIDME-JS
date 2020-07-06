/**
* @file Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.4.0.
* @author Joe Thielen <joe@joethielen.com>
* @copyright Joe Thielen 2018-2020
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
 * Implements CIDME specification core functionality.  Currently supports CIDME specification version 0.4.0.
 * @author Joe Thielen <joe@joethielen.com>
 * @copyright Joe Thielen 2018-2020
 * @license MIT
 * @version 0.5.1
 */
var Cidme = /** @class */ (function () {
    /**
       * CIDME class constructor
       * @constructor
       * @param {object} jsonSchemaValidator - An instance of an Ajv compatible JSON schema validator (https://ajv.js.org/)
       * @param {object} uuidGenerator - An instance of an LiosK/UUID.js compatible UUID generator (https://github.com/LiosK/UUID.js)
       * @param {object} [jsonld] - An instance of an digitalbazaar/jsonld.js JSON-LD processor (https://github.com/digitalbazaar/jsonld.js)
       * @param {object} [N3] - An instance of an rdfjs/N3.js JSON-LD processor (https://github.com/rdfjs/N3.js)
       * @param {boolean} [debug] - Set true to enable debugging
       */
    function Cidme(jsonSchemaValidator, uuidGenerator, jsonld, N3, debug) {
        if (debug === void 0) { debug = false; }
        // Ensure we have required parameters
        if (!jsonSchemaValidator ||
            !uuidGenerator ||
            typeof jsonSchemaValidator !== 'object' ||
            typeof uuidGenerator !== 'function') {
            throw new Error('Missing required arguments.');
        }
        if (!jsonld ||
            typeof jsonld !== 'function') {
            this['hasJsonld'] = false;
        }
        else {
            this['hasJsonld'] = true;
            this['jsonld'] = jsonld;
        }
        if (!N3 ||
            typeof N3 !== 'object') {
            this['hasN3'] = false;
        }
        else {
            this['hasN3'] = true;
            this['parserN3'] = new N3.Parser();
        }
        this['cidmeVersion'] = '0.4.0';
        this['jsonSchemaValidator'] = jsonSchemaValidator;
        this['uuidGenerator'] = uuidGenerator;
        this['rdfType'] = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
        this['debug'] = debug;
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
                    'type': 'string',
                    'format': 'uri'
                },
                '@dataContext': {
                    'type': ['string', 'object']
                },
                '@groupDataTypeContext': {
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
                        },
                        'groupDataType': {
                            'type': 'array',
                            'items': {
                                '$ref': '#/definitions/GroupDataType'
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
                        },
                        'groupDataType': {
                            'type': 'array',
                            'items': {
                                '$ref': '#/definitions/GroupDataType'
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
                        },
                        'groupDataType': {
                            'type': 'array',
                            'items': {
                                '$ref': '#/definitions/GroupDataType'
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
                },
                'GroupDataType': {
                    'title': 'RDF metadata to describe data contained in data resource.',
                    'type': 'object',
                    'properties': {
                        '@context': {
                            '$ref': '#/definitions/@groupDataTypeContext'
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
        };
        /**
         * Set up json schema validator function for JSON-LD validation.
         * @member {object}
         */
        this['validateJsonLd'] = jsonSchemaValidator.compile(this['schemaJsonLd']);
        /**
         * Set up json schema validator function for CIDME resource validation.
         * @member {object}
         */
        this['validateCidme'] = Object(jsonSchemaValidator.compile(this['schemaCidme']));
        /**
         * URL of JSON-LD vocab for CIDME resources.
         * @member {string}
         */
        this['jsonLdVocabUrl'] = 'http://cidme.net/vocab/core/' + this['cidmeVersion'];
        /**
         * URL of JSON-LD context for CIDME resources.
         * @member {string}
         */
        this['jsonLdContext'] = this['jsonLdVocabUrl'] + '/jsonldcontext.json';
        /**
         * Array of CIDME resource types
         */
        this['resourceTypes'] = [
            'Entity',
            'EntityContext',
            'EntityContextLinkGroup',
            'EntityContextDataGroup',
            'MetadataGroup'
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
        // Validate metadata, if applicable
        if (cidmeResource.hasOwnProperty('metadata')) {
            for (var i = 0; i < cidmeResource['metadata'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['metadata'][i]['@id'])['resourceType'] !== 'MetadataGroup') {
                    return false;
                }
                if (!this.validate(cidmeResource['metadata'][i])) {
                    // this.debugOutput('  -- METADATA VALIDATION ERROR!');
                    return false;
                }
            }
        }
        // Validate entity context link groups, if applicable
        if (cidmeResource.hasOwnProperty('entityContextLinks')) {
            for (var i = 0; i < cidmeResource['entityContextLinks'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['entityContextLinks'][i]['@id'])['resourceType'] !== 'EntityContextLinkGroup') {
                    return false;
                }
                if (!this.validate(cidmeResource['entityContextLinks'][i])) {
                    // this.debugOutput('  -- ENTITY CONTEXT LINK GROUPS VALIDATION ERROR!');
                    return false;
                }
            }
        }
        // Validate entity context data groups, if applicable
        if (cidmeResource.hasOwnProperty('entityContextData')) {
            for (var i = 0; i < cidmeResource['entityContextData'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['entityContextData'][i]['@id'])['resourceType'] !== 'EntityContextDataGroup') {
                    return false;
                }
                if (!this.validate(cidmeResource['entityContextData'][i])) {
                    // this.debugOutput('  -- ENTITY CONTEXT DATA GROUPS VALIDATION ERROR!');
                    return false;
                }
            }
        }
        // Validate entity subcontexts, if applicable
        if (cidmeResource.hasOwnProperty('entityContexts')) {
            for (var i = 0; i < cidmeResource['entityContexts'].length; i++) {
                if (this.parseCidmeUri(cidmeResource['entityContexts'][i]['@id'])['resourceType'] !== 'EntityContext') {
                    return false;
                }
                if (!this.validate(cidmeResource['entityContexts'][i])) {
                    // this.debugOutput('  -- ENTITY CONTEXT VALIDATION ERROR!');
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Validates a CIDME datastore name
     * @param {string} datastore
     * @returns {boolean}
     */
    Cidme.prototype.validateDatastore = function (datastore) {
        if (datastore === 'public' ||
            datastore === 'local' ||
            (this['uuidGenerator'].parse(datastore) !== false &&
                this['uuidGenerator'].parse(datastore) !== null)) {
            return true;
        }
        return false;
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
     * @param {string} [options.datastore=local] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
    Cidme.prototype.createEntityResource = function (options) {
        var datastore = 'local';
        if (!options || !options['datastore']) { }
        else {
            datastore = options['datastore'];
        }
        if (!this.validateDatastore(datastore)) {
            throw new Error('Invalid datastore specified.');
        }
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
            '@context': this['jsonLdContext'],
            '@type': 'Entity',
            '@id': this.getCidmeUri(datastore, 'Entity', idUuid)
        };
        // Add metadata?
        var createMetadata = true;
        if (!options) { }
        else {
            if (options['createMetadata'] === false) {
                createMetadata = false;
            }
        }
        if (createMetadata === true) {
            var metadataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metadataOptions['creatorId'] = options['creatorId'];
            }
            entity = this.addCreatedMetadataToResource(entity['@id'], entity, metadataOptions);
            entity = this.addLastModifiedMetadataToResource(entity['@id'], entity, metadataOptions);
        }
        if (!this.validate(entity)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entity;
    };
    /**
     * Add a MetadataGroup resource to an existing resource with a type of CreatedMetadata.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
    Cidme.prototype.addCreatedMetadataToResource = function (parentId, cidmeResource, options) {
        var isoDate = new Date();
        var creatorId = null;
        if (!options || !options['creatorId']) { }
        else {
            creatorId = options['creatorId'];
        }
        var newOptions = {};
        newOptions['createMetadata'] = false;
        newOptions['groupDataType'] = [
            {
                '@context': this['jsonLdContext'],
                '@type': 'CreatedMetadata'
            }
        ];
        newOptions['data'] = [
            {
                '@context': {
                    '@vocab': 'http://purl.org/dc/terms/'
                },
                'created': isoDate.toISOString(),
                'creator': creatorId
            }
        ];
        var createdMetadataGroupResource = this.createMetadataGroupResource(parentId, newOptions);
        if (!this.validate(createdMetadataGroupResource)) {
            throw new Error('ERROR:  An error occured while validating the new Metadata resource.');
        }
        cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetadataGroupResource);
        return cidmeResource;
    };
    /**
     * Add a MetadataGroup resource to an existing resource with a type of LastModifiedMetadata.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @returns {object}
     */
    Cidme.prototype.addLastModifiedMetadataToResource = function (parentId, cidmeResource, options) {
        var isoDate = new Date();
        var creatorId = null;
        if (!options || !options['creatorId']) { }
        else {
            creatorId = options['creatorId'];
        }
        var newOptions = {};
        newOptions['createMetadata'] = false;
        newOptions['groupDataType'] = [
            {
                '@context': this['jsonLdContext'],
                '@type': 'LastModifiedMetadata'
            }
        ];
        newOptions['data'] = [
            {
                '@context': {
                    '@vocab': 'http://purl.org/dc/terms/'
                },
                'modified': isoDate.toISOString(),
                'creator': creatorId
            }
        ];
        var createdMetadataGroupResource = this.createMetadataGroupResource(parentId, newOptions);
        if (!this.validate(createdMetadataGroupResource)) {
            throw new Error('ERROR:  An error occured while validating the new Metadata resource.');
        }
        cidmeResource = this.addResourceToParent(parentId, cidmeResource, createdMetadataGroupResource);
        return cidmeResource;
    };
    /**
     * Returns a CIDME entity context resource.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
    Cidme.prototype.createEntityContextResource = function (parentId, options) {
        // Validate parentId.
        var parentIdObject = this.parseCidmeUri(parentId);
        // ParentId resourceType MUST be Entity or EntityContext.
        if (parentIdObject['resourceType'] !== 'Entity' && parentIdObject['resourceType'] !== 'EntityContext') {
            throw new Error('ERROR:  ParentId contains an invalid resource type.');
        }
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
            '@context': this['jsonLdContext'],
            '@type': 'EntityContext',
            '@id': this.getCidmeUri(parentIdObject['datastore'], 'EntityContext', idUuid)
        };
        // Add metadata?
        var createMetadata = true;
        if (!options) { }
        else {
            if (options['createMetadata'] === false) {
                createMetadata = false;
            }
        }
        if (createMetadata === true) {
            var metadataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metadataOptions['creatorId'] = options['creatorId'];
            }
            entityContext = this.addCreatedMetadataToResource(entityContext['@id'], entityContext, metadataOptions);
            entityContext = this.addLastModifiedMetadataToResource(entityContext['@id'], entityContext, metadataOptions);
        }
        if (!this.validate(entityContext)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entityContext;
    };
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
    Cidme.prototype.createMetadataGroupResource = function (parentId, options) {
        // Validate parentId.
        var parentIdObject = this.parseCidmeUri(parentId);
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
        var metadata = {
            '@context': this['jsonLdContext'],
            '@type': 'MetadataGroup',
            '@id': this.getCidmeUri(parentIdObject['datastore'], 'MetadataGroup', idUuid)
        };
        if (!options || !options['groupDataType']) { }
        else {
            metadata['groupDataType'] = options['groupDataType'];
            if (!this.validate(metadata)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        if (!options || !options['data']) { }
        else {
            metadata['data'] = options['data'];
            if (!this.validate(metadata)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        // Add metadata?
        var createMetadata = true;
        if (!options) { }
        else {
            if (options['createMetadata'] === false) {
                createMetadata = false;
            }
        }
        if (createMetadata === true) {
            var metadataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metadataOptions['creatorId'] = options['creatorId'];
            }
            metadata = this.addCreatedMetadataToResource(metadata['@id'], metadata, metadataOptions);
            metadata = this.addLastModifiedMetadataToResource(metadata['@id'], metadata, metadataOptions);
        }
        if (!this.validate(metadata)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return metadata;
    };
    /**
     * Returns a CIDME entity context link group resource.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
    Cidme.prototype.createEntityContextLinkGroupResource = function (parentId, options) {
        // Validate parentId.
        var parentIdObject = this.parseCidmeUri(parentId);
        // ParentId resourceType MUST be EntityContext.
        if (parentIdObject['resourceType'] !== 'EntityContext') {
            throw new Error('ERROR:  ParentId contains an invalid resource type.');
        }
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
            '@context': this['jsonLdContext'],
            '@type': 'EntityContextLinkGroup',
            '@id': this.getCidmeUri(parentIdObject['datastore'], 'EntityContextLinkGroup', idUuid)
        };
        if (!options || !options['groupDataType']) { }
        else {
            entityContextLink['groupDataType'] = options['groupDataType'];
            if (!this.validate(entityContextLink)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        if (!options || !options['data']) { }
        else {
            entityContextLink['data'] = options['data'];
            if (!this.validate(entityContextLink)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        // Add metadata?
        var createMetadata = true;
        if (!options) { }
        else {
            if (options['createMetadata'] === false) {
                createMetadata = false;
            }
        }
        if (createMetadata === true) {
            var metadataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metadataOptions['creatorId'] = options['creatorId'];
            }
            entityContextLink = this.addCreatedMetadataToResource(entityContextLink['@id'], entityContextLink, metadataOptions);
            entityContextLink = this.addLastModifiedMetadataToResource(entityContextLink['@id'], entityContextLink, metadataOptions);
        }
        if (!this.validate(entityContextLink)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entityContextLink;
    };
    /**
     * Returns a CIDME entity context data group resource.
     * @param {string} parentId - The @id from the parent resource.  This is used for the datastore ID from this is also used for the @id datastore value.
     * @param {object[]} [options] - An optional object containing optional values.
     * @param {string} [options.id] - If re-creating an existing resource, this is the resource ID to use.
     * @param {string} [options.createMetadata=true] - The datastore name.  Use local for none or just local processing.  Use public for entities meant for public consumption.
     * @param {string} [options.creatorId] - If specified, use this as the creatorId in any applicable metadata.
     * @returns {object}
     */
    Cidme.prototype.createEntityContextDataGroupResource = function (parentId, options) {
        // Validate parentId.
        var parentIdObject = this.parseCidmeUri(parentId);
        // ParentId resourceType MUST be EntityContext.
        if (parentIdObject['resourceType'] !== 'EntityContext') {
            throw new Error('ERROR:  ParentId contains an invalid resource type.');
        }
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
            '@context': this['jsonLdContext'],
            '@type': 'EntityContextDataGroup',
            '@id': this.getCidmeUri(parentIdObject['datastore'], 'EntityContextDataGroup', idUuid)
        };
        if (!options || !options['groupDataType']) { }
        else {
            entityContextData['groupDataType'] = options['groupDataType'];
            if (!this.validate(entityContextData)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        if (!options || !options['data']) { }
        else {
            entityContextData['data'] = options['data'];
            if (!this.validate(entityContextData)) {
                throw new Error('ERROR:  An error occured while validating the new resource.');
            }
        }
        // Add metadata?
        var createMetadata = true;
        if (!options) { }
        else {
            if (options['createMetadata'] === false) {
                createMetadata = false;
            }
        }
        if (createMetadata === true) {
            var metadataOptions = {};
            if (!options || !options['creatorId']) { }
            else {
                metadataOptions['creatorId'] = options['creatorId'];
            }
            entityContextData = this.addCreatedMetadataToResource(entityContextData['@id'], entityContextData, metadataOptions);
            entityContextData = this.addLastModifiedMetadataToResource(entityContextData['@id'], entityContextData, metadataOptions);
        }
        if (!this.validate(entityContextData)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return entityContextData;
    };
    /* ********************************************************************** */
    /* ********************************************************************** */
    // CIDME RESOURCE MANIPULATION FUNCTIONS
    /**
     * Adds a CIDME resource to another CIDME resource.  The resource is added to the appropriate place by specifying the parent ID to add to.  The type of resource to add is specified as well, indicating whether we're adding a MetadataGroup, an EntityContext, or another type of resource.
     * @param {string} parentId - The @id of the resource to add to.
     * @param {object} cidmeResource - CIDME resource to add to.
     * @param {object} resourceToAdd - The resource to add.
     * @returns {object}
     */
    Cidme.prototype.addResourceToParent = function (parentId, cidmeResource, resourceToAdd) {
        if (!resourceToAdd || !this.validate(resourceToAdd)) {
            throw new Error('ERROR:  Missing or invalid resourceToAdd.');
        }
        var resourceToAddType = this.parseCidmeUri(resourceToAdd['@id'])['resourceType'];
        if (!parentId || !cidmeResource || !resourceToAddType || !resourceToAdd) {
            throw new Error('ERROR:  Missing or invalid argument.');
        }
        if (cidmeResource['@id'] === parentId) {
            if (resourceToAddType === 'MetadataGroup') {
                cidmeResource = this.addMetadataGroupToResource(cidmeResource, resourceToAdd);
            }
            else if (resourceToAddType === 'EntityContext') {
                cidmeResource = this.addEntityContextToResource(cidmeResource, resourceToAdd);
            }
            else if (resourceToAddType === 'EntityContextLinkGroup') {
                cidmeResource = this.addEntityContextLinkGroupToResource(cidmeResource, resourceToAdd);
            }
            else if (resourceToAddType === 'EntityContextDataGroup') {
                cidmeResource = this.addEntityContextDataGroupToResource(cidmeResource, resourceToAdd);
            }
            else {
                throw new Error('ERROR:  Invalid resourceToAddType.');
            }
        }
        if (cidmeResource.hasOwnProperty('metadata')) {
            for (var i = 0; i < cidmeResource['metadata'].length; i++) {
                cidmeResource['metadata'][i] = this.addResourceToParent(parentId, cidmeResource['metadata'][i], resourceToAdd);
            }
        }
        if (cidmeResource.hasOwnProperty('entityContexts')) {
            for (var i = 0; i < cidmeResource['entityContexts'].length; i++) {
                cidmeResource['entityContexts'][i] = this.addResourceToParent(parentId, cidmeResource['entityContexts'][i], resourceToAdd);
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextData')) {
            for (var i = 0; i < cidmeResource['entityContextData'].length; i++) {
                cidmeResource['entityContextData'][i] = this.addResourceToParent(parentId, cidmeResource['entityContextData'][i], resourceToAdd);
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextLinks')) {
            for (var i = 0; i < cidmeResource['entityContextLinks'].length; i++) {
                cidmeResource['entityContextLinks'][i] = this.addResourceToParent(parentId, cidmeResource['entityContextLinks'][i], resourceToAdd);
            }
        }
        return cidmeResource;
    };
    /**
     * Adds a MetadataGroup to an existing CIDME resource.
     * @param {object} cidmeResource - CIDME resource to add MetadataGroup to.
     * @param {object} metadataGroup - MetadataGroup resource to add to CIDME resource.
     * @returns {object}
     */
    Cidme.prototype.addMetadataGroupToResource = function (cidmeResource, metadataGroup) {
        if (!cidmeResource ||
            !metadataGroup ||
            !this.validate(cidmeResource) ||
            !this.validate(metadataGroup) ||
            this.parseCidmeUri(metadataGroup['@id'])['resourceType'] !== 'MetadataGroup') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        if (!cidmeResource.hasOwnProperty('metadata')) {
            cidmeResource['metadata'] = [];
        }
        cidmeResource['metadata'].push(metadataGroup);
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
        if (!cidmeResource.hasOwnProperty('entityContexts')) {
            cidmeResource['entityContexts'] = [];
        }
        cidmeResource['entityContexts'].push(entityContext);
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return cidmeResource;
    };
    /**
       * Adds an EntityContextLinkGroup to an existing CIDME resource.
       * @param {object} cidmeResource - CIDME resource to add EntityContextLinkGroup to.
       * @param {object} entityContextLinkGroup - EntityContextLinkGroup resource to add to CIDME resource.
       * @returns {object}
       */
    Cidme.prototype.addEntityContextLinkGroupToResource = function (cidmeResource, entityContextLinkGroup) {
        if (!cidmeResource ||
            !entityContextLinkGroup ||
            !this.validate(entityContextLinkGroup) ||
            !this.validate(cidmeResource) ||
            this.parseCidmeUri(entityContextLinkGroup['@id'])['resourceType'] !== 'EntityContextLinkGroup') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        if (!cidmeResource.hasOwnProperty('entityContextLinks')) {
            cidmeResource['entityContextLinks'] = [];
        }
        cidmeResource['entityContextLinks'].push(entityContextLinkGroup);
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
            this.parseCidmeUri(entityContextDataGroup['@id'])['resourceType'] !== 'EntityContextDataGroup') {
            throw new Error('ERROR:  One or more of the arguments are missing and/or invalid.');
        }
        if (!cidmeResource.hasOwnProperty('entityContextData')) {
            cidmeResource['entityContextData'] = [];
        }
        cidmeResource['entityContextData'].push(entityContextDataGroup);
        if (!this.validate(cidmeResource)) {
            throw new Error('ERROR:  An error occured while validating the new resource.');
        }
        return cidmeResource;
    };
    /**
     * Replaces a CIDME resource's data.
     * @param {string} resourceId - The @id of the resource to replace data.
     * @param {object} cidmeResource - CIDME resource to add to.
     * @param {object} data - The replacement JSON data.
     * @param {object} [groupDataType] - The replacement JSON groupDataType.
     * @returns {object}
     */
    Cidme.prototype.replaceResourceData = function (resourceId, cidmeResource, data, groupDataType) {
        if (groupDataType === void 0) { groupDataType = {}; }
        if (!resourceId || !cidmeResource || !data) {
            throw new Error('ERROR:  Missing or invalid argument.');
        }
        if (cidmeResource['@id'] === resourceId) {
            if (!cidmeResource.hasOwnProperty('data')) {
                cidmeResource['data'] = [];
            }
            cidmeResource['data'] = data;
            if (groupDataType != {}) {
                if (cidmeResource['@id'] === resourceId) {
                    if (!cidmeResource.hasOwnProperty('groupDataType')) {
                        cidmeResource['groupDataType'] = [];
                    }
                    cidmeResource['groupDataType'] = groupDataType;
                }
            }
        }
        if (cidmeResource.hasOwnProperty('metadata')) {
            for (var i = 0; i < cidmeResource['metadata'].length; i++) {
                cidmeResource['metadata'][i] = this.replaceResourceData(resourceId, cidmeResource['metadata'][i], data);
            }
        }
        if (cidmeResource.hasOwnProperty('entityContexts')) {
            for (var i = 0; i < cidmeResource['entityContexts'].length; i++) {
                cidmeResource['entityContexts'][i] = this.replaceResourceData(resourceId, cidmeResource['entityContexts'][i], data);
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextData')) {
            for (var i = 0; i < cidmeResource['entityContextData'].length; i++) {
                cidmeResource['entityContextData'][i] = this.replaceResourceData(resourceId, cidmeResource['entityContextData'][i], data);
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextLinks')) {
            for (var i = 0; i < cidmeResource['entityContextLinks'].length; i++) {
                cidmeResource['entityContextLinks'][i] = this.replaceResourceData(resourceId, cidmeResource['entityContextLinks'][i], data);
            }
        }
        return cidmeResource;
    };
    /**
     * Deletes a CIDME resource from a CIDME resource.
     * @param {string} resourceId - The @id of the resource to delete.
     * @param {object} cidmeResource - CIDME resource to add to.
     * @returns {(object|null)}
     */
    Cidme.prototype.deleteResource = function (resourceId, cidmeResource) {
        if (!resourceId || !cidmeResource) {
            throw new Error('ERROR:  Missing or invalid argument.');
        }
        if (cidmeResource['@id'] === resourceId) {
            return null;
        }
        if (cidmeResource.hasOwnProperty('metadata')) {
            for (var i = 0; i < cidmeResource['metadata'].length; i++) {
                cidmeResource['metadata'][i] = this.deleteResource(resourceId, cidmeResource['metadata'][i]);
                if (cidmeResource['metadata'][i] === null) {
                    cidmeResource['metadata'].splice([i], 1);
                    i++;
                }
            }
            if (cidmeResource['metadata'].length < 1) {
                delete cidmeResource['metadata'];
            }
        }
        if (cidmeResource.hasOwnProperty('entityContexts')) {
            for (var i = 0; i < cidmeResource['entityContexts'].length; i++) {
                cidmeResource['entityContexts'][i] = this.deleteResource(resourceId, cidmeResource['entityContexts'][i]);
                if (cidmeResource['entityContexts'][i] === null) {
                    cidmeResource['entityContexts'].splice([i], 1);
                    i++;
                }
            }
            if (cidmeResource['entityContexts'].length < 1) {
                delete cidmeResource['entityContexts'];
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextData')) {
            for (var i = 0; i < cidmeResource['entityContextData'].length; i++) {
                cidmeResource['entityContextData'][i] = this.deleteResource(resourceId, cidmeResource['entityContextData'][i]);
                if (cidmeResource['entityContextData'][i] === null) {
                    cidmeResource['entityContextData'].splice([i], 1);
                    i++;
                }
            }
            if (cidmeResource['entityContextData'].length < 1) {
                delete cidmeResource['entityContextData'];
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextLinks')) {
            for (var i = 0; i < cidmeResource['entityContextLinks'].length; i++) {
                cidmeResource['entityContextLinks'][i] = this.deleteResource(resourceId, cidmeResource['entityContextLinks'][i]);
                if (cidmeResource['entityContextLinks'][i] === null) {
                    cidmeResource['entityContextLinks'].splice([i], 1);
                    i++;
                }
            }
            if (cidmeResource['entityContextLinks'].length < 1) {
                delete cidmeResource['entityContextLinks'];
            }
        }
        return cidmeResource;
    };
    /* ********************************************************************** */
    /* ********************************************************************** */
    // CIDME SQL FUNCTIONS
    Cidme.prototype.getSqlJsonForResource = function (parentId, cidmeResource, retSql, sqlDialect) {
        if (parentId === void 0) { parentId = null; }
        if (retSql === void 0) { retSql = []; }
        if (sqlDialect === void 0) { sqlDialect = 'sqlite'; }
        return __awaiter(this, void 0, void 0, function () {
            var resourceIdParsed, retSqlNewItem, parentIdParsed, nQuads, err_1, nQuads, err_2, i, i_1, err_3, i_2, err_4, i_3, err_5, i_4, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
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
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'id_datastore' };
                            retSqlNewItem.sqlValues.id_datastore = resourceIdParsed['datastore'];
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
                            if (cidmeResource['@type'] === 'MetadataGroup' ||
                                cidmeResource['@type'] === 'EntityContextDataGroup' ||
                                cidmeResource['@type'] === 'EntityContextLinkGroup') {
                                retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'groupDataType' };
                                if (cidmeResource.hasOwnProperty('groupDataType')) {
                                    retSqlNewItem.sqlValues.groupDataType = JSON.stringify(cidmeResource['groupDataType']);
                                }
                                else {
                                    retSqlNewItem.sqlValues.groupDataType = null;
                                }
                                retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'value', 'key': 'data' };
                                if (cidmeResource.hasOwnProperty('data')) {
                                    retSqlNewItem.sqlValues.data = JSON.stringify(cidmeResource['data']);
                                }
                                else {
                                    retSqlNewItem.sqlValues.data = null;
                                }
                            }
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'text', 'text': ') VALUES (' };
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'valuesPlaceholder' };
                            retSqlNewItem.sqlQuery[retSqlNewItem.sqlQuery.length] = { 'type': 'text', 'text': ')' };
                            //console.log(retSqlNewItem)
                        }
                        retSql.push(retSqlNewItem);
                        if (!((cidmeResource['@type'] === 'MetadataGroup' ||
                            cidmeResource['@type'] === 'EntityContextDataGroup' ||
                            cidmeResource['@type'] === 'EntityContextLinkGroup')
                            && cidmeResource.hasOwnProperty('groupDataType'))) return [3 /*break*/, 5];
                        //console.log(JSON.stringify(cidmeResource))
                        // Reset our var to an empty object
                        retSqlNewItem = {};
                        nQuads = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getResourceGroupDataTypeNQuads(cidmeResource, true)
                            // console.log(nQuads)
                        ];
                    case 2:
                        nQuads = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(cidmeResource);
                        throw new Error('ERROR:  Error creating NQuad(s) from groupDataType.');
                    case 4:
                        if (sqlDialect === 'sqlite') {
                            retSqlNewItem.sqlValues = {};
                            retSqlNewItem.sqlQueryType = 'INSERT';
                            retSqlNewItem.sqlQuery = [];
                            retSqlNewItem.sqlQuery[0] = { 'type': 'text', 'text': 'INSERT INTO data (' };
                            retSqlNewItem.sqlQuery[1] = { 'type': 'value', 'key': 'id' };
                            retSqlNewItem.sqlValues.id = this['uuidGenerator'].genV4().hexString;
                            retSqlNewItem.sqlQuery[2] = { 'type': 'value', 'key': 'parent_id' };
                            retSqlNewItem.sqlValues.parent_id = resourceIdParsed['id'];
                            retSqlNewItem.sqlQuery[3] = { 'type': 'value', 'key': 'parent_field' };
                            retSqlNewItem.sqlValues.parent_field = 'groupDataType';
                            // DONE??? TODO TODO TODO
                            retSqlNewItem.sqlQuery[4] = { 'type': 'value', 'key': 'predicate' };
                            retSqlNewItem.sqlValues.predicate = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
                            // DONE??? TODO TODO TODO
                            retSqlNewItem.sqlQuery[5] = { 'type': 'value', 'key': 'object' };
                            retSqlNewItem.sqlValues.object = nQuads;
                            // DONE??? TODO TODO TODO
                            retSqlNewItem.sqlQuery[6] = { 'type': 'value', 'key': 'object_type' };
                            retSqlNewItem.sqlValues.object_type = 'IRI';
                            retSqlNewItem.sqlQuery[7] = { 'type': 'text', 'text': ') VALUES (' };
                            retSqlNewItem.sqlQuery[8] = { 'type': 'valuesPlaceholder' };
                            retSqlNewItem.sqlQuery[9] = { 'type': 'text', 'text': ')' };
                        }
                        retSql.push(retSqlNewItem);
                        _a.label = 5;
                    case 5:
                        if (!((cidmeResource['@type'] === 'MetadataGroup' ||
                            cidmeResource['@type'] === 'EntityContextDataGroup' ||
                            cidmeResource['@type'] === 'EntityContextLinkGroup')
                            && cidmeResource.hasOwnProperty('data'))) return [3 /*break*/, 10];
                        nQuads = null;
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.getResourceDataNQuads(cidmeResource, true)
                            //console.log(JSON.stringify(nQuads))
                            //console.log('-------')
                        ];
                    case 7:
                        //console.log(cidmeResource['data'])
                        nQuads = _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        console.log(err_2.message);
                        throw new Error('ERROR:  Error creating NQuad(s) from data.');
                    case 9:
                        //throw new Error('TODO TODO TODO')
                        if (typeof nQuads === 'object' && nQuads.length > 0) {
                            for (i = 0; i < nQuads.length; i++) {
                                retSqlNewItem = {};
                                //console.log(nQuads[i])
                                if (sqlDialect === 'sqlite') {
                                    retSqlNewItem.sqlValues = {};
                                    retSqlNewItem.sqlQueryType = 'INSERT';
                                    retSqlNewItem.sqlQuery = [];
                                    retSqlNewItem.sqlQuery[0] = { 'type': 'text', 'text': 'INSERT INTO data (' };
                                    retSqlNewItem.sqlQuery[1] = { 'type': 'value', 'key': 'id' };
                                    retSqlNewItem.sqlValues.id = this['uuidGenerator'].genV4().hexString;
                                    retSqlNewItem.sqlQuery[2] = { 'type': 'value', 'key': 'parent_id' };
                                    retSqlNewItem.sqlValues.parent_id = resourceIdParsed['id'];
                                    retSqlNewItem.sqlQuery[3] = { 'type': 'value', 'key': 'parent_field' };
                                    retSqlNewItem.sqlValues.parent_field = 'data';
                                    // TODO TODO TODO
                                    retSqlNewItem.sqlQuery[4] = { 'type': 'value', 'key': 'predicate' };
                                    retSqlNewItem.sqlValues.predicate = nQuads[i].predicate.value;
                                    // TODO TODO TODO
                                    retSqlNewItem.sqlQuery[5] = { 'type': 'value', 'key': 'object' };
                                    retSqlNewItem.sqlValues.object = nQuads[i].object.value;
                                    // TODO TODO TODO
                                    retSqlNewItem.sqlQuery[6] = { 'type': 'value', 'key': 'object_type' };
                                    retSqlNewItem.sqlValues.object_type = nQuads[i].object.termType;
                                    //retSqlNewItem.sqlValues.object_type = 'Literal'
                                    retSqlNewItem.sqlQuery[7] = { 'type': 'text', 'text': ') VALUES (' };
                                    retSqlNewItem.sqlQuery[8] = { 'type': 'valuesPlaceholder' };
                                    retSqlNewItem.sqlQuery[9] = { 'type': 'text', 'text': ')' };
                                }
                                retSql.push(retSqlNewItem);
                            }
                        }
                        _a.label = 10;
                    case 10:
                        if (!cidmeResource.hasOwnProperty('metadata')) return [3 /*break*/, 16];
                        i_1 = 0;
                        _a.label = 11;
                    case 11:
                        if (!(i_1 < cidmeResource['metadata'].length)) return [3 /*break*/, 16];
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['metadata'][i_1], retSql)];
                    case 13:
                        retSql = _a.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        err_3 = _a.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_3.message);
                    case 15:
                        i_1++;
                        return [3 /*break*/, 11];
                    case 16:
                        if (!cidmeResource.hasOwnProperty('entityContexts')) return [3 /*break*/, 22];
                        i_2 = 0;
                        _a.label = 17;
                    case 17:
                        if (!(i_2 < cidmeResource['entityContexts'].length)) return [3 /*break*/, 22];
                        _a.label = 18;
                    case 18:
                        _a.trys.push([18, 20, , 21]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['entityContexts'][i_2], retSql)];
                    case 19:
                        retSql = _a.sent();
                        return [3 /*break*/, 21];
                    case 20:
                        err_4 = _a.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_4.message);
                    case 21:
                        i_2++;
                        return [3 /*break*/, 17];
                    case 22:
                        if (!cidmeResource.hasOwnProperty('entityContextData')) return [3 /*break*/, 28];
                        i_3 = 0;
                        _a.label = 23;
                    case 23:
                        if (!(i_3 < cidmeResource['entityContextData'].length)) return [3 /*break*/, 28];
                        _a.label = 24;
                    case 24:
                        _a.trys.push([24, 26, , 27]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['entityContextData'][i_3], retSql)];
                    case 25:
                        retSql = _a.sent();
                        return [3 /*break*/, 27];
                    case 26:
                        err_5 = _a.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_5.message);
                    case 27:
                        i_3++;
                        return [3 /*break*/, 23];
                    case 28:
                        if (!cidmeResource.hasOwnProperty('entityContextLinks')) return [3 /*break*/, 34];
                        i_4 = 0;
                        _a.label = 29;
                    case 29:
                        if (!(i_4 < cidmeResource['entityContextLinks'].length)) return [3 /*break*/, 34];
                        _a.label = 30;
                    case 30:
                        _a.trys.push([30, 32, , 33]);
                        return [4 /*yield*/, this.getSqlJsonForResource(cidmeResource['@id'], cidmeResource['entityContextLinks'][i_4], retSql)];
                    case 31:
                        retSql = _a.sent();
                        return [3 /*break*/, 33];
                    case 32:
                        err_6 = _a.sent();
                        throw new Error('ERROR:  Error creating SQL JSON:  ' + err_6.message);
                    case 33:
                        i_4++;
                        return [3 /*break*/, 29];
                    case 34: return [2 /*return*/, retSql];
                }
            });
        });
    };
    /* ********************************************************************** */
    /* ********************************************************************** */
    // HELPER FUNCTIONS
    /**
     * Return a portion (or all) of a cidmeResource based on the requested resourceId.
     * @param {string} resourceId - The @id of the resource to get.
     * @param {object} cidmeResource - CIDME resource to search through.
     * @returns {(boolean|object)}
     */
    Cidme.prototype.getResourceById = function (resourceId, cidmeResource) {
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
        //let returnVal: CidmeResource | boolean = false;
        var returnVal;
        if (cidmeResource['@id'] === resourceId) {
            return cidmeResource;
        }
        if (cidmeResource.hasOwnProperty('metadata')) {
            for (var i = 0; i < cidmeResource['metadata'].length; i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['metadata'][i]);
                if (!returnVal) { }
                else {
                    return returnVal;
                }
            }
        }
        if (cidmeResource.hasOwnProperty('entityContexts')) {
            for (var i = 0; i < cidmeResource['entityContexts'].length; i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['entityContexts'][i]);
                if (!returnVal) { }
                else {
                    return returnVal;
                }
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextData')) {
            for (var i = 0; i < cidmeResource['entityContextData'].length; i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['entityContextData'][i]);
                if (!returnVal) { }
                else {
                    return returnVal;
                }
            }
        }
        if (cidmeResource.hasOwnProperty('entityContextLinks')) {
            for (var i = 0; i < cidmeResource['entityContextLinks'].length; i++) {
                returnVal = this.getResourceById(resourceId, cidmeResource['entityContextLinks'][i]);
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
     * @param {string} resourceId - The @id of the resource to get.
     * @param {object} cidmeResource - CIDME resource to search through.
     * @param {object} [cidmeBreadcrumbs] - CIDME breadcrumbs array for recusive calls, this should NOT be specified for normal calls.
     * @returns {(object|boolean)}
     */
    Cidme.prototype.getResourceByIdWithBreadcrumbs = function (resourceId, cidmeResource, cidmeBreadcrumbs) {
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
        if (Array.isArray(cidmeBreadcrumbs) === false) {
            cidmeBreadcrumbs = [];
        }
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
        if (cidmeResource.hasOwnProperty('metadata')) {
            for (var i = 0; i < cidmeResource['metadata'].length; i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['metadata'][i], cidmeBreadcrumbs);
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
        if (cidmeResource.hasOwnProperty('entityContexts')) {
            for (var i = 0; i < cidmeResource['entityContexts'].length; i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['entityContexts'][i], cidmeBreadcrumbs);
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
        if (cidmeResource.hasOwnProperty('entityContextData')) {
            for (var i = 0; i < cidmeResource['entityContextData'].length; i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['entityContextData'][i], cidmeBreadcrumbs);
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
        if (cidmeResource.hasOwnProperty('entityContextLinks')) {
            for (var i = 0; i < cidmeResource['entityContextLinks'].length; i++) {
                var returnVal = this.getResourceByIdWithBreadcrumbs(resourceId, cidmeResource['entityContextLinks'][i], cidmeBreadcrumbs);
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
    /**
     * THIS IS AN ASYNC FUNCTION!  Return the groupDataType of a given applicable resource in N-Quads format.  This function requires CIDME to have been instantiated with jsonld.  If getPredicate is set to true it also requires N3.
     * @param {object} cidmeResource - CIDME resource to search through.
     * @param {boolean} [getPredicate] - Set to true to return only the groupDataType predicate.  This requires CIDME to have been instantiated with N3.
     * @returns {Promise}
     */
    Cidme.prototype.getResourceGroupDataTypeNQuads = function (cidmeResource, getPredicate) {
        if (getPredicate === void 0) { getPredicate = false; }
        return __awaiter(this, void 0, void 0, function () {
            var retVal, retVal2, data, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this['hasJsonld']) {
                            throw new Error('ERROR:  CIDME instantiated without jsonld.');
                        }
                        if (!getPredicate) { }
                        else {
                            if (!this['hasN3']) {
                                throw new Error('ERROR:  CIDME instantiated without N3.');
                            }
                        }
                        if (!cidmeResource) {
                            throw new Error('ERROR:  Missing or invalid argument.');
                        }
                        // Make sure we have a valid CIDME resource
                        if (!this.validate(cidmeResource)) {
                            throw new Error('ERROR:  Invalid passed CIDME resource.');
                        }
                        if (cidmeResource['@type'] !== 'MetadataGroup' &&
                            cidmeResource['@type'] !== 'EntityContextDataGroup' &&
                            cidmeResource['@type'] !== 'EntityContextLinkGroup') {
                            throw new Error('ERROR:  CIDME resource is not a MetadataGroup, ContextDataGroup, or ContextLinkGroup.');
                        }
                        if (!cidmeResource.hasOwnProperty('groupDataType')) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this['jsonld'].toRDF(cidmeResource['groupDataType'], { format: 'application/n-quads' })];
                    case 1:
                        retVal = _a.sent();
                        if (!getPredicate) { }
                        else {
                            retVal2 = false;
                            data = this['parserN3'].parse(retVal);
                            if (typeof data === 'object' && data.length > 0) {
                                for (i = 0; i < data.length; i++) {
                                    if (data[i].predicate.value === this['rdfType']) {
                                        retVal = data[i].object.value;
                                        retVal2 = true;
                                    }
                                }
                            }
                            if (!retVal2) {
                                retVal = false;
                            }
                        }
                        return [2 /*return*/, retVal];
                }
            });
        });
    };
    /**
     * THIS IS AN ASYNC FUNCTION!  Return the groupDataType of a given applicable resource in N-Quads format.  This function requires CIDME to have been instantiated with jsonld.  If getPredicate is set to true it also requires N3.
     * @param {object} cidmeResource - CIDME resource to search through.
     * @param {boolean} [parseN3] - Set to true to return data as pre-parsed N3.  This requires CIDME to have been instantiated with N3.
     * @returns {Promise}
     */
    Cidme.prototype.getResourceDataNQuads = function (cidmeResource, parseN3) {
        if (parseN3 === void 0) { parseN3 = false; }
        return __awaiter(this, void 0, void 0, function () {
            var retVal, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this['hasJsonld']) {
                            throw new Error('ERROR:  CIDME instantiated without jsonld.');
                        }
                        if (!parseN3) { }
                        else {
                            if (!this['hasN3']) {
                                throw new Error('ERROR:  CIDME instantiated without N3.');
                            }
                        }
                        if (!cidmeResource) {
                            throw new Error('ERROR:  Missing or invalid argument.');
                        }
                        // Make sure we have a valid CIDME resource
                        if (!this.validate(cidmeResource)) {
                            throw new Error('ERROR:  Invalid passed CIDME resource.');
                        }
                        if (cidmeResource['@type'] !== 'MetadataGroup' &&
                            cidmeResource['@type'] !== 'EntityContextDataGroup' &&
                            cidmeResource['@type'] !== 'EntityContextLinkGroup') {
                            throw new Error('ERROR:  CIDME resource is not a MetadataGroup, ContextDataGroup, or ContextLinkGroup.');
                        }
                        if (!cidmeResource.hasOwnProperty('data')) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this['jsonld'].toRDF(cidmeResource['data'], { format: 'application/n-quads' })];
                    case 1:
                        retVal = _a.sent();
                        if (!parseN3) { }
                        else {
                            data = this['parserN3'].parse(retVal);
                            if (!data) {
                                retVal = false;
                            }
                            else {
                                retVal = data;
                            }
                        }
                        return [2 /*return*/, retVal];
                }
            });
        });
    };
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
    Cidme.prototype.getCidmeUri = function (datastore, resourceType, id) {
        if (!this.validateDatastore(datastore)) {
            throw new Error('ERROR:  Invalid datastore specified.');
        }
        if (!this.validateResourceType(resourceType)) {
            throw new Error('ERROR:  Invalid resourceType specified.');
        }
        if (!this['uuidGenerator'].parse(id) ||
            this['uuidGenerator'].parse(id) === null) {
            throw new Error('ERROR:  Invalid id specified.');
        }
        return 'cidme://' + datastore + '/' + resourceType + '/' + id;
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
        this.getCidmeUri(String(id.split('/')[2]), String(id.split('/')[3]), String(id.split('/')[4]));
        return {
            'datastore': String(id.split('/')[2]),
            'resourceType': String(id.split('/')[3]),
            'id': String(id.split('/')[4])
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
