import Ember from 'ember';

export default Ember.Component.extend({
  passwords: {},
  isShowingModal: false,

  actions: {
    changePW () {
      this.sendAction('changePW', this.get('passwords'));
      this.toggleProperty('isShowingModal');
    },
    toggleModal () {
      this.toggleProperty('isShowingModal');
    },
  },
});
