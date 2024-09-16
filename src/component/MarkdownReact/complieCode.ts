import { transform } from "@babel/standalone";
import { declare } from "@babel/helper-plugin-utils";
import React from "react";
type importValueType = {
  default: string;
  namespace: string;
  specifier: string[];
};

type importAddType = (key: string, value: importValueType) => void;

const handleDefaultImport = () =>
  // specifier: (typeof specifiers)[number],
  // importValue: importValueType
  {
    // importValue.default = specifier.
  };

const handleNamespaceImport = () => {};

const handleImports = (specifiers: any, importMap: importValueType) => {
  let index = 0;
  while (index < specifiers.length) {
    switch (specifiers[index].type) {
      case "ImportDefaultSpecifier":
        // handleDefaultImport(specifiers[index], importMap);
        break;
      case "ImportNamespaceSpecifier":
        break;
      case "ImportSpecifier":
        break;
    }
    index++;
  }
};

const handleImport = (importMapAdd: importAddType) =>
  declare(function () {
    return {
      visitor: {
        ImportDeclaration(path) {
          const valueTemp = {} as importValueType;
          const sourceValue = path.node.source.value;
          if (path.node.specifiers.length > 0) {
            const specifiers = path.node.specifiers;
            // handleImports(specifiers, valueTemp);
            let index = 0;
            while (index < specifiers.length) {
              let name = "";
              switch (specifiers[index].type) {
                case "ImportDefaultSpecifier":
                  name = specifiers[index].local.name;
                  valueTemp.default = name;
                  break;
                case "ImportNamespaceSpecifier":
                  name = specifiers[index].local.name;
                  valueTemp.namespace = name;
                  break;
                case "ImportSpecifier":
                  name = specifiers[index].local.name;
                  valueTemp.specifier = valueTemp?.specifier ?? [];
                  valueTemp.specifier.push(name);
                  break;
                default:
                  break;
              }
              index++;
            }
          }
          importMapAdd(sourceValue, valueTemp);
        },
      },
    };
  });

// Babel.transform
const compileCode = (code: string) => {
  const map = new Map();
  const mapAdd = (key: any, value: any) => {
    if (map.has(key)) {
      map.set(key, {
        ...map.get(key),
        ...value,
      });
    } else {
      map.set(key, value);
    }
  };
  const res = transform(code, {
    presets: [
      "react",
      "typescript",
      [
        "env",
        {
          modules: "commonjs",
        },
      ],
    ],

    filename: "test.tsx",
    plugins: [handleImport(mapAdd)],
    retainLines: true,
  });

  console.log(res.code, map);

  return res.code;
};

export default compileCode;
