import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service(),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

  model () {
    if(this.isAuthenticated) {
      this.transitionTo('trips');
    }
  }
});
