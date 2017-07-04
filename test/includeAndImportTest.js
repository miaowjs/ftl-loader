const should = require('should');

const loader = require('../');

describe('include and import', () => {
  it('should replace include local file path', () => {
    loader
      .call({}, 'Text <#include "./foo.ftl"> <#include "./bar.ftl"> <@incMacro /> Text')
      .should.be.eql('module.exports = "Text <#include \\"" + require("./foo.ftl") + "\\"> <#include \\"" + require("./bar.ftl") + "\\"> <@incMacro /> Text";');
  });

  it('should replace include common file path', () => {
    loader
      .call({}, 'Text <#include "foo.ftl"> <#include "bar.ftl"> <@incMacro /> Text')
      .should.be.eql('module.exports = "Text <#include \\"" + require("foo.ftl") + "\\"> <#include \\"" + require("bar.ftl") + "\\"> <@incMacro /> Text";');
  });

  it('should replace import local file path', () => {
    loader
      .call({}, 'Text <#import "./foo.ftl" as foo> <@foo.incMacro /> <#import "./bar.ftl" as bar> <@bar.incMacro /> Text')
      .should.be.eql('module.exports = "Text <#import \\"" + require("./foo.ftl") + "\\" as foo> <@foo.incMacro /> <#import \\"" + require("./bar.ftl") + "\\" as bar> <@bar.incMacro /> Text";');
  });

  it('should replace import common file path', () => {
    loader
      .call({}, 'Text <#import "foo.ftl" as foo> <@foo.incMacro /> <#import "bar.ftl" as bar> <@bar.incMacro /> Text')
      .should.be.eql('module.exports = "Text <#import \\"" + require("foo.ftl") + "\\" as foo> <@foo.incMacro /> <#import \\"" + require("bar.ftl") + "\\" as bar> <@bar.incMacro /> Text";');
  });
});
