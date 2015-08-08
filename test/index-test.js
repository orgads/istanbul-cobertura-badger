"use strict";

var path = require("path");
var expect = require("chai").expect;
var should = require("chai").should;
var fs = require("fs");

var badger = require("../lib");
var destinationPath = __dirname;

describe("istanbul-cobertura-badger", function() {

  describe("Parsing existing reports", function() {

    it("should open the proper path, compute the overall coverage percentage and create the badge", function(done) {

      // Use the fixture that's without problems
      var reportSamplePath = path.resolve(__dirname, "fixture", "istanbul-report.xml");

      // Load the badge for the report
      badger(reportSamplePath, destinationPath, function parsingResults(err, status) {
        expect(err).to.be.null;
        expect(status).to.be.an("object");

        var coverageBadgePath = path.normalize(path.resolve(destinationPath, "coverage.svg"));
        expect(status.file).to.equal(coverageBadgePath);

        // Verify that the badge file was successfully created
        fs.stat(coverageBadgePath, function gettingStats(err, stats) {
          expect(err).to.be.null;
          expect(stats).to.be.an("object");
          expect(stats.isFile()).to.be.true;
          expect(stats.size).to.be.above(0);

          fs.unlink(coverageBadgePath, function(err) {
            if (err) {
              console.log(err);
            }
            done();
          });

        });

      });
    });

  });

  describe("Parsing reports with xml problems", function() {

    it("should not parse and properly show the parsing error", function(done) {

      // Use the fixture that's without problems
      var reportSamplePath = path.resolve(__dirname, "fixture", "istanbul-report-with-problem.xml");

      // Try loading the incorrect badge
      badger(reportSamplePath, destinationPath, function parsingResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;

        done();
      });
    });

  });
});