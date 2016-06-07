import Ember from 'ember';

export default Ember.Component.extend({
  credentials: {},
  isShowingModal: false,

  actions: {
    signUp () {
      console.log(this.get('credentials'));
      this.sendAction('signUp', this.get('credentials'));
      this.toggleProperty('isShowingModal');
    },
    toggleModal () {
      this.toggleProperty('isShowingModal');
    },
  },
});
