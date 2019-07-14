"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

describe("generator-rest-express-typescript:app", () => {
  describe("default install", () => {
    beforeAll(done => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({ description: "the description" })
        .withPrompts({ docker: false })
        .on("end", done);
    });

    it("the generator can be required without throwing", () => {
      // Not testing the actual run of generators yet
      require("../generators/app");
    });

    it("creates expected files", () => {
      assert.file([
        "jest.config.js",
        "tests/seeds.ts",
        "tests/resolvers",
        "tests/resolvers/auth.test.ts",
        "tests/resolvers/project.test.ts",
        "tests/testConn.ts",
        "tests/gCall.ts",
        "tests/bootstrap.ts",
        ".eslintrc.js",
        ".env.development",
        "package.json",
        "ormconfig.json",
        "tsconfig.json",
        ".env.test",
        ".gitignore",
        "src/context/context.interface.ts",
        "src/context/user.interface.ts",
        "src/context/authChecker.ts",
        "src/server/createSchema.ts",
        "src/server/index.ts",
        "src/utils/helpers.ts",
        "src/graphql/auth",
        "src/graphql/auth/login.input.ts",
        "src/graphql/auth/auth.resolver.ts",
        "src/graphql/auth/user.service.ts",
        "src/graphql/auth/register.input.ts",
        "src/graphql/project",
        "src/graphql/project/project.service.ts",
        "src/graphql/project/project.resolver.ts",
        "src/graphql/project/project.input.ts",
        "src/index.ts",
        "src/validators/isUserAlreadyExist.ts",
        "src/validators/sameValue.ts",
        "src/entities/project.ts",
        "src/entities/user.ts"
      ]);
    });

    it("creates expected npm scripts", () => {
      assert.fileContent("package.json", '"start"');
      assert.fileContent("package.json", '"build"');
      assert.fileContent("package.json", '"test"');
    });

    it("should generate variables in every file", () => {
      const expectedName = "myapp";
      const expectedDescription = "the description";
      const expectedVersion = "1.0.0";
      const nameDir = path.basename(process.cwd());
      assert.fileContent("package.json", `"name": "${expectedName}"`);
      assert.fileContent(
        "package.json",
        `"description": "${expectedDescription}"`
      );
      assert.fileContent("package.json", `"version": "${expectedVersion}"`);

      assert.fileContent("README.md", `# ${expectedName}`);
      assert.fileContent("README.md", expectedDescription);

      assert.strictEqual(nameDir, expectedName);
    });
  });

  describe("with docker", () => {
    beforeAll(done => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({ description: "the description" })
        .withPrompts({ docker: true })
        .on("end", done);
    });
  });

  describe("default install with option name", () => {
    beforeAll(done => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withArguments("argumentName")
        .on("end", done);
    });

    it("should generate the same appname in every file", () => {
      const expectedName = "argumentName";
      const nameDir = path.basename(process.cwd());
      assert.fileContent("package.json", `"name": "${expectedName}"`);
      assert.strictEqual(nameDir, expectedName);
    });
  });
});
