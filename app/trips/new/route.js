import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    createTrip (data) {
      console.log("Create Trip Action Fired", data);
      let trip = this.get('store').createRecord('trip', data);
      return trip.save();
    }
  }
});
