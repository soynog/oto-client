import Ember from 'ember';

export default Ember.Component.extend({
  credentials: {},
  isShowingModal: false,

  actions: {
    signIn () {
      this.sendAction('signIn', this.get('credentials'));
      this.toggleProperty('isShowingModal');
    },
    toggleModal () {
      this.toggleProperty('isShowingModal');
    },
  },
});
