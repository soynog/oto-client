import Ember from 'ember';

export default Ember.Component.extend({
  form: {},

  actions: {
    submit () {
      console.log("Form is: ", this.form);
      this.sendAction('submit', this.get('form'));
    },
  },
});
