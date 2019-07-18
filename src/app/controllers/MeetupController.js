import * as Yup from 'yup';
import { startOfHour, isBefore, subHours } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object.shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
      time: Yup.string().required(),
    });

    req.body.user_id = req.userId;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    /**
     * Check if date is in the past
     */
    const hourStart = startOfHour(req.body.date);

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const {
      title,
      description,
      location,
      date,
      banner_id,
      user_id,
      time,
    } = await Meetup.create(req.body);

    return res.json({
      title,
      description,
      location,
      date,
      banner_id,
      user_id,
      time,
    });
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    /**
     * Check if meetup exists
     */

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exist.' });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Permission denied.' });
    }

    const subDate = subHours(meetup.date, 4);

    if (isBefore(subDate, new Date())) {
      return res.status(401).json({
        error: 'Permission Denied. You can only cancel  4 hours in advance.',
      });
    }

    const {
      title,
      description,
      location,
      date,
      time,
      banner_id,
      user_id,
    } = await meetup.update(req.body);

    return res.json({
      title,
      description,
      location,
      date,
      time,
      banner_id,
      user_id,
    });
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    /**
     * Check if meetup exists
     */

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exist.' });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Permission denied.' });
    }

    await meetup.destroy();

    return res.json(meetup);
  }
}

export default new MeetupController();
