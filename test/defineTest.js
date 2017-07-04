const should = require('should');

const loader = require('../');

describe('define', () => {
  it('should not replace define', () => {
    loader
      .call({
        query: {
          define: {},
        },
      }, 'Text <#if __debug__>debug</#if> Text')
      .should.be.eql('module.exports = "Text <#if __debug__>debug</#if> Text";');
  });

  it('should replace define', () => {
    loader
      .call({
        query: {
          define: {
            __debug__: JSON.stringify(true),
          },
        },
      }, 'Text <#if __debug__>debug</#if> Text')
      .should.be.eql('module.exports = "Text <#if true>debug</#if> Text";');
  });
});
