import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service(),
  flashMessages: Ember.inject.service(),

  actions: {
    signOut () {
      this.get('auth').signOut()
      .then(() => this.transitionTo('application'))
      // .then(() => {
      //   this.get('flashMessages').warning('You have been signed out.');
      // })
      .catch(() => {
        this.get('flashMessages')
        .danger('There was a problem. Are you sure you\'re signed-in?');
      });
      this.store.unloadAll();
    },

    error (reason) {
      let unauthorized = reason.errors.some((error) =>
        error.status === '401'
      );

      if (unauthorized) {
        this.get('flashMessages')
        .danger('You must be authenticated to access this page.');
        // this.transitionTo('/sign-in');
      } else {
        console.log("Error Reason: ", reason);
        this.get('flashMessages')
        .danger('There was a problem. Please try again.');
      }

      return false;
    },

    signIn (credentials) {
      return this.get('auth').signIn(credentials)
      .then(() => this.refresh())
      // .then(() => this.get('flashMessages').success('Thanks for signing in!'))
      .catch((err) => {
        // console.log("Caught Sign In Error in Route.js", err.name);
        let errorName = err.name;
        if (errorName === "TransitionAborted") {
          console.log("Transition Aborted. NBD.");
        } else {
          console.log("There was a problem.");
          this.get('flashMessages')
          .danger('There was a problem. Please try again.');
        }
      });
    },

    signUp (credentials) {
      console.log("Sign Up Action: ", credentials);
      this.get('auth').signUp(credentials)
      .then(() => this.get('auth').signIn(credentials))
      .then(() => this.refresh())
      // .then(() => {
      //   this.get('flashMessages')
      //   .success('Successfully signed-up! You have also been signed-in.');
      // })
      .catch((err) => {
        // console.log("Caught Sign Up Error in Route.js", err.name);
        let errorName = err.name;
        if (errorName === "TransitionAborted") {
          console.log("Transition Aborted. NBD.");
        } else {
          console.log("There was a problem.");
          this.get('flashMessages')
          .danger('There was a problem. Please try again.');
        }
      });
    },

    changePW (passwords) {
      this.get('auth').changePassword(passwords)
      .then(() => {
        this.get('flashMessages')
        .success('Successfully changed your password!');
      })
      .catch(() => {
        this.get('flashMessages')
        .danger('There was a problem. Please try again.');
      });
    },

    home () {
      this.transitionTo('application');
    }
  },
});
