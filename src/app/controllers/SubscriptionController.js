import { startOfHour, isBefore, isSameDay } from 'date-fns';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const { meetup_id } = req.params.id;

    const meetup = await Meetup.findByPk(meetup_id);

    /**
     * Check user permission
     */
    if (req.userId === meetup.user_id) {
      return res
        .status(401)
        .json({ error: 'Permission denied. You are the Meetup organizer.' });
    }

    /**
     * Check if user is already subscribed to the meetup
     */
    const checkSubscription = await Subscription.findAll({
      where: { user_id: req.userId, meetup_id },
    });

    if (checkSubscription) {
      return res.status(400).json({ error: 'You are already subscribed.' });
    }

    /**
     * Check for other meetups
     */
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId },
    });

    const checkTimeOverlap = await subscriptions.map(async sub => {
      const currMeetup = await Meetup.findByPk(sub.meetup_id);

      return (
        isSameDay(meetup.date, currMeetup.date) &&
        meetup.time === currMeetup.time
      );
    });

    if (checkTimeOverlap) {
      return res
        .status(400)
        .json({ error: 'You already have a meetup on this schedule.' });
    }

    /**
     * Check if date is in the past
     */
    const hourStart = startOfHour(meetup.date);

    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'This meetup has already happened.' });
    }

    const { user_id } = await Subscription.create({
      user_id: req.userId,
      meetup_id,
    });

    return res.json({
      user_id,
      meetup_id,
    });
  }
}

export default new SubscriptionController();
