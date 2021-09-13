const fs = require('fs');
const uuid = require('uuid');
const core = require('../index');
const assert = require('assert');
const request = require('request');

describe("Start HTTPS Admin Server", () => {
    var options = {
        org: 'tprapunj-eval',
        env: 'test'
    }
    var config = {
        edgemicro: {
            logging: {
                level: 'error',
                dir: '/var/tmp',
                stats_log_interval: 60,
                rotate_interval: 24,
                stack_trace: false,
                to_console: true,
            },
            ssl: {
                key: './tests/adminserver.key',
                cert: './tests/adminserver.crt'
            }
        },
        uid: uuid.v1()
    }

    core.Logging.init(config, options);

    var adminServer = new core.AdminServer(8443, "localhost", config.edgemicro.ssl, true);
    adminServer.start()

    it("process request", (done) => {
        request({
            method: 'GET',
            key: fs.readFileSync('./tests/adminserver.key'),
            cert: fs.readFileSync('./tests/adminserver.crt'),
            rejectUnauthorized: false,
            url: 'https://localhost:8443/stats'
        }, (err, r, body) => {
            assert(!err, err)
        });
        done();
    })

    it("process request error", (done) => {
        request({
            method: 'GET',
            key: fs.readFileSync('./tests/adminserver.key'),
            cert: fs.readFileSync('./tests/adminserver.crt'),
            rejectUnauthorized: false,
            url: 'https://localhost:8443/test'
        }, (err, r, body) => {
            assert(!err, err)
        });
        done();
    })

    it("addMetrics record", (done) => {
        var record = {
            proxy_name: "mockProxy",
            proxy_url: "https://localhost:8443/v1",
            proxy_basepath: "/v1",
            target_host: "localhost",
            target_url: "http://localhost:8443/hello",
            target_status_code: 400,
            proxy_status_code: 404,
            target_sent_timestamp: Date.now(),
            target_received_timestamp: Date.now(),
            preflow_time: Date.now(),
            postflow_time: Date.now(),
            target_time: Date.now(),
            proxy_time: Date.now()
        }
        try {
            adminServer.addMetricsRecord(record);
        } catch (err) {
            assert(err instanceof Error, true)
        }
        done();
    })

    it("setCacheConfig test", (done) => {
        adminServer.setCacheConfig(config);
        done()
    })

    it("updateCachedStatsResponse test", (done) => {
        adminServer.updateCachedStatsResponse();
        done()
    })

    it("registerServerEvents test", (done) => {
        adminServer.registerServerEvents();
        done()
    })

    it("updateCachedStatsResponse test", (done) => {
        adminServer.updateCachedStatsResponse();
        done()
    })

    it("destroy test", (done) => {
        adminServer.destroy();
        done()
    })

    it("registerServerEvents test", (done) => {
        adminServer.registerServerEvents();
        done()
    })

    it("AdminServer stop", (done) => {
        try {
            adminServer.stop()
        } catch (err) {
            assert(err instanceof Error, true)
        }
        done()
    })
});

describe("Start HTTP Admin Server", () => {
    var options = {
        org: 'tprapunj-eval',
        env: 'test'
    }
    var config = {
        edgemicro: {
            logging: {
                level: 'error',
                dir: '/var/tmp',
                stats_log_interval: 60,
                rotate_interval: 24,
                stack_trace: false,
                to_console: true,
            }
        },
        uid: uuid.v1()
    }

    core.Logging.init(config, options);

    var adminServer =  new core.AdminServer(8080, false, null, true);
    adminServer.start()

    it("process request", (done) => {
        request({
            method: 'GET',
            url: 'http://localhost:8080/stats'
        }, (err, r, body) => {
            assert(!err, err)
        });
        core.Logging.writeConsoleLog('info',"Request executed");
        done();
    })

    it("process request error", (done) => {
        request({
            method: 'GET',
            url: 'http://localhost:8080/test'
        }, (err, r, body) => {
            assert(!err, err)
        });
        done();
    })

    it("process err request error", (done) => {
        request({
            method: 'GET',
            url: 'http://localhost:8080'
        }, (err, r, body) => {
            assert(!err, err)
        });
        done();
    })

    it("addMetrics record", (done) => {
        var record = {
            proxy_name: "mockProxy",
            proxy_url: "http://localhost:8080/v1",
            proxy_basepath: "/v1",
            target_host: "localhost",
            target_url: "http://localhost:8080/hello",
            target_status_code: 400,
            proxy_status_code: 404
        }
        try {
            adminServer.addMetricsRecord(record);
        } catch (err) {
            assert(err instanceof Error, true)
        }
        done();
    })

    it("setCacheConfig test", (done) => {
        adminServer.setCacheConfig(config);
        done()
    })

    it("registerServerEvents test", (done) => {
        adminServer.registerServerEvents();
        done()
    })

    it("updateCachedStatsResponse test", (done) => {
        adminServer.updateCachedStatsResponse();
        done()
    })

    it("destroy test", (done) => {
        adminServer.destroy();
        done()
    })

    it("registerServerEvents test", (done) => {
        adminServer.registerServerEvents();
        done()
    })

    it("AdminServer stop", (done) => {
        try {
            adminServer.stop()
        } catch (err) {
            assert(err instanceof Error, true)
        }
        done()
    })
});
