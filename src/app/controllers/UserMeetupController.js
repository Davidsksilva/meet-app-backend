import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import Subscriptions from '../models/Subscription';

class UserMeetupController {
  async organizing(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      order: ['date'],
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
      include: [
        {
          model: File,
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(meetups);
  }

  async subscribed(req, res) {
    const { page = 1 } = req.query;

    const subscriptions = await Subscriptions.findAll({
      where: { user_id: req.userId },
    });

    const meetupIds = subscriptions.map(sub => sub.meetup_id);

    const meetups = await Meetup.findAll({
      where: { id: { [Op.or]: meetupIds } },
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
      include: [
        {
          model: File,
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new UserMeetupController();
