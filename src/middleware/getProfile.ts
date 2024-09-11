import { Request, Response, NextFunction } from 'express';

export const getProfile = async (req: Request | any, res: Response, next: NextFunction) => {
  const { Profile } = req.app.get('models');
  const profileId = req.get('profile_id') || 0;  // Get profile_id from headers

  const profile = await Profile.findOne({ where: { id: profileId } });
  if (!profile) return res.status(401).end();

  req.profile = profile;
  next();
};
