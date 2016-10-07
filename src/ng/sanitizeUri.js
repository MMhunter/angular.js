'use strict';

/**
 * @description
 * Private service to sanitize uris for links and images. Used by $compile and $sanitize.
 * 用来·净化·在链接，图片中的uri. 被$compile所需要
 */
function $$SanitizeUriProvider() {
  var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
    imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;

  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during a[href] sanitization.
   * 获得或者override用来做白名单的正则
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   * ·净化·是一种安全策略，主要用来防御通过http链接形式进行XSS攻击
   * 
   * 任何一个通过数据绑定被赋给 a tag的 href 属性的url，首先会被标准化并转换成绝对地址。然后它会去尝试匹配"aHrefSanitizationWhitelist"（白名单）
   * 的正则表达式。如果能够匹配，那么原始的url会被写进DOM里面，否则的话，就会把添加有'unsafe:'前缀的绝对地址写入DOM.
   * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.aHrefSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      aHrefSanitizationWhitelist = regexp;
      return this;
    }
    return aHrefSanitizationWhitelist;
  };


  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during img[src] sanitization.
   * 这段和上面一样，不同的是这个是针对img标签的src
   * 
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.imgSrcSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      imgSrcSanitizationWhitelist = regexp;
      return this;
    }
    return imgSrcSanitizationWhitelist;
  };

  this.$get = function() {
    return function sanitizeUri(uri, isImage) {
      var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
      var normalizedVal;
      normalizedVal = urlResolve(uri).href;
      if (normalizedVal !== '' && !normalizedVal.match(regex)) {
        return 'unsafe:' + normalizedVal;
      }
      return uri;
    };
  };
}
