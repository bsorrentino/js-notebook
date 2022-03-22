# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.8.0](https://github.com/bsorrentino/js-notebook/compare/v0.7.0...v0.8.0) (2022-03-22)


### Features

* add export notebook action ([e3bae60](https://github.com/bsorrentino/js-notebook/commit/e3bae6098afcdbb4a1f3ae8cdddf3927c57041d1)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)
* add import button (first step) ([34de261](https://github.com/bsorrentino/js-notebook/commit/34de261f29105397e6feb2d454d11d78f2417943)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)
* complete export (ie. download) implementation ([5755f1a](https://github.com/bsorrentino/js-notebook/commit/5755f1a61d53a3d2fbafa18f4fea50f1a0a08acd)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)
* finalize import notebook implementation ([4617eb5](https://github.com/bsorrentino/js-notebook/commit/4617eb5c45b8c0ba67300c31744279b70dd67864)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)





# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [](https://github.com/bsorrentino/js-notebook/compare/v0.7.0...v) (2022-03-20)


### Features

* add export notebook action ([e3bae60](https://github.com/bsorrentino/js-notebook/commit/e3bae6098afcdbb4a1f3ae8cdddf3927c57041d1)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)
* add import button (first step) ([34de261](https://github.com/bsorrentino/js-notebook/commit/34de261f29105397e6feb2d454d11d78f2417943)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)
* complete export (ie. download) implementation ([5755f1a](https://github.com/bsorrentino/js-notebook/commit/5755f1a61d53a3d2fbafa18f4fea50f1a0a08acd)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)
* finalize import notebook implementation ([4617eb5](https://github.com/bsorrentino/js-notebook/commit/4617eb5c45b8c0ba67300c31744279b70dd67864)), closes [#8](https://github.com/bsorrentino/js-notebook/issues/8)

# [0.7.0](https://github.com/bsorrentino/js-notebook/compare/v0.6.0...v0.7.0) (2022-03-16)


### Features

* add support for multiple PouchDB database ([00356fd](https://github.com/bsorrentino/js-notebook/commit/00356fd7f1f42ad094202fce2cd5f3341d03e2fc)), closes [#10](https://github.com/bsorrentino/js-notebook/issues/10)


### BREAKING CHANGES

* the database name must be provided either as global variable or query parameter





# [0.6.0](https://github.com/bsorrentino/js-notebook/compare/v0.5.2...v0.6.0) (2022-03-15)


### Features

* **client-data:** add new module for data stuff (pounchdb,model) ([256b885](https://github.com/bsorrentino/js-notebook/commit/256b885b300278e4eff8ae94a3068ee68a56fedc)), closes [#9](https://github.com/bsorrentino/js-notebook/issues/9)





# [0.5.0](https://github.com/bsorrentino/js-notebook/compare/v0.4.10...v0.5.0) (2022-03-14)


### Features

* **server:** allow configuration of static routes ([83fa6c4](https://github.com/bsorrentino/js-notebook/commit/83fa6c4c21c38b2321091316790e04cce8677ce1)), closes [#7](https://github.com/bsorrentino/js-notebook/issues/7)





# [0.4.0](https://github.com/enixam/js-notebook/compare/v0.2.3...v0.4.0) (2022-03-13)


### Bug Fixes

* fallback if package.json doesn't contain 'main' entry ([040d86a](https://github.com/enixam/js-notebook/commit/040d86a1aa7821f052fb2713f6f805f347ceec80))
* **local-client:** encode parameter before its usage ([b0119b8](https://github.com/enixam/js-notebook/commit/b0119b845b9d27a3a3974b3217a26e87b944e53b)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** fix splice() usage in insertCellAtIndex ([9235cfe](https://github.com/enixam/js-notebook/commit/9235cfe3c4b695b104194bbc915f35ab8c73d45e))
* **local-client:** save cells on reorder ([c122fd0](https://github.com/enixam/js-notebook/commit/c122fd046a329dc1e49ceb60ecbbe00f8c4b5994))
* **local-client:** text node css ([49ce4c7](https://github.com/enixam/js-notebook/commit/49ce4c72053dd71c251bb52eb2b09c7db5acfc8b))
* **notebooklist:** remove useCallback for clickhandler ([f98b692](https://github.com/enixam/js-notebook/commit/f98b6926b5da36bee71ba4121e833d7465e50388)), closes [#6](https://github.com/enixam/js-notebook/issues/6)


### Features

* **actionbar:** move menu items Clear,Format,Run on the command bar ([83ffff7](https://github.com/enixam/js-notebook/commit/83ffff7f4ee6cfadfacd2027acc5563ff4cb80bc)), closes [#5](https://github.com/enixam/js-notebook/issues/5)
* **add support for commitizen:** add support for commitizen ([70892ab](https://github.com/enixam/js-notebook/commit/70892ab796e2a06ac6781505ad5391683a6b6d6d))
* **changelog:** add support for commitizen ([e9afe63](https://github.com/enixam/js-notebook/commit/e9afe6374f16d03d74c33451590d8429b7b097df))
* **local-api:** add static route for manage notebook list page ([72be095](https://github.com/enixam/js-notebook/commit/72be0951060c38e96c76b6f35b702b9bc85ca42a)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client-page1:** add support for adding and deleting notebook ([869c609](https://github.com/enixam/js-notebook/commit/869c609905b45aa07d07d23ebaee6794828abf7d)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** add default notebook id ([0938dae](https://github.com/enixam/js-notebook/commit/0938daee0ea3709a353a77f0319da7e53c95fbe7)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** add package local-client-page1 ([d80d19b](https://github.com/enixam/js-notebook/commit/d80d19b01e9eb90e7e6134f358f19e40f67ea825)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** read url parameter to select notebook ([878cd5e](https://github.com/enixam/js-notebook/commit/878cd5ee185fdfbd016ce222aae807539a2c9dc6)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** support multiple notebooks initial implementation ([6166042](https://github.com/enixam/js-notebook/commit/61660425c66a042f14c2ebe504c0ef20a057b87b)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **notebooklist:** implement navigation ([a883864](https://github.com/enixam/js-notebook/commit/a88386400a877723833106bd8fec80e2e046877b)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **notebooklist:** show notebook list ([140bdc3](https://github.com/enixam/js-notebook/commit/140bdc3b244864e199efd0694f6bfb15061faf67)), closes [#6](https://github.com/enixam/js-notebook/issues/6)





# [0.3.0](https://github.com/enixam/js-notebook/compare/v0.2.3...v0.3.0) (2022-03-13)


### Bug Fixes

* fallback if package.json doesn't contain 'main' entry ([040d86a](https://github.com/enixam/js-notebook/commit/040d86a1aa7821f052fb2713f6f805f347ceec80))
* **local-client:** encode parameter before its usage ([b0119b8](https://github.com/enixam/js-notebook/commit/b0119b845b9d27a3a3974b3217a26e87b944e53b)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** fix splice() usage in insertCellAtIndex ([9235cfe](https://github.com/enixam/js-notebook/commit/9235cfe3c4b695b104194bbc915f35ab8c73d45e))
* **local-client:** save cells on reorder ([c122fd0](https://github.com/enixam/js-notebook/commit/c122fd046a329dc1e49ceb60ecbbe00f8c4b5994))
* **local-client:** text node css ([49ce4c7](https://github.com/enixam/js-notebook/commit/49ce4c72053dd71c251bb52eb2b09c7db5acfc8b))
* **notebooklist:** remove useCallback for clickhandler ([f98b692](https://github.com/enixam/js-notebook/commit/f98b6926b5da36bee71ba4121e833d7465e50388)), closes [#6](https://github.com/enixam/js-notebook/issues/6)


### Features

* **actionbar:** move menu items Clear,Format,Run on the command bar ([83ffff7](https://github.com/enixam/js-notebook/commit/83ffff7f4ee6cfadfacd2027acc5563ff4cb80bc)), closes [#5](https://github.com/enixam/js-notebook/issues/5)
* **add support for commitizen:** add support for commitizen ([70892ab](https://github.com/enixam/js-notebook/commit/70892ab796e2a06ac6781505ad5391683a6b6d6d))
* **changelog:** add support for commitizen ([e9afe63](https://github.com/enixam/js-notebook/commit/e9afe6374f16d03d74c33451590d8429b7b097df))
* **local-api:** add static route for manage notebook list page ([72be095](https://github.com/enixam/js-notebook/commit/72be0951060c38e96c76b6f35b702b9bc85ca42a)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client-page1:** add support for adding and deleting notebook ([869c609](https://github.com/enixam/js-notebook/commit/869c609905b45aa07d07d23ebaee6794828abf7d)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** add default notebook id ([0938dae](https://github.com/enixam/js-notebook/commit/0938daee0ea3709a353a77f0319da7e53c95fbe7)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** add package local-client-page1 ([d80d19b](https://github.com/enixam/js-notebook/commit/d80d19b01e9eb90e7e6134f358f19e40f67ea825)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** read url parameter to select notebook ([878cd5e](https://github.com/enixam/js-notebook/commit/878cd5ee185fdfbd016ce222aae807539a2c9dc6)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **local-client:** support multiple notebooks initial implementation ([6166042](https://github.com/enixam/js-notebook/commit/61660425c66a042f14c2ebe504c0ef20a057b87b)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **notebooklist:** implement navigation ([a883864](https://github.com/enixam/js-notebook/commit/a88386400a877723833106bd8fec80e2e046877b)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
* **notebooklist:** show notebook list ([140bdc3](https://github.com/enixam/js-notebook/commit/140bdc3b244864e199efd0694f6bfb15061faf67)), closes [#6](https://github.com/enixam/js-notebook/issues/6)
