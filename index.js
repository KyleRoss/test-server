"use strict";
const http = require('http');
const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const chalk = require('chalk');
const util = require('util');

module.exports = function(config={}) {
    const cfg = Object.assign({
        port: 8000,
        ignorePaths: [/favicon/i, /robots\.txt/i],
        enableLogging: true,
        enableBody: true,
        customBody: null,
        colors: true,
        bodyFields: ['url', 'method', 'body', 'query', 'headers', 'response', 'app'],
        logFields: ['body', 'query', 'headers'],
        
        parserTypes: ['json', 'form', 'text'],
        jsonLimit: null,
        textLimit: null,
        formLimit: null,
        strictJSON: true
    }, config || {});
    
    const app = new Koa();
    require('koa-qs')(app, 'extended');
    
    app.use(async function(ctx, next) {
        let skip = cfg.ignorePaths.some(function(pathRegex) {
            return ctx.path.match(pathRegex) !== null;
        });
        
        if(skip) return ctx.body = '';
        return await next();
    });
    
    app.use(logger());
    
    app.use(bodyParser({
        enableTypes: cfg.parserTypes,
        jsonLimit: cfg.jsonLimit,
        textLimit: cfg.textLimit,
        formLimit: cfg.formLimit,
        strict: cfg.strictJSON
    }));
    
    app.use(async function(ctx) {
        let fields = {
            url: ctx.originalUrl,
            method: ctx.method,
            body: ctx.request.body,
            query: ctx.query,
            headers: ctx.request.headers,
            response: ctx.response,
            app: ctx.app
        };
        
        if(cfg.enableLogging) {
            let _log = {};
            cfg.logFields.forEach(field => {
                if(fields.hasOwnProperty(field)) _log[field] = fields[field];
            });
            
            console.log(util.inspect(_log, { colors: cfg.colors }));
        }
        
        if(cfg.enableBody) {
            if(cfg.customBody) {
                ctx.body = cfg.customBody;
                return;
            }
            
            let _body = {};
            cfg.bodyFields.forEach(field => {
                if(fields.hasOwnProperty(field)) _body[field] = fields[field];
            });
            
            ctx.type = 'application/json';
            ctx.body = _body;
        } else {
            ctx.body = '';
        }
    });
    
    http.createServer(app.callback()).listen(cfg.port, () => {
        console.log([
            `Server ready for requests on port ${chalk.bold(cfg.port)}`,
            `${chalk.gray('Use Ctrl+C to stop the server')}\n`
        ].join("\n"));
    });
    
    return app;
};
