import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service(),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

  model () {
    // console.log("Index Page", this.get('isAuthenticated'));
    if(this.get('isAuthenticated')) {
      this.transitionTo('trips');
    }
  }
});
