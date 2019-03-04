#!/usr/bin/env node
const dashdash = require('dashdash');
const server = require('..');

let fieldList = ['url', 'method', 'body', 'query', 'headers', 'response', 'app'];

dashdash.addOptionType({
    name: 'fieldlist',
    takesArg: true,
    helpArg: 'LIST',
    parseArg: (option, optstr, arg) => {
        let val = arg;
        if(Array.isArray(val)) return val;
        val = val.toLowerCase().replace(/\s/g, '');
        
        val = val.split(',');
        
        val.forEach((v) => {
            if (fieldList.indexOf(v) === -1) {
                throw new Error(`"${v}" is not a valid field for: ${optstr}`);
            }
        });
        
        return val;
    }
});

const parser = dashdash.createParser({
    options: [{
        names: ['port', 'p'],
        type: 'number',
        help: 'Port number to bind the server to',
        default: 8000
    }, {
        name: 'disable-log',
        type: 'bool',
        help: 'Disables request logging to the console',
        default: false
    }, {
        name: 'disable-body',
        type: 'bool',
        help: 'Disables request logging to the body (browser)',
        default: false
    }, {
        names: ['custom-body', 'b'],
        type: 'string',
        help: 'Custom text to be written to the body instead of request fields',
        default: null,
        helpArg: 'TEXT'
    }, {
        name: 'body-fields',
        type: 'fieldlist',
        help: 'List of fields to include in the response body',
        default: ['url', 'method', 'body', 'query', 'headers', 'response', 'app']
    }, {
        name: 'log-fields',
        type: 'fieldlist',
        help: 'List of fields to include in the log',
        default: ['body', 'query', 'headers']
    }, {
        name: 'no-colors',
        type: 'bool',
        help: 'Disables colors when printing JSON to console',
        default: false
    }, {
        group: ''
    } ,{
        names: ['version', 'v'],
        type: 'bool',
        help: 'Show version',
        default: false
    }, {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Print this help and exit',
        default: false
    }]
});

const argv = parser.parse(process.argv);

if(argv.help) {
    let help = parser.help().trimRight();
    console.log('Usage: test-server [OPTIONS]\n'
        + 'Options:\n'
        + help);
    process.exit(0);
}

if(argv.version) {
    console.log('v' + require('../package.json').version);
    process.exit(0);
}

let opts = {
    port: argv.port,
    enableLogging: !argv.disable_log,
    enableBody: !argv.disable_body,
    customBody: argv.custom_body,
    logFields: argv.log_fields,
    bodyFields: argv.body_fields,
    colors: !argv.no_colors
};

server(opts);
