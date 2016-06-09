import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service(),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

  model() {
    console.log("User Home Page");
    if(!this.get('isAuthenticated')) {
      this.transitionTo('application');
    } else {
      return this.store.findAll('trip');
    }
  }
});
