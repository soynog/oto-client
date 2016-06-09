"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('oto-client/ajax/service', ['exports', 'ember', 'ember-ajax/services/ajax'], function (exports, _ember, _emberAjaxServicesAjax) {
  exports['default'] = _emberAjaxServicesAjax['default'].extend({
    auth: _ember['default'].inject.service(),
    host: 'https://oto-api.herokuapp.com',
    headers: _ember['default'].computed('auth.credentials.token', {
      get: function get() {
        var headers = {};
        var token = this.get('auth.credentials.token');
        if (token) {
          headers['Authorization'] = 'Token token=' + token;
        }
        return headers;
      }
    })
  });
});
define('oto-client/app', ['exports', 'ember', 'oto-client/resolver', 'ember-load-initializers', 'oto-client/config/environment'], function (exports, _ember, _otoClientResolver, _emberLoadInitializers, _otoClientConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _otoClientConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _otoClientConfigEnvironment['default'].podModulePrefix,
    Resolver: _otoClientResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _otoClientConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('oto-client/application/adapter', ['exports', 'ember', 'active-model-adapter', 'oto-client/config/environment'], function (exports, _ember, _activeModelAdapter, _otoClientConfigEnvironment) {
  exports['default'] = _activeModelAdapter['default'].extend({
    auth: _ember['default'].inject.service(),
    host: 'https://oto-api.herokuapp.com',
    headers: _ember['default'].computed('auth.credentials.token', {
      get: function get() {
        var headers = {};
        var token = this.get('auth.credentials.token');
        if (token) {
          headers['Authorization'] = 'Token token=' + token;
        }
        return headers;
      }
    })
  });
});
define('oto-client/application/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    actions: {
      signOut: function signOut() {
        var _this = this;

        this.get('auth').signOut().then(function () {
          return _this.transitionTo('application');
        })
        // .then(() => {
        //   this.get('flashMessages').warning('You have been signed out.');
        // })
        ['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Are you sure you\'re signed-in?');
        });
        this.store.unloadAll();
      },

      error: function error(reason) {
        var unauthorized = reason.errors.some(function (error) {
          return error.status === '401';
        });

        if (unauthorized) {
          this.get('flashMessages').danger('You must be authenticated to access this page.');
          // this.transitionTo('/sign-in');
        } else {
            console.log("Error Reason: ", reason);
            this.get('flashMessages').danger('There was a problem. Please try again.');
          }

        return false;
      },

      signIn: function signIn(credentials) {
        var _this2 = this;

        return this.get('auth').signIn(credentials).then(function () {
          return _this2.refresh();
        })
        // .then(() => this.get('flashMessages').success('Thanks for signing in!'))
        ['catch'](function (err) {
          // console.log("Caught Sign In Error in Route.js", err.name);
          var errorName = err.name;
          if (errorName === "TransitionAborted") {
            console.log("Transition Aborted. NBD.");
          } else {
            console.log("There was a problem.");
            _this2.get('flashMessages').danger('There was a problem. Please try again.');
          }
        });
      },

      signUp: function signUp(credentials) {
        var _this3 = this;

        console.log("Sign Up Action: ", credentials);
        this.get('auth').signUp(credentials).then(function () {
          return _this3.get('auth').signIn(credentials);
        }).then(function () {
          return _this3.refresh();
        })
        // .then(() => {
        //   this.get('flashMessages')
        //   .success('Successfully signed-up! You have also been signed-in.');
        // })
        ['catch'](function (err) {
          // console.log("Caught Sign Up Error in Route.js", err.name);
          var errorName = err.name;
          if (errorName === "TransitionAborted") {
            console.log("Transition Aborted. NBD.");
          } else {
            console.log("There was a problem.");
            _this3.get('flashMessages').danger('There was a problem. Please try again.');
          }
        });
      },

      changePW: function changePW(passwords) {
        var _this4 = this;

        this.get('auth').changePassword(passwords).then(function () {
          _this4.get('flashMessages').success('Successfully changed your password!');
        })['catch'](function () {
          _this4.get('flashMessages').danger('There was a problem. Please try again.');
        });
      },

      home: function home() {
        this.transitionTo('application');
      }
    }
  });
});
define('oto-client/application/serializer', ['exports', 'active-model-adapter'], function (exports, _activeModelAdapter) {
  exports['default'] = _activeModelAdapter.ActiveModelSerializer.extend({});
});
define("oto-client/application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "oto-client/application/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "my-application", [], ["signOut", "signOut", "signIn", "signIn", "signUp", "signUp", "home", "home", "changePW", "changePW"], ["loc", [null, [1, 0], [5, 39]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/auth/service', ['exports', 'ember', 'ember-local-storage'], function (exports, _ember, _emberLocalStorage) {
  exports['default'] = _ember['default'].Service.extend({
    ajax: _ember['default'].inject.service(),
    credentials: (0, _emberLocalStorage.storageFor)('auth'),
    isAuthenticated: _ember['default'].computed.bool('credentials.token'),

    signUp: function signUp(credentials) {
      return this.get('ajax').post('/sign-up', {
        data: {
          credentials: {
            email: credentials.email,
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            password: credentials.password,
            password_confirmation: credentials.passwordConfirmation
          }
        }
      });
    },

    signIn: function signIn(credentials) {
      var _this = this;

      return this.get('ajax').post('/sign-in', {
        data: {
          credentials: {
            email: credentials.email,
            password: credentials.password
          }
        }
      }).then(function (result) {
        _this.get('credentials').set('id', result.user.id);
        _this.get('credentials').set('email', result.user.email);
        _this.get('credentials').set('token', result.user.token);
      });
    },

    changePassword: function changePassword(passwords) {
      return this.get('ajax').patch('/change-password/' + this.get('credentials.id'), {
        data: {
          passwords: {
            old: passwords.previous,
            'new': passwords.next
          }
        }
      });
    },

    signOut: function signOut() {
      var _this2 = this;

      return this.get('ajax').del('/sign-out/' + this.get('credentials.id'))['finally'](function () {
        return _this2.get('credentials').reset();
      });
    },

    clearCreds: function clearCreds() {
      console.log("Clearing Credentials");
      this.get('credentials').reset();
    }
  });
});
define('oto-client/auth/storage', ['exports', 'ember-local-storage/local/object'], function (exports, _emberLocalStorageLocalObject) {
  exports['default'] = _emberLocalStorageLocalObject['default'].extend({});
});
define('oto-client/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'oto-client/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _otoClientConfigEnvironment) {

  var name = _otoClientConfigEnvironment['default'].APP.name;
  var version = _otoClientConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('oto-client/components/change-password-modal/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    passwords: {},
    isShowingModal: false,

    actions: {
      changePW: function changePW() {
        this.sendAction('changePW', this.get('passwords'));
        this.toggleProperty('isShowingModal');
      },
      toggleModal: function toggleModal() {
        this.toggleProperty('isShowingModal');
      }
    }
  });
});
define("oto-client/components/change-password-modal/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.5.1",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 2
              },
              "end": {
                "line": 35,
                "column": 2
              }
            },
            "moduleName": "oto-client/components/change-password-modal/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h2");
            dom.setAttribute(el1, "class", "modal-header");
            var el2 = dom.createTextNode("USER SETTINGS");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            dom.setAttribute(el1, "class", "subtle-text");
            var el2 = dom.createTextNode("Go ahead and change your password if you'd like.");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "modal-field-container form");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "footer-button-container");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2, "class", "subtle-button auth-cancel-button cancel-button");
            var el3 = dom.createTextNode("\n        back\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2, "type", "submit");
            dom.setAttribute(el2, "class", "highlight-button circle auth-submit-button submit-button");
            var el3 = dom.createTextNode("\n        OK\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [5]);
            var element1 = dom.childAt(fragment, [7]);
            var element2 = dom.childAt(element1, [1]);
            var element3 = dom.childAt(element1, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createMorphAt(element0, 1, 1);
            morphs[1] = dom.createMorphAt(element0, 3, 3);
            morphs[2] = dom.createElementMorph(element2);
            morphs[3] = dom.createElementMorph(element3);
            return morphs;
          },
          statements: [["inline", "input", [], ["type", "password", "class", "form-control", "id", "previous", "placeholder", "OLD PASSWORD", "value", ["subexpr", "@mut", [["get", "passwords.previous", ["loc", [null, [18, 20], [18, 38]]]]], [], []]], ["loc", [null, [14, 6], [18, 40]]]], ["inline", "input", [], ["type", "password", "class", "form-control", "id", "next", "placeholder", "NEW PASSWORD", "value", ["subexpr", "@mut", [["get", "passwords.next", ["loc", [null, [23, 20], [23, 34]]]]], [], []]], ["loc", [null, [19, 6], [23, 36]]]], ["element", "action", ["toggleModal"], [], ["loc", [null, [27, 69], [27, 93]]]], ["element", "action", ["changePW"], [], ["loc", [null, [30, 93], [30, 114]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 36,
              "column": 0
            }
          },
          "moduleName": "oto-client/components/change-password-modal/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "modal-dialog", [], ["close", "toggleModal", "translucentOverlay", true, "clickOutsideToClose", false, "containerClassNames", "oto-modal-container row", "overlay-class", "", "wrapper-class", "outer-container"], 0, null, ["loc", [null, [4, 2], [35, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 37,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/change-password-modal/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("button");
        dom.setAttribute(el1, "class", "subtle-button user-settings-button");
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "class", "icon ion-gear-b");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createElementMorph(element4);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["element", "action", ["toggleModal"], [], ["loc", [null, [1, 51], [1, 75]]]], ["block", "if", [["get", "isShowingModal", ["loc", [null, [3, 6], [3, 20]]]]], [], 0, null, ["loc", [null, [3, 0], [36, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/components/create-trip-button/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("oto-client/components/create-trip-button/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 5,
              "column": 2
            }
          },
          "moduleName": "oto-client/components/create-trip-button/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1, "class", "create-trip-button highlight-button circle");
          var el2 = dom.createTextNode("+");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/create-trip-button/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "create-trip-button-container row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Create a new trip");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 3, 3);
        return morphs;
      },
      statements: [["block", "link-to", ["trips.new"], [], 0, null, ["loc", [null, [3, 2], [5, 14]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/components/date-picker', ['exports', 'ember', 'ember-cli-datepicker/components/date-picker'], function (exports, _ember, _emberCliDatepickerComponentsDatePicker) {
  exports['default'] = _emberCliDatepickerComponentsDatePicker['default'];
});
define('oto-client/components/email-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("oto-client/components/email-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/email-input/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "email", "id", "email", "placeholder", "EMAIL", "value", ["subexpr", "@mut", [["get", "email", ["loc", [null, [5, 14], [5, 19]]]]], [], []]], ["loc", [null, [2, 0], [5, 21]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/components/ember-modal-dialog-positioned-container', ['exports', 'ember-modal-dialog/components/positioned-container'], function (exports, _emberModalDialogComponentsPositionedContainer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsPositionedContainer['default'];
    }
  });
});
define('oto-client/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWormholeComponentsEmberWormhole['default'];
    }
  });
});
define('oto-client/components/flash-message', ['exports', 'ember-cli-flash/components/flash-message'], function (exports, _emberCliFlashComponentsFlashMessage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashComponentsFlashMessage['default'];
    }
  });
});
define('oto-client/components/hamburger-menu/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'button',
    classNames: ['navbar-toggle', 'collapsed'],
    attributeBindings: ['toggle:data-toggle', 'target:data-target', 'expanded:aria-expanded'],
    toggle: 'collapse',
    target: '#navigation',
    expanded: false
  });
});
define("oto-client/components/hamburger-menu/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/hamburger-menu/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1, "class", "sr-only");
        var el2 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1, "class", "icon-bar");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1, "class", "icon-bar");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1, "class", "icon-bar");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/components/modal-dialog-overlay', ['exports', 'ember-modal-dialog/components/modal-dialog-overlay'], function (exports, _emberModalDialogComponentsModalDialogOverlay) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsModalDialogOverlay['default'];
    }
  });
});
define('oto-client/components/modal-dialog', ['exports', 'ember-modal-dialog/components/modal-dialog'], function (exports, _emberModalDialogComponentsModalDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsModalDialog['default'];
    }
  });
});
define('oto-client/components/my-application/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service(),

    user: _ember['default'].computed.alias('auth.credentials.email'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    actions: {
      signOut: function signOut() {
        this.sendAction('signOut');
      },
      signIn: function signIn(credentials) {
        this.sendAction('signIn', credentials);
      },
      signUp: function signUp(credentials) {
        this.sendAction('signUp', credentials);
      },
      home: function home() {
        this.sendAction('home');
      },
      changePW: function changePW(passwords) {
        this.sendAction('changePW', passwords);
      }
    }
  });
});
define("oto-client/components/my-application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 37,
              "column": 2
            },
            "end": {
              "line": 42,
              "column": 2
            }
          },
          "moduleName": "oto-client/components/my-application/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "class", "subtle-button sign-out-button");
          var el3 = dom.createTextNode("sign out");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element0);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          return morphs;
        },
        statements: [["element", "action", ["signOut"], [], ["loc", [null, [39, 52], [39, 72]]]], ["inline", "change-password-modal", [], ["changePW", "changePW"], ["loc", [null, [41, 4], [41, 49]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 42,
              "column": 2
            },
            "end": {
              "line": 45,
              "column": 2
            }
          },
          "moduleName": "oto-client/components/my-application/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          return morphs;
        },
        statements: [["inline", "sign-in-modal", [], ["signIn", "signIn"], ["loc", [null, [43, 4], [43, 37]]]], ["inline", "sign-up-modal", [], ["signUp", "signUp"], ["loc", [null, [44, 4], [44, 37]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 50,
              "column": 2
            },
            "end": {
              "line": 52,
              "column": 2
            }
          },
          "moduleName": "oto-client/components/my-application/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "flash-message", [], ["flash", ["subexpr", "@mut", [["get", "flash", ["loc", [null, [51, 26], [51, 31]]]]], [], []]], ["loc", [null, [51, 4], [51, 33]]]]],
        locals: ["flash"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 54,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/my-application/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "outer-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "footer-button-container auth-button-container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "home-button");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3, "class", "subtle-button home-button");
        var el4 = dom.createElement("h4");
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "ion-ios-home");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "flash-message-container row");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [4]);
        var element2 = dom.childAt(element1, [1, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(element1, 3, 3);
        morphs[3] = dom.createMorphAt(dom.childAt(fragment, [6]), 1, 1);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [30, 2], [30, 12]]]], ["element", "action", ["home"], [], ["loc", [null, [35, 48], [35, 65]]]], ["block", "if", [["get", "isAuthenticated", ["loc", [null, [37, 8], [37, 23]]]]], [], 0, 1, ["loc", [null, [37, 2], [45, 9]]]], ["block", "each", [["get", "flashMessages.queue", ["loc", [null, [50, 10], [50, 29]]]]], [], 2, null, ["loc", [null, [50, 2], [52, 11]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define('oto-client/components/navbar-header/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['navbar-header']
  });
});
define("oto-client/components/navbar-header/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 2,
              "column": 51
            }
          },
          "moduleName": "oto-client/components/navbar-header/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Home");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/navbar-header/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "hamburger-menu", ["loc", [null, [1, 0], [1, 18]]]], ["block", "link-to", ["application"], ["class", "navbar-brand"], 0, null, ["loc", [null, [2, 0], [2, 63]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/components/new-trip-form/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    form: {},

    actions: {
      submit: function submit() {
        // Substitute Start and End Date fields for new Date objects
        var startDate = new Date(_ember['default'].get(this.form, 'startDate'));
        var endDate = new Date(_ember['default'].get(this.form, 'endDate'));
        _ember['default'].set(this.form, 'startDate', startDate);
        _ember['default'].set(this.form, 'endDate', endDate);
        console.log("Form is: ", this.form);

        // Pass action up
        this.sendAction('submit', this.get('form'));
      }
    }
  });
});
define("oto-client/components/new-trip-form/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "modifiers",
          "modifiers": ["action"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 12,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/new-trip-form/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(7);
        morphs[0] = dom.createElementMorph(element0);
        morphs[1] = dom.createMorphAt(element0, 1, 1);
        morphs[2] = dom.createMorphAt(element0, 3, 3);
        morphs[3] = dom.createMorphAt(element0, 5, 5);
        morphs[4] = dom.createMorphAt(element0, 7, 7);
        morphs[5] = dom.createMorphAt(element0, 9, 9);
        morphs[6] = dom.createMorphAt(element0, 11, 11);
        return morphs;
      },
      statements: [["element", "action", ["submit", ["get", "form", ["loc", [null, [1, 24], [1, 28]]]]], ["on", "submit"], ["loc", [null, [1, 6], [1, 43]]]], ["inline", "input", [], ["placeholder", "TRIP NAME", "value", ["subexpr", "@mut", [["get", "form.name", ["loc", [null, [3, 16], [3, 25]]]]], [], []]], ["loc", [null, [2, 2], [3, 27]]]], ["inline", "input", [], ["placeholder", "LOCATION", "value", ["subexpr", "@mut", [["get", "form.location", ["loc", [null, [5, 16], [5, 29]]]]], [], []]], ["loc", [null, [4, 2], [5, 31]]]], ["inline", "date-picker", [], ["placeholder", "START DATE", "allowBlank", true, "date", ["subexpr", "@mut", [["get", "form.startDate", ["loc", [null, [6, 62], [6, 76]]]]], [], []], "valueFormat", "ll"], ["loc", [null, [6, 2], [6, 95]]]], ["inline", "date-picker", [], ["placeholder", "END DATE", "allowBlank", true, "date", ["subexpr", "@mut", [["get", "form.endDate", ["loc", [null, [7, 60], [7, 72]]]]], [], []], "valueFormat", "ll"], ["loc", [null, [7, 2], [7, 91]]]], ["inline", "input", [], ["placeholder", "DESCRIPTION", "value", ["subexpr", "@mut", [["get", "form.description", ["loc", [null, [9, 16], [9, 32]]]]], [], []]], ["loc", [null, [8, 2], [9, 34]]]], ["inline", "input", [], ["type", "submit", "class", "highlight-button circle submit-new-trip-button", "value", ">"], ["loc", [null, [10, 2], [10, 90]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/components/password-confirmation-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("oto-client/components/password-confirmation-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/password-confirmation-input/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "password", "id", "password-confirmation", "placeholder", "CONFIRM PASSWORD", "value", ["subexpr", "@mut", [["get", "password", ["loc", [null, [4, 14], [4, 22]]]]], [], []]], ["loc", [null, [1, 0], [4, 24]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/components/password-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("oto-client/components/password-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/password-input/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "password", "id", "password", "placeholder", "PASSWORD", "value", ["subexpr", "@mut", [["get", "password", ["loc", [null, [5, 14], [5, 22]]]]], [], []]], ["loc", [null, [2, 0], [5, 24]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/components/sign-in-modal/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    credentials: {},
    isShowingModal: false,

    actions: {
      signIn: function signIn() {
        this.sendAction('signIn', this.get('credentials'));
        this.toggleProperty('isShowingModal');
      },
      toggleModal: function toggleModal() {
        this.toggleProperty('isShowingModal');
      }
    }
  });
});
define("oto-client/components/sign-in-modal/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.5.1",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 2
              },
              "end": {
                "line": 27,
                "column": 2
              }
            },
            "moduleName": "oto-client/components/sign-in-modal/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h2");
            dom.setAttribute(el1, "class", "modal-header");
            var el2 = dom.createTextNode("GOOD JOB! ALMOST THERE!");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            dom.setAttribute(el1, "class", "subtle-text");
            var el2 = dom.createTextNode(" Please enter your user info so your friends can know who you are. ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "modal-field-container form");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "footer-button-container");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2, "class", "subtle-button auth-cancel-button cancel-button");
            var el3 = dom.createTextNode("\n        back\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2, "type", "submit");
            dom.setAttribute(el2, "class", "highlight-button circle auth-submit-button submit-button");
            var el3 = dom.createTextNode("\n        OK\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [5]);
            var element1 = dom.childAt(fragment, [7]);
            var element2 = dom.childAt(element1, [1]);
            var element3 = dom.childAt(element1, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createMorphAt(element0, 1, 1);
            morphs[1] = dom.createMorphAt(element0, 3, 3);
            morphs[2] = dom.createElementMorph(element2);
            morphs[3] = dom.createElementMorph(element3);
            return morphs;
          },
          statements: [["inline", "email-input", [], ["email", ["subexpr", "@mut", [["get", "credentials.email", ["loc", [null, [14, 26], [14, 43]]]]], [], []]], ["loc", [null, [14, 6], [14, 45]]]], ["inline", "password-input", [], ["password", ["subexpr", "@mut", [["get", "credentials.password", ["loc", [null, [15, 32], [15, 52]]]]], [], []]], ["loc", [null, [15, 6], [15, 54]]]], ["element", "action", ["toggleModal"], [], ["loc", [null, [19, 69], [19, 93]]]], ["element", "action", ["signIn"], [], ["loc", [null, [22, 93], [22, 112]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 28,
              "column": 0
            }
          },
          "moduleName": "oto-client/components/sign-in-modal/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "modal-dialog", [], ["close", "toggleModal", "translucentOverlay", true, "clickOutsideToClose", false, "containerClassNames", "oto-modal-container row", "overlay-class", "", "wrapper-class", "outer-container"], 0, null, ["loc", [null, [4, 2], [27, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 29,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/sign-in-modal/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("button");
        dom.setAttribute(el1, "class", "subtle-button sign-in-button");
        var el2 = dom.createTextNode("sign in");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "class", "icon ion-person");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createElementMorph(element4);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["element", "action", ["toggleModal"], [], ["loc", [null, [1, 45], [1, 69]]]], ["block", "if", [["get", "isShowingModal", ["loc", [null, [3, 6], [3, 20]]]]], [], 0, null, ["loc", [null, [3, 0], [28, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/components/sign-up-modal/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    credentials: {},
    isShowingModal: false,

    actions: {
      signUp: function signUp() {
        console.log(this.get('credentials'));
        this.sendAction('signUp', this.get('credentials'));
        this.toggleProperty('isShowingModal');
      },
      toggleModal: function toggleModal() {
        this.toggleProperty('isShowingModal');
      }
    }
  });
});
define("oto-client/components/sign-up-modal/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.5.1",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 0
              },
              "end": {
                "line": 35,
                "column": 2
              }
            },
            "moduleName": "oto-client/components/sign-up-modal/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h2");
            dom.setAttribute(el1, "class", "modal-header");
            var el2 = dom.createTextNode("GOOD JOB! ALMOST THERE!");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            dom.setAttribute(el1, "class", "subtle-text");
            var el2 = dom.createTextNode(" Please enter your user info so your friends can know who you are. ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "modal-field-container form");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "footer-button-container");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2, "class", "subtle-button auth-cancel-button cancel-button");
            var el3 = dom.createTextNode("\n        back\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2, "type", "submit");
            dom.setAttribute(el2, "class", "highlight-button circle auth-submit-button submit-button");
            var el3 = dom.createTextNode("\n        OK\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [5]);
            var element1 = dom.childAt(fragment, [7]);
            var element2 = dom.childAt(element1, [1]);
            var element3 = dom.childAt(element1, [3]);
            var morphs = new Array(7);
            morphs[0] = dom.createMorphAt(element0, 1, 1);
            morphs[1] = dom.createMorphAt(element0, 3, 3);
            morphs[2] = dom.createMorphAt(element0, 5, 5);
            morphs[3] = dom.createMorphAt(element0, 7, 7);
            morphs[4] = dom.createMorphAt(element0, 9, 9);
            morphs[5] = dom.createElementMorph(element2);
            morphs[6] = dom.createElementMorph(element3);
            return morphs;
          },
          statements: [["inline", "email-input", [], ["email", ["subexpr", "@mut", [["get", "credentials.email", ["loc", [null, [14, 26], [14, 43]]]]], [], []]], ["loc", [null, [14, 6], [14, 45]]]], ["inline", "input", [], ["type", "text", "id", "first-name", "placeholder", "FIRST NAME", "value", ["subexpr", "@mut", [["get", "credentials.firstName", ["loc", [null, [18, 20], [18, 41]]]]], [], []]], ["loc", [null, [15, 6], [18, 43]]]], ["inline", "input", [], ["type", "text", "id", "last-name", "placeholder", "LAST NAME", "value", ["subexpr", "@mut", [["get", "credentials.lastName", ["loc", [null, [22, 20], [22, 40]]]]], [], []]], ["loc", [null, [19, 6], [22, 42]]]], ["inline", "password-input", [], ["password", ["subexpr", "@mut", [["get", "credentials.password", ["loc", [null, [23, 32], [23, 52]]]]], [], []]], ["loc", [null, [23, 6], [23, 54]]]], ["inline", "password-confirmation-input", [], ["password", ["subexpr", "@mut", [["get", "credentials.passwordConfirmation", ["loc", [null, [24, 45], [24, 77]]]]], [], []]], ["loc", [null, [24, 6], [24, 79]]]], ["element", "action", ["toggleModal"], [], ["loc", [null, [28, 69], [28, 93]]]], ["element", "action", ["signUp"], [], ["loc", [null, [31, 93], [31, 112]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 36,
              "column": 0
            }
          },
          "moduleName": "oto-client/components/sign-up-modal/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "modal-dialog", [], ["close", "toggleModal", "translucentOverlay", true, "clickOutsideToClose", false, "containerClassNames", "oto-modal-container row", "overlay-class", "", "wrapper-class", "outer-container"], 0, null, ["loc", [null, [4, 0], [35, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 37,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/sign-up-modal/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("button");
        dom.setAttribute(el1, "class", "subtle-button sign-up-button");
        var el2 = dom.createTextNode("sign up");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "class", "icon ion-person-add");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createElementMorph(element4);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["element", "action", ["toggleModal"], [], ["loc", [null, [1, 45], [1, 69]]]], ["block", "if", [["get", "isShowingModal", ["loc", [null, [3, 6], [3, 20]]]]], [], 0, null, ["loc", [null, [3, 0], [36, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/components/tether-dialog', ['exports', 'ember-modal-dialog/components/tether-dialog'], function (exports, _emberModalDialogComponentsTetherDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsTetherDialog['default'];
    }
  });
});
define('oto-client/components/trip-details/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service(),
    user: _ember['default'].computed.alias('auth.credentials.email'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    actions: {
      submit: function submit() {
        console.log(this);
        var trip = {};
        trip.name = this.$('span.trip-name').text();
        trip.location = this.$('span.trip-location').text();
        trip.description = this.$('span.trip-description').text();
        console.log("Trip Update Form Submitted", trip);

        this.sendAction('submit', trip);
      },

      deleteTrip: function deleteTrip() {
        console.log("Delete Trip Clicked");
        var trip = this.get('trip');
        this.sendAction('deleteTrip', trip);
      },

      joinTrip: function joinTrip() {
        var trip = this.get('trip');
        var userId = this.get('auth.credentials.id');
        console.log("Join Trip", trip, userId);
        this.sendAction('joinTrip', trip, userId);
      }
    }
  });
});
define("oto-client/components/trip-details/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 6
            },
            "end": {
              "line": 25,
              "column": 6
            }
          },
          "moduleName": "oto-client/components/trip-details/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "sm-circle user-icon");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "invitation.userInit", ["loc", [null, [24, 40], [24, 63]]]]],
        locals: ["invitation"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 35,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/trip-details/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "trip-details-header");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3, "class", "trip-name");
        dom.setAttribute(el3, "contenteditable", "");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        dom.setAttribute(el2, "class", "subtle-text small-text");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" -\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        dom.setAttribute(el2, "class", "subtle-text small-text");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3, "class", "trip-location");
        dom.setAttribute(el3, "contenteditable", "");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "trip-details-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3, "class", "small-text trip-description");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4, "class", "trip-description");
        dom.setAttribute(el4, "contenteditable", "");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        dom.setAttribute(el3, "class", "partipants-list-header");
        var el4 = dom.createTextNode("Participants");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3, "class", "participants-list");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3, "class", "subtle-text small-text");
        var el4 = dom.createTextNode("Share:");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "trip-action-button-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "class", "highlight-button pill-button");
        var el5 = dom.createTextNode("Join Trip");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "class", "highlight-button pill-button");
        var el5 = dom.createTextNode("Submit Changes");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "class", "danger-button pill-button");
        var el5 = dom.createTextNode("Delete Trip");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [1]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(fragment, [3, 1]);
        var element3 = dom.childAt(element2, [8, 3]);
        var element4 = dom.childAt(element2, [10]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element4, [3]);
        var element7 = dom.childAt(element4, [5]);
        var morphs = new Array(11);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]), 0, 0);
        morphs[1] = dom.createMorphAt(element1, 1, 1);
        morphs[2] = dom.createMorphAt(element1, 3, 3);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [5, 1]), 0, 0);
        morphs[4] = dom.createMorphAt(dom.childAt(element2, [1, 1]), 0, 0);
        morphs[5] = dom.createMorphAt(dom.childAt(element2, [6]), 1, 1);
        morphs[6] = dom.createAttrMorph(element3, 'href');
        morphs[7] = dom.createMorphAt(element3, 0, 0);
        morphs[8] = dom.createElementMorph(element5);
        morphs[9] = dom.createElementMorph(element6);
        morphs[10] = dom.createElementMorph(element7);
        return morphs;
      },
      statements: [["content", "trip.name", ["loc", [null, [5, 44], [5, 57]]]], ["inline", "moment-format", [["get", "trip.startDate", ["loc", [null, [8, 20], [8, 34]]]], "ll"], [], ["loc", [null, [8, 4], [8, 41]]]], ["inline", "moment-format", [["get", "trip.endDate", ["loc", [null, [9, 20], [9, 32]]]], "ll"], [], ["loc", [null, [9, 4], [9, 39]]]], ["content", "trip.location", ["loc", [null, [12, 48], [12, 65]]]], ["content", "trip.description", ["loc", [null, [18, 53], [18, 73]]]], ["block", "each", [["get", "trip.invitations", ["loc", [null, [23, 14], [23, 30]]]]], [], 0, null, ["loc", [null, [23, 6], [25, 15]]]], ["attribute", "href", ["get", "trip.url", ["loc", [null, [27, 60], [27, 68]]]]], ["content", "trip.url", ["loc", [null, [27, 71], [27, 83]]]], ["element", "action", ["joinTrip"], [], ["loc", [null, [29, 51], [29, 72]]]], ["element", "action", ["submit"], [], ["loc", [null, [30, 51], [30, 70]]]], ["element", "action", ["deleteTrip"], [], ["loc", [null, [31, 48], [31, 71]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/components/trip-summary/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("oto-client/components/trip-summary/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "oto-client/components/trip-summary/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "trip-summary-info-container");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          dom.setAttribute(el2, "class", "trip-summary-title");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2, "class", "trip-summary-subtitle subtle-text small-text");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" days - ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(element1, 0, 0);
          morphs[2] = dom.createMorphAt(element1, 2, 2);
          return morphs;
        },
        statements: [["content", "trip.name", ["loc", [null, [3, 35], [3, 48]]]], ["content", "trip.tripLength", ["loc", [null, [4, 60], [4, 79]]]], ["content", "trip.location", ["loc", [null, [4, 87], [4, 104]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 0
          }
        },
        "moduleName": "oto-client/components/trip-summary/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "link-to", ["trip", ["get", "trip", ["loc", [null, [1, 18], [1, 22]]]]], ["tagName", "button", "class", "highlight-button trip-summary-button"], 0, null, ["loc", [null, [1, 0], [6, 12]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('oto-client/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('oto-client/flash/object', ['exports', 'ember-cli-flash/flash/object'], function (exports, _emberCliFlashFlashObject) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashFlashObject['default'];
    }
  });
});
define('oto-client/helpers/is-after', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/is-after'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersIsAfter) {
  exports['default'] = _emberMomentHelpersIsAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/is-before', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/is-before'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersIsBefore) {
  exports['default'] = _emberMomentHelpersIsBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/is-between', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/is-between'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersIsBetween) {
  exports['default'] = _emberMomentHelpersIsBetween['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/is-same-or-after', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersIsSameOrAfter) {
  exports['default'] = _emberMomentHelpersIsSameOrAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/is-same-or-before', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersIsSameOrBefore) {
  exports['default'] = _emberMomentHelpersIsSameOrBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/is-same', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/is-same'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersIsSame) {
  exports['default'] = _emberMomentHelpersIsSame['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/moment-calendar', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersMomentCalendar) {
  exports['default'] = _emberMomentHelpersMomentCalendar['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('oto-client/helpers/moment-format', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/moment-from-now', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/moment-to-now', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('oto-client/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _emberMomentHelpersNow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersNow['default'];
    }
  });
});
define('oto-client/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('oto-client/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('oto-client/index/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    model: function model() {
      // console.log("Index Page", this.get('isAuthenticated'));
      if (this.get('isAuthenticated')) {
        this.transitionTo('trips');
      }
    }
  });
});
define("oto-client/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 37,
            "column": 0
          }
        },
        "moduleName": "oto-client/index/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        dom.setAttribute(el1, "class", "oto-logo");
        var el2 = dom.createTextNode("OTO");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row oto-subtitle-row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "oto-subtitle-container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        dom.setAttribute(el3, "class", "oto-subtitle");
        var el4 = dom.createTextNode("Outdoor");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("Trip");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("Organizer");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        return morphs;
      },
      statements: [["content", "create-trip-button", ["loc", [null, [34, 0], [34, 22]]]], ["content", "outlet", ["loc", [null, [36, 0], [36, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("oto-client/initializers/active-model-adapter", ["exports", "active-model-adapter", "active-model-adapter/active-model-serializer"], function (exports, _activeModelAdapter, _activeModelAdapterActiveModelSerializer) {
  exports["default"] = {
    name: 'active-model-adapter',
    initialize: function initialize() {
      var application = arguments[1] || arguments[0];
      application.register('adapter:-active-model', _activeModelAdapter["default"]);
      application.register('serializer:-active-model', _activeModelAdapterActiveModelSerializer["default"]);
    }
  };
});
define('oto-client/initializers/add-modals-container', ['exports', 'ember-modal-dialog/initializers/add-modals-container'], function (exports, _emberModalDialogInitializersAddModalsContainer) {
  exports['default'] = {
    name: 'add-modals-container',
    initialize: _emberModalDialogInitializersAddModalsContainer['default']
  };
});
define('oto-client/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'oto-client/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _otoClientConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_otoClientConfigEnvironment['default'].APP.name, _otoClientConfigEnvironment['default'].APP.version)
  };
});
define('oto-client/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('oto-client/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('oto-client/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('oto-client/initializers/export-application-global', ['exports', 'ember', 'oto-client/config/environment'], function (exports, _ember, _otoClientConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_otoClientConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _otoClientConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_otoClientConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('oto-client/initializers/flash-messages', ['exports', 'ember', 'oto-client/config/environment'], function (exports, _ember, _otoClientConfigEnvironment) {
  exports.initialize = initialize;
  var merge = _ember['default'].merge;
  var deprecate = _ember['default'].deprecate;

  var INJECTION_FACTORIES_DEPRECATION_MESSAGE = '[ember-cli-flash] Future versions of ember-cli-flash will no longer inject the service automatically. Instead, you should explicitly inject it into your Route, Controller or Component with `Ember.inject.service`.';
  var addonDefaults = {
    timeout: 3000,
    extendedTimeout: 0,
    priority: 100,
    sticky: false,
    showProgress: false,
    type: 'info',
    types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
    injectionFactories: ['route', 'controller', 'view', 'component'],
    preventDuplicates: false
  };

  function initialize() {
    var application = arguments[1] || arguments[0];

    var _ref = _otoClientConfigEnvironment['default'] || {};

    var flashMessageDefaults = _ref.flashMessageDefaults;

    var _ref2 = flashMessageDefaults || [];

    var injectionFactories = _ref2.injectionFactories;

    var options = merge(addonDefaults, flashMessageDefaults);
    var shouldShowDeprecation = !(injectionFactories && injectionFactories.length);

    application.register('config:flash-messages', options, { instantiate: false });
    application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');

    deprecate(INJECTION_FACTORIES_DEPRECATION_MESSAGE, shouldShowDeprecation, {
      id: 'ember-cli-flash.deprecate-injection-factories',
      until: '2.0.0'
    });

    options.injectionFactories.forEach(function (factory) {
      application.inject(factory, 'flashMessages', 'service:flash-messages');
    });
  }

  exports['default'] = {
    name: 'flash-messages',
    initialize: initialize
  };
});
define('oto-client/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('oto-client/initializers/local-storage-adapter', ['exports', 'ember-local-storage/initializers/local-storage-adapter'], function (exports, _emberLocalStorageInitializersLocalStorageAdapter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter.initialize;
    }
  });
});
define('oto-client/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('oto-client/initializers/text-field', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;

  function initialize() {
    _ember['default'].TextField.reopen({
      classNames: ['form-control']
    });
  }

  exports['default'] = {
    name: 'text-field',
    initialize: initialize
  };
});
define('oto-client/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("oto-client/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('oto-client/invitation/model', ['exports', 'ember', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _ember, _emberDataModel, _emberDataAttr, _emberDataRelationships) {
  exports['default'] = _emberDataModel['default'].extend({
    status: (0, _emberDataAttr['default'])('string'),
    user: (0, _emberDataRelationships.belongsTo)('user'),
    trip: (0, _emberDataRelationships.belongsTo)('trip'),
    userInit: _ember['default'].computed('user.initial', function () {
      return this.get('user.initial');
    })
  });
});
define('oto-client/invitations/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('invitation');
    },

    actions: {
      createInvitation: function createInvitation() {
        console.log("Create Invitation Clicked");
        var data = {
          status: "going",
          trip_id: '70',
          user_id: '1'
        };
        console.log(data);
        var invitation = this.get('store').createRecord('invitation', data);
        console.log("Invitation in Store", invitation.get('trip'));
        invitation.save().then(function (invitation) {
          return console.log(invitation);
        });
      }
    }
  });

  // createTrip (data) {
  //   console.log("Create Trip Action Fired", data);
  //   if(this.get('isAuthenticated')) {
  //     Ember.set(data, 'start_date', new Date(data.start_date));
  //     // let trip = this.get('store').createRecord('trip', data);
  //     // console.log(trip);
  //     // return trip.save();
  //     let trip = this.get('store').createRecord('trip', data);
  //     trip.save()
  //     .then((trip) => {
  //       this.transitionTo('trip', trip);
  //     })
  //     .catch(() => {
  //       this.get('flashMessages')
  //       .danger('There was a problem. Please try again, making sure you have filled out all required fields.');
  //     });
  //   } else {
  //     this.get('flashMessages').warning("Please sign in to create a trip!");
  //   }
  // }
});
define("oto-client/invitations/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "oto-client/invitations/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(", ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(", ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element0, 0, 0);
          morphs[1] = dom.createMorphAt(element0, 2, 2);
          morphs[2] = dom.createMorphAt(element0, 4, 4);
          return morphs;
        },
        statements: [["content", "invitation.user.email", ["loc", [null, [2, 5], [2, 30]]]], ["content", "invitation.status", ["loc", [null, [2, 32], [2, 53]]]], ["content", "invitation.trip.name", ["loc", [null, [2, 55], [2, 79]]]]],
        locals: ["invitation"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "oto-client/invitations/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("button");
        var el2 = dom.createTextNode("Create Invitation");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [2]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createElementMorph(element1);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [1, 8], [1, 13]]]]], [], 0, null, ["loc", [null, [1, 0], [3, 9]]]], ["element", "action", ["createInvitation"], [], ["loc", [null, [5, 8], [5, 37]]]], ["content", "outlet", ["loc", [null, [7, 0], [7, 10]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('oto-client/router', ['exports', 'ember', 'oto-client/config/environment'], function (exports, _ember, _otoClientConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _otoClientConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    // this.route('sign-up');
    // this.route('sign-in');
    // this.route('change-password');
    this.route('users');
    this.route('trips', function () {
      this.route('new');
    });
    this.route('trip', { path: '/trips/:trip_id' });
    this.route('invitations');
  });

  exports['default'] = Router;
});
define('oto-client/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('oto-client/services/flash-messages', ['exports', 'ember-cli-flash/services/flash-messages'], function (exports, _emberCliFlashServicesFlashMessages) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashServicesFlashMessages['default'];
    }
  });
});
define('oto-client/services/modal-dialog', ['exports', 'ember-modal-dialog/services/modal-dialog'], function (exports, _emberModalDialogServicesModalDialog) {
  exports['default'] = _emberModalDialogServicesModalDialog['default'];
});
define('oto-client/services/moment', ['exports', 'ember', 'oto-client/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _otoClientConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_otoClientConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define('oto-client/templates/components/modal-dialog', ['exports', 'ember-modal-dialog/templates/components/modal-dialog'], function (exports, _emberModalDialogTemplatesComponentsModalDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogTemplatesComponentsModalDialog['default'];
    }
  });
});
define('oto-client/templates/components/tether-dialog', ['exports', 'ember-modal-dialog/templates/components/tether-dialog'], function (exports, _emberModalDialogTemplatesComponentsTetherDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogTemplatesComponentsTetherDialog['default'];
    }
  });
});
define('oto-client/trip/model', ['exports', 'ember-data/model', 'ember', 'ember-data/attr', 'ember-data/relationships'], function (exports, _emberDataModel, _ember, _emberDataAttr, _emberDataRelationships) {
  // const moment = require('moment');

  exports['default'] = _emberDataModel['default'].extend({
    name: (0, _emberDataAttr['default'])('string'),
    description: (0, _emberDataAttr['default'])('string'),
    startDate: (0, _emberDataAttr['default'])('date'),
    endDate: (0, _emberDataAttr['default'])('date'),
    location: (0, _emberDataAttr['default'])('string'),
    invitations: (0, _emberDataRelationships.hasMany)('invitation'),
    tripLength: _ember['default'].computed('startDate', 'endDate', function () {
      return Math.round((this.get('endDate') - this.get('startDate')) / (1000 * 60 * 60 * 24));
    }),
    url: _ember['default'].computed('id', function () {
      return 'http://soynog.github.io/oto-client/trips/' + this.get('id');
    }),
    isInvited: function isInvited(userId) {
      return this.get('invitations').any(function (inv) {
        return inv.get('user.id') === userId.toString();
      });
    }
    // invitations: attr(),
    // users: hasMany('user')
  });
});
define('oto-client/trip/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    user: _ember['default'].computed.alias('auth.credentials.id'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    flashMessages: _ember['default'].inject.service(),

    model: function model(params) {
      return this.get('store').findRecord('trip', params.trip_id);
    },

    actions: {

      updateTrip: function updateTrip(data) {
        var _this = this;

        console.log("Authenticated?", this.get('isAuthenticated'));
        var id = this.context.get('id');
        var store = this.get('store');
        console.log("Update Trip Action Fired!", data, id);
        store.findRecord('trip', id).then(function (trip) {
          console.log(data);
          console.log(trip.get('name'), trip.get('description'));
          trip.set('name', data.name);
          trip.set('location', data.location);
          trip.set('description', data.description);
          return trip;
        }).then(function (trip) {
          return trip.save();
        })['catch'](function () {
          _this.get('flashMessages').danger('Please sign in to edit a trip.');
        });
      },

      deleteTrip: function deleteTrip(trip) {
        console.log("Delete Trip Action Fired", trip);
        trip.destroyRecord().then(this.transitionTo('trips'));
      },

      joinTrip: function joinTrip(trip, userId) {
        var _this2 = this;

        if (!trip.isInvited(userId)) {
          this.get('store').findRecord('user', userId).then(function (user) {
            var data = {
              status: "going",
              trip: trip,
              user: user
            };
            return data;
          }).then(function (data) {
            var invitation = _this2.get('store').createRecord('invitation', data);
            invitation.save();
          })['catch'](function () {
            _this2.get('flashMessages').warning('Sorry, something went wrong. Have you already joined this trip?');
          });
        } else {
          console.log("You've already joined!");
        }
      }

    }
  });
});
define("oto-client/trip/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "oto-client/trip/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "trip-details", [], ["trip", ["subexpr", "@mut", [["get", "model", ["loc", [null, [1, 20], [1, 25]]]]], [], []], "submit", "updateTrip", "deleteTrip", "deleteTrip", "joinTrip", "joinTrip"], ["loc", [null, [1, 0], [5, 15]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/trips/index/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    model: function model() {
      var _this = this;

      console.log("User Home Page", this.get('isAuthenticated'));
      if (!this.get('isAuthenticated')) {
        this.transitionTo('application');
      } else {
        return this.store.findAll('trip')['catch'](function (err) {
          var status = err.errors[0].status;
          if (status === "401") {
            // If unauthorized because of old token, clear auth info and transition to homepage
            _this.get('auth').clearCreds();
            _this.transitionTo('application');
          }
        });
      }
    }
  });
});
define("oto-client/trips/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 4,
              "column": 2
            }
          },
          "moduleName": "oto-client/trips/index/template.hbs"
        },
        isEmpty: false,
        arity: 2,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "trip-summary", [], ["trip", ["subexpr", "@mut", [["get", "trip", ["loc", [null, [3, 24], [3, 28]]]]], [], []], "index", ["subexpr", "@mut", [["get", "index", ["loc", [null, [3, 35], [3, 40]]]]], [], []], "class", "trip-summary-container"], ["loc", [null, [3, 4], [3, 73]]]]],
        locals: ["trip", "index"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "oto-client/trips/index/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "trip-list-container row");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [2, 10], [2, 15]]]]], [], 0, null, ["loc", [null, [2, 2], [4, 11]]]], ["content", "create-trip-button", ["loc", [null, [7, 0], [7, 22]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('oto-client/trips/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),
    flashMessages: _ember['default'].inject.service(),

    actions: {
      createTrip: function createTrip(data) {
        var _this = this;

        console.log("Create Trip Action Fired", data);
        if (this.get('isAuthenticated')) {
          _ember['default'].set(data, 'start_date', new Date(data.start_date));
          // let trip = this.get('store').createRecord('trip', data);
          // console.log(trip);
          // return trip.save();
          var trip = this.get('store').createRecord('trip', data);
          trip.save().then(function (trip) {
            _this.transitionTo('trip', trip);
          })['catch'](function () {
            _this.get('flashMessages').danger('There was a problem. Please try again, making sure you have filled out all required fields.');
          });
        } else {
          this.get('flashMessages').warning("Please sign in to create a trip!");
        }
      }
    }
  });
});
define("oto-client/trips/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 0
          }
        },
        "moduleName": "oto-client/trips/new/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "create-trip-header row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        dom.setAttribute(el2, "class", "new-trip-heading");
        var el3 = dom.createTextNode("START YOUR TRIP");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        dom.setAttribute(el2, "class", "small-text subtle-text");
        var el3 = dom.createTextNode("Fill out your main info; you can always change it later.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["inline", "new-trip-form", [], ["submit", "createTrip"], ["loc", [null, [6, 0], [6, 37]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/trips/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("oto-client/trips/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "oto-client/trips/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('oto-client/user/model', ['exports', 'ember', 'ember-data', 'ember-data/relationships'], function (exports, _ember, _emberData, _emberDataRelationships) {
  exports['default'] = _emberData['default'].Model.extend({
    email: _emberData['default'].attr('string'),
    firstName: _emberData['default'].attr('string'),
    lastName: _emberData['default'].attr('string'),
    // trips: hasMany('trip'),
    invitations: (0, _emberDataRelationships.hasMany)('invitation'),
    initial: _ember['default'].computed('firstName', function () {
      var name = this.get('firstName');
      if (name) {
        return name.charAt(0);
      } else {
        return 'X';
      }
    })
  });
});
define('oto-client/users/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('user');
    }
  });
});
define("oto-client/users/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "oto-client/users/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "user.email", ["loc", [null, [5, 6], [5, 20]]]]],
        locals: ["user"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "oto-client/users/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Users");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [4, 8], [4, 13]]]]], [], 0, null, ["loc", [null, [4, 0], [6, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('oto-client/config/environment', ['ember'], function(Ember) {
  var prefix = 'oto-client';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("oto-client/app")["default"].create({"name":"oto-client","version":"0.0.0+73322b57"});
}

/* jshint ignore:end */
//# sourceMappingURL=oto-client.map