import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service(),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

  model() {
    console.log("User Home Page", this.get('isAuthenticated'));
    if(!this.get('isAuthenticated')) {
      this.transitionTo('application');
    } else {
      return this.store.findAll('trip')
      .catch((err) => {
        let status = err.errors[0].status;
        if (status === "401") {
          // If unauthorized because of old token, clear auth info and transition to homepage
          this.get('auth').clearCreds();
          this.transitionTo('application');
        }
      });
    }
  }
});
