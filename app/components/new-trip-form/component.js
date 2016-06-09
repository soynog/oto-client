import Ember from 'ember';

export default Ember.Component.extend({
  form: {},

  actions: {
    submit () {
      // Substitute Start and End Date fields for new Date objects
      let startDate = new Date(Ember.get(this.form, 'startDate'));
      let endDate = new Date(Ember.get(this.form, 'endDate'));
      Ember.set(this.form, 'startDate', startDate);
      Ember.set(this.form, 'endDate', endDate);
      console.log("Form is: ", this.form);

      // Pass action up
      this.sendAction('submit', this.get('form'));
    },
  },
});
