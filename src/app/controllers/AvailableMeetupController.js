import { isSameDay } from 'date-fns';
import Meetup from '../models/Meetup';

class AvailableMeetupController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    const meetups = await Meetup.findAll({
      order: ['date', 'ASC'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'title',
        'description',
        'location',
        'date',
        'time',
        'user_id',
      ],
    });

    const filteredMeetups = meetups.map(meetup => isSameDay(date, meetup.date));

    return res.json(filteredMeetups);
  }
}

export default new AvailableMeetupController();
