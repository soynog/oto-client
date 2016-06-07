import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service(),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),
  flashMessages: Ember.inject.service(),

  actions: {
    createTrip (data) {
      console.log("Create Trip Action Fired", data);
      if(this.get('isAuthenticated')) {
        Ember.set(data, 'start_date', new Date(data.start_date));
        let trip = this.get('store').createRecord('trip', data);
        console.log(trip);
        return trip.save();
      } else {
        this.get('flashMessages').warning("Please sign in to create a trip!");
      }
    }
  }
});
