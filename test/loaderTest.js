const should = require('should');

const loader = require('../');

describe('loader', () => {
  it('should convert to requires', () => {
    loader
      .call({}, 'Text <img src="./image.png"><img src="image.png"><img src="~bootstrap-img"> Text')
      .should.be.eql('module.exports = "Text <img src=\\"" + require("./image.png") + "\\"><img src=\\"" + require("image.png") + "\\"><img src=\\"" + require("bootstrap-img") + "\\"> Text";');
  });
  it('should accept attrs from query', () => {
    loader
      .call(
        {
          query: '?attrs=script:src',
        }, 'Text <script src="./script.js"><img src="image.png">')
      .should.be.eql('module.exports = "Text <script src=\\"" + require("./script.js") + "\\"><img src=\\"image.png\\">";');
  });
  it('should accept attrs from query (space separated)', () => {
    loader
      .call(
        {
          query: '?attrs=script:src img:src',
        }, 'Text <script src="./script.js"><img src="./image.png">')
      .should.be.eql('module.exports = "Text <script src=\\"" + require("./script.js") + "\\"><img src=\\"" + require("./image.png") + "\\">";');
  });
  it('should accept attrs from query (multiple)', () => {
    loader
      .call(
        {
          query: '?attrs[]=script:src&attrs[]=img:src',
        }, 'Text <script src="./script.js"><img src="./image.png">')
      .should.be.eql('module.exports = "Text <script src=\\"" + require("./script.js") + "\\"><img src=\\"" + require("./image.png") + "\\">";');
  });
  it('should not make bad things with templates', () => {
    loader
      .call({}, '<h3>#{number} {customer}</h3>\n<p>   {title}   </p>')
      .should.be.eql('module.exports = "<h3>#{number} {customer}</h3>\\n<p>   {title}   </p>";');
  });
  it('should not translate root-relative urls (without root query)', () => {
    loader
      .call({}, 'Text <img src="/image.png">')
      .should.be.eql('module.exports = "Text <img src=\\"/image.png\\">";');
  });
  it('should accept root from query', () => {
    loader
      .call(
        {
          query: '?root=/test',
        }, 'Text <img src="/image.png">')
      .should.be.eql('module.exports = "Text <img src=\\"" + require("/test/image.png") + "\\">";');
  });
  it('should ignore hash fragments in URLs', () => {
    loader
      .call({}, '<img src="./icons.svg#hash">')
      .should.be.eql('module.exports = "<img src=\\"" + require("./icons.svg") + "#hash\\">";');
  });
  it('should ignore interpolations by default', () => {
    loader
      .call({}, '<img src="${"Hello " + (1+1)}">')
      .should.be.eql('module.exports = "<img src=\\"${\\"Hello \\" + (1+1)}\\">";');
  });
  it('should enable interpolations when using interpolate flag', () => {
    loader
      .call(
        {
          query: '?interpolate',
        }, '<img src="${"Hello " + (1+1)}">')
      .should.be.eql('module.exports = "<img src=\\"" + ("Hello " + (1 + 1)) + "\\">";');
  });
  it('should enable interpolations when using interpolate=require flag and only require function to be translate', () => {
    loader
      .call(
        {
          query: '?interpolate=require',
        }, '<a href="${list.href}"><img src="${require("./test.jpg")}" /></a>')
      .should.be.eql('module.exports = "<a href=\\"${list.href}\\"><img src=\\"" + require("./test.jpg") + "\\" /></a>";');
  });
  it('should export as default export for es6to5 transpilation', () => {
    loader
      .call(
        {
          query: '?exportAsDefault',
        }, '<p>Hello world!</p>')
      .should.be.eql('exports.default = "<p>Hello world!</p>";');
  });
  it('should export as es6 default export', () => {
    loader
      .call(
        {
          query: '?exportAsEs6Default',
        }, '<p>Hello world!</p>')
      .should.be.eql('export default "<p>Hello world!</p>";');
  });
  it('should use custom loader', () => {
    loader
      .call(
        {
          query: {
            rules: [
              {
                test: /\.png$/,
                loader: '!file-loader!',
              },
            ],
          },
        }, 'Text <img src="./image.png"><img src="~bootstrap-img"> Text')
      .should.be.eql('module.exports = "Text <img src=\\"" + require("!file-loader!./image.png") + "\\"><img src=\\"" + require("bootstrap-img") + "\\"> Text";');
  });
});
