import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),

  user: Ember.computed.alias('auth.credentials.email'),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

  isShowingModal: false,
  credentials: {},

  actions: {
    signOut () {
      this.sendAction('signOut');
    },
    toggleModal () {
      this.toggleProperty('isShowingModal');
    },
    signIn () {
      this.sendAction('signIn', this.get('credentials'));
      this.toggleProperty('isShowingModal');
    },
  },
});
