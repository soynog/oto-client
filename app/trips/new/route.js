import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    createTrip (data) {
      console.log("Create Trip Action Fired", data);
      Ember.set(data, 'start_date', new Date(data.start_date));
      let trip = this.get('store').createRecord('trip', data);
      console.log(trip);
      return trip.save();
    }
  }
});
