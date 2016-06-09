import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.store.findAll('invitation');
  },

  actions: {
    createInvitation () {
      console.log("Create Invitation Clicked");
      let data = {
        status: "going",
        trip_id: '70',
        user_id: '1'
      };
      console.log(data);
      let invitation = this.get('store').createRecord('invitation', data);
      console.log("Invitation in Store", invitation.get('trip'));
      invitation.save().then((invitation) => console.log(invitation));
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
