const _lodash_es = await import('lodash-es');
const _prismjs = await import('prismjs');
const _react = await import('react');
const _react_dom = await import('react-dom');
const _rehype_prism = await import('rehype-prism');
const _rehype_raw = await import('rehype-raw');
const _rehype_react = await import('rehype-react');
const _rehype_stringify = await import('rehype-stringify');
const _remark = await import('remark');
const _remark_code_blocks = await import('remark-code-blocks');
const _remark_gfm = await import('remark-gfm');
const _remark_rehype = await import('remark-rehype');

  
    function require(module){
      switch(module){
          case 'lodash-es':
              return _lodash_es;
case 'prismjs':
              return _prismjs;
case 'react':
              return _react;
case 'react-dom':
              return _react_dom;
case 'rehype-prism':
              return _rehype_prism;
case 'rehype-raw':
              return _rehype_raw;
case 'rehype-react':
              return _rehype_react;
case 'rehype-stringify':
              return _rehype_stringify;
case 'remark':
              return _remark;
case 'remark-code-blocks':
              return _remark_code_blocks;
case 'remark-gfm':
              return _remark_gfm;
case 'remark-rehype':
              return _remark_rehype;
          default:
            fetch('/vite-plugin-require?module='+module);
            return {}
        }
    }

    export default require;
    
  