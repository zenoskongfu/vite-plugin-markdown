import Babel from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";

const ExportPlugin = declare((api, options) => {
  return {
    name: "babel-plugin-export",
    visitor: {
      Program: {
        enter(path) {
          let defaultExport = "";
          // let namedExport = [];

          path.traverse({
            ExportDefaultDeclaration(dPath) {
              const declaration = dPath.node.declaration;
              if (api.types.isIdentifier(declaration)) {
                defaultExport = declaration.name;
              } else if (api.types.isFunctionDeclaration(declaration)) {
                // 生成id
                const id = dPath.scope.generateUidIdentifier("defaultExport");
                // 生成默认导出
                const exportDecla = api.types.exportDefaultDeclaration(id);
                if (declaration.id) {
                  // 生成变量声明
                  const varDecla = api.types.variableDeclaration("const", [
                    api.types.variableDeclarator(id, declaration.id),
                  ]);

                  // 替换导出
                  dPath.replaceWithMultiple([
                    declaration,
                    varDecla,
                    exportDecla,
                  ]);
                } else {
                  const funcExpression = api.types.functionExpression(
                    null,
                    declaration.params,
                    declaration.body,
                    declaration.generator,
                    declaration.async
                  );
                  const varDecla = api.types.variableDeclaration("const", [
                    api.types.variableDeclarator(id, funcExpression),
                  ]);
                  dPath.replaceWithMultiple([varDecla, exportDecla]);
                }

                defaultExport = id.name;
              } else {
                // 生成id
                const id = dPath.scope.generateUidIdentifier("defaultExport");
                // 生成 赋值语句
                const varDecla = api.types.variableDeclaration("const", [
                  api.types.variableDeclarator(id, declaration as any),
                ]);

                // 生成默认导出
                const exportDecla = api.types.exportDefaultDeclaration(id);
                // 替换当前节点
                dPath.replaceWithMultiple([varDecla, exportDecla]);

                defaultExport = id.name;
              }
            },
            ExportNamedDeclaration(nPath) {
              // 这是命名导出，暂时不开发
            },
          });

          options.callback?.(defaultExport);
        },
      },
    },
  };
});

const GetExport = (code: string) => {
  let defaultExport = "";
  const { code: _code } = Babel.transform(code, {
    filename: "test.tsx",
    presets: ["@babel/preset-react", "@babel/preset-typescript"],
    plugins: [
      [
        ExportPlugin,
        {
          callback(_defaultExport: string) {
            defaultExport = _defaultExport;
          },
        },
      ],
    ],
  })!;

  const str = `
  {
    default: ${defaultExport}
  }
  `;

  console.log("str: ", str);

  return {
    code: _code,
    exportStr: str,
  };
};

export default GetExport;
