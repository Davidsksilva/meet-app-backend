import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { subscription } = data;

    await Mail.sendMail({
      to: `${subscription.meetup_id.user_id.name} < ${subscription.meetup_id.user_id.email}`,
      subject: `New subscription to ${subscription.meetup_id.title}`,
      template: 'subscription',
      context: {
        owner: subscription.meetup_id.user_id.name,
        user: subscription.user_id.name,
        meetup: subscription.meetup_id.title,
      },
    });
  }
}

export default new SubscriptionMail();
